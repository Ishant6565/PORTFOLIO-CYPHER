const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function capture() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_session',
    'http://localhost:3000/'
  ]);

  await new Promise(r => setTimeout(r, 3000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9222/json', res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = list.find(p => p.url.includes('localhost:3000')) || list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.id === id) {
            ws.removeEventListener('message', handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await new Promise(r => setTimeout(r, 2500));

    // Scroll testimonials / certificates into view
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('testimonials') || 
                     document.querySelector('[data-framer-name=\"Testimonials Section\"]') ||
                     document.querySelector('.framer-oiibR');
          if (el) el.scrollIntoView({ block: 'center' });
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1000));

    // Screenshot of testimonials
    const ssRes = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });

    if (ssRes && ssRes.data) {
      fs.writeFileSync('scratch/certs_screenshot.png', Buffer.from(ssRes.data, 'base64'));
      console.log('Saved certs screenshot');
    }

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

capture();
