const { spawn } = require('child_process');
const http = require('http');

async function inspectProjectH3() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_h3',
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

    await new Promise(r => setTimeout(r, 2000));

    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const h3s = Array.from(document.querySelectorAll('h3')).filter(h => 
            h.textContent.includes('Copilot') || h.textContent.includes('DevAgent') || 
            h.textContent.includes('Grandmaster') || h.textContent.includes('Mindloop') || 
            h.textContent.includes('ARCADEX') || h.textContent.includes('Stock Analysis')
          );
          
          return h3s.map(h3 => {
            let el = h3;
            const chain = [];
            for (let i = 0; i < 4 && el; i++) {
              chain.push({ tag: el.tagName, cls: el.className, id: el.id, framerName: el.getAttribute('data-framer-name') });
              el = el.parentElement;
            }
            return {
              text: h3.textContent,
              outerHTML: h3.outerHTML,
              chain
            };
          });
        })()
      `,
      returnByValue: true
    });

    console.log('Project H3s:', JSON.stringify(res.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

inspectProjectH3();
