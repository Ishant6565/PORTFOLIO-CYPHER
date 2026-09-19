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

    // Scroll absolute bottom into view
    const scrollInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const els = [document.documentElement, document.body, ...document.querySelectorAll('div')];
          let maxScroll = 0;
          let scrollableEl = document.documentElement;
          for (const el of els) {
            if (el.scrollHeight > maxScroll && (el.clientHeight < el.scrollHeight || el === document.documentElement)) {
              maxScroll = el.scrollHeight;
              scrollableEl = el;
            }
          }
          window.scrollTo(0, maxScroll);
          scrollableEl.scrollTop = maxScroll;
          const footer = document.querySelector('footer, .framer-788ly6');
          if (footer) footer.scrollIntoView();
          return { maxScroll, tag: scrollableEl.tagName, className: scrollableEl.className };
        })()
      `,
      returnByValue: true
    });
    console.log('Scroll info:', scrollInfo.result.value);

    await new Promise(r => setTimeout(r, 1000));

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const footer = document.querySelector('footer, .framer-788ly6');
          const watermark = document.querySelector('.framer-3vb2n7');
          return JSON.stringify({
            footerFound: !!footer,
            watermarkFound: !!watermark,
            watermarkHTML: watermark ? watermark.outerHTML.slice(0, 300) : null,
            watermarkStyle: watermark ? {
              display: window.getComputedStyle(watermark).display,
              position: window.getComputedStyle(watermark).position,
              bottom: window.getComputedStyle(watermark).bottom,
              opacity: window.getComputedStyle(watermark).opacity,
              visibility: window.getComputedStyle(watermark).visibility,
              zIndex: window.getComputedStyle(watermark).zIndex
            } : null
          });
        })()
      `
    });

    console.log('Footer details:', evalRes.result.value);

    // Full page screenshot or footer screenshot
    const ssRes = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });

    if (ssRes && ssRes.data) {
      fs.writeFileSync('scratch/footer_screenshot.png', Buffer.from(ssRes.data, 'base64'));
      console.log('Saved footer screenshot');
    }

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

capture();
