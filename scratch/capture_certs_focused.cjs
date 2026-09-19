const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function captureCerts() {
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

    // Scroll directly to .framer-1nq91on
    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.querySelector('.framer-1nq91on, .framer-8rrbdk, [data-framer-name="Testimonials Section"]');
          if (el) {
            el.scrollIntoView({ block: 'start' });
            return {
              found: true,
              top: el.getBoundingClientRect().top,
              cardsCount: el.querySelectorAll('.framer-oiibR, .framer-118v47e, [data-framer-name="Front Face"], [data-framer-name="Back Face"]').length,
              googleLogos: el.querySelectorAll('img[src*="google-cert-logo"]').length
            };
          }
          return { found: false };
        })()
      `,
      returnByValue: true
    });

    console.log('Certificates scroll eval:', res.result.value);

    await new Promise(r => setTimeout(r, 1000));

    const ss = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    if (ss && ss.data) {
      fs.writeFileSync('scratch/certs_focused.png', Buffer.from(ss.data, 'base64'));
      console.log('Saved scratch/certs_focused.png');
    }

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

captureCerts();
