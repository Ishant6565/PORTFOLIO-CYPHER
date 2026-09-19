const { spawn } = require('child_process');
const http = require('http');

async function checkFirstTwo() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_h3_2',
    'http://localhost:3000/'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  try {
    const list = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:9222/json', r => {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });
    const page = list[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);
    let msgId = 1;
    function send(method, params = {}) {
      return new Promise(resolve => {
        const id = msgId++;
        const h = evt => {
          const m = JSON.parse(evt.data);
          if (m.id === id) { ws.removeEventListener('message', h); resolve(m.result); }
        };
        ws.addEventListener('message', h);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }
    await new Promise(r => setTimeout(r, 2000));

    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const h3s = Array.from(document.querySelectorAll('h3')).filter(h => 
            h.textContent.includes('Copilot') || h.textContent.includes('DevAgent')
          );
          return h3s.map(h => ({ text: h.textContent, html: h.outerHTML }));
        })()
      `,
      returnByValue: true
    });
    console.log(JSON.stringify(res.result.value, null, 2));
    ws.close();
  } catch(e) {
    console.error(e);
  } finally {
    chrome.kill();
  }
}
checkFirstTwo();
