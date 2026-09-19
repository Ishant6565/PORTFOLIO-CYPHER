const { spawn } = require('child_process');
const http = require('http');

async function debugPosters() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_lightbox',
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
          const imgs = Array.from(document.querySelectorAll('img')).filter(img => 
            img.src.includes('batman') || img.src.includes('jinx') || img.src.includes('dark-knight') ||
            img.src.includes('solo-leveling') || img.src.includes('naruto') || img.src.includes('miles-morales')
          );
          
          return imgs.map(img => {
            const link = img.closest('a');
            const card = img.closest('[data-framer-name]') || img.parentElement;
            return {
              src: img.src,
              tagName: img.tagName,
              hasLink: !!link,
              linkHref: link ? link.getAttribute('href') : null,
              linkTarget: link ? link.getAttribute('target') : null,
              cardClasses: card ? card.className : '',
              cardHTML: card ? card.outerHTML.slice(0, 200) : ''
            };
          });
        })()
      `,
      returnByValue: true
    });

    console.log('Posters found:', JSON.stringify(evalRes.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

debugPosters();
