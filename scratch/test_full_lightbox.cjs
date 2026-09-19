const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testFullLightbox() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_trace2',
    'http://localhost:3000/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

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
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

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

    // Scroll to Thoughts section
    await send('Runtime.evaluate', {
      expression: `
        const img = Array.from(document.querySelectorAll('img')).find(img => img.src.includes('solo-leveling'));
        if (img) img.scrollIntoView({ block: 'center' });
      `
    });

    await new Promise(r => setTimeout(r, 1000));

    // Click on Solo Leveling caption h3
    const clickRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Solo Leveling'));
          if (!h3) return { error: 'No Solo Leveling h3' };
          const beforeY = window.scrollY;
          h3.click();
          return { beforeY, text: h3.textContent };
        })()
      `,
      returnByValue: true
    });
    console.log('Clicked caption:', clickRes.result.value);

    // Wait 600ms for lightbox fade in
    await new Promise(r => setTimeout(r, 600));

    const checkLB = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const lb = document.getElementById('poster-lightbox');
          const lbImg = document.getElementById('lightbox-img');
          const lbTitle = document.getElementById('lightbox-title');
          return {
            display: lb ? lb.style.display : null,
            opacity: lb ? lb.style.opacity : null,
            imgSrc: lbImg ? lbImg.src : null,
            imgNaturalWidth: lbImg ? lbImg.naturalWidth : null,
            title: lbTitle ? lbTitle.textContent : null,
            afterY: window.scrollY
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Lightbox state:', checkLB.result.value);

    const ssRes = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/lightbox_solo_leveling.png', Buffer.from(ssRes.data, 'base64'));
    console.log('Saved scratch/lightbox_solo_leveling.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

testFullLightbox();
