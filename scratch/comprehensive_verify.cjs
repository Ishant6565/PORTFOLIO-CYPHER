const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function verifyAll() {
  console.log('--- Launching Headless Chrome for Full Verification ---');
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

    // Wait for hydration
    await new Promise(r => setTimeout(r, 2500));

    // 1. Check Certificates
    console.log('1. Capturing Certificates section...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('testimonials') || 
                     document.querySelector('[data-framer-name="Testimonials Section"]') ||
                     document.querySelector('.framer-oiibR');
          if (el) el.scrollIntoView({ block: 'center' });
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1000));
    let ss = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    if (ss && ss.data) fs.writeFileSync('scratch/verify_certs.png', Buffer.from(ss.data, 'base64'));

    // 2. Check Social Icons / Contact Section
    console.log('2. Capturing Social Icons / Pinterest section...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.querySelector('.framer-1emterx-container, .framer-TJUch, a[href*="pinterest"]');
          if (el) el.scrollIntoView({ block: 'center' });
        })()
      `
    });
    await new Promise(r => setTimeout(r, 800));
    ss = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    if (ss && ss.data) fs.writeFileSync('scratch/verify_social.png', Buffer.from(ss.data, 'base64'));

    // 3. Test Poster Lightbox Click
    console.log('3. Testing Graphic Design Poster Click...');
    const posterRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('.framer-1leqxa3 [data-framer-name], .framer-1gwykho-container, .framer-1leqxa3 > *');
          if (card) {
            card.scrollIntoView({ block: 'center' });
            card.click();
            const lb = document.getElementById('poster-lightbox');
            return {
              foundCard: true,
              display: lb ? window.getComputedStyle(lb).display : null,
              imgSrc: document.getElementById('lightbox-img')?.src
            };
          }
          return { foundCard: false };
        })()
      `,
      returnByValue: true
    });
    console.log('Poster click result:', posterRes.result.value);
    await new Promise(r => setTimeout(r, 600));
    ss = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    if (ss && ss.data) fs.writeFileSync('scratch/verify_lightbox.png', Buffer.from(ss.data, 'base64'));

    // Close lightbox if open
    await send('Runtime.evaluate', {
      expression: `document.getElementById('lightbox-close')?.click();`
    });
    await new Promise(r => setTimeout(r, 400));

    // 4. Check Footer & CYPHER Watermark
    console.log('4. Capturing Footer & CYPHER watermark...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          window.scrollTo(0, document.body.scrollHeight || 999999);
          const footer = document.querySelector('footer, .framer-788ly6');
          if (footer) footer.scrollIntoView({ block: 'end' });
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1000));
    ss = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    if (ss && ss.data) fs.writeFileSync('scratch/verify_footer.png', Buffer.from(ss.data, 'base64'));

    ws.close();
    console.log('--- Verification Screenshots Captured Successfully ---');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    chrome.kill();
  }
}

verifyAll();
