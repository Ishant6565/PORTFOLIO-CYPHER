const { spawn } = require('child_process');
const http = require('http');

async function checkThoughts() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_thoughts',
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
          if (!img) return 'no batman img';
          
          let el = img;
          const hierarchy = [];
          while (el && el !== document.body) {
            hierarchy.push({
              tagName: el.tagName,
              className: el.className,
              id: el.id,
              framerName: el.getAttribute('data-framer-name'),
              href: el.getAttribute('href')
            });
            el = el.parentElement;
          }
          return hierarchy;
        })()
      `,
      returnByValue: true
    });

    console.log('Hierarchy:', JSON.stringify(evalRes.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

checkThoughts();
