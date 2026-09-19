const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testLightbox() {
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

    // Scroll posters into view and click the first poster
    const clickRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const section = document.querySelector('.framer-1leqxa3');
          if (!section) return { error: 'No .framer-1leqxa3 section found' };
          section.scrollIntoView({ block: 'center' });
          const poster = section.querySelector('a, .framer-1gwykho-container, img');
          if (!poster) return { error: 'No poster element found' };
          const img = poster.querySelector('img') || poster;
          // Simulate click
          poster.click();
          const lightbox = document.getElementById('poster-lightbox');
          const lbImg = document.getElementById('lightbox-img');
          return {
            clickedTag: poster.tagName,
            lightboxDisplay: lightbox ? window.getComputedStyle(lightbox).display : null,
            lightboxOpacity: lightbox ? window.getComputedStyle(lightbox).opacity : null,
            lightboxImgSrc: lbImg ? lbImg.src : null
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Click result:', clickRes.result.value);

    await new Promise(r => setTimeout(r, 500));

    // Capture screenshot
    const ssRes = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });

    if (ssRes && ssRes.data) {
      fs.writeFileSync('scratch/lightbox_screenshot.png', Buffer.from(ssRes.data, 'base64'));
      console.log('Saved scratch/lightbox_screenshot.png');
    }

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

testLightbox();
