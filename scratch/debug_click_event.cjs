const { spawn } = require('child_process');
const http = require('http');

async function debugClick() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_click',
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

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const img = Array.from(document.querySelectorAll('img')).find(img => img.src.includes('batman'));
          if (!img) return { error: 'No batman image' };
          
          const aTag = img.closest('a');
          const parent = aTag ? aTag.parentElement : img.parentElement;
          
          // Let's check caption
          const cardContainer = img.closest('.framer-1leqxa3 > *') || img.closest('[data-framer-name]');
          
          return {
            aTagOuter: aTag ? aTag.outerHTML.slice(0, 300) : null,
            cardContainerOuter: cardContainer ? cardContainer.outerHTML.slice(0, 400) : null,
            scrollYBefore: window.scrollY
          };
        })()
      `,
      returnByValue: true
    });

    console.log('DOM info:', JSON.stringify(evalRes.result.value, null, 2));

    // Now simulate clicking on the image and check scrollY and lightbox state
    const clickTest = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const img = Array.from(document.querySelectorAll('img')).find(img => img.src.includes('batman'));
          const aTag = img.closest('a');
          
          // Scroll it into view
          img.scrollIntoView({ block: 'center' });
          const scrollAfterView = window.scrollY;
          
          // Click the image
          img.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          
          const lb = document.getElementById('poster-lightbox');
          const lbImg = document.getElementById('lightbox-img');
          const lbTitle = document.getElementById('lightbox-title');
          
          return {
            scrollAfterView,
            scrollAfterClick: window.scrollY,
            lightboxDisplay: lb ? lb.style.display : null,
            lightboxOpacity: lb ? lb.style.opacity : null,
            lbImgSrc: lbImg ? lbImg.src : null,
            lbTitle: lbTitle ? lbTitle.textContent : null
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Click test result:', JSON.stringify(clickTest.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

debugClick();
