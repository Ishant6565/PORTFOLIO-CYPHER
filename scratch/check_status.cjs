const { spawn } = require('child_process');
const http = require('http');

async function checkStatus() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_status',
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
    
    await send('Log.enable');
    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Log.entryAdded') {
        console.log('LOG ENTRY:', msg.params.entry);
      }
    });

    await new Promise(r => setTimeout(r, 3000));

    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          return {
            title: document.title,
            bodyLength: document.body ? document.body.innerHTML.length : 0,
            scripts: Array.from(document.querySelectorAll('script')).map(s => s.src || 'inline'),
            mainChildren: document.getElementById('main') ? document.getElementById('main').children.length : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Status result:', JSON.stringify(res.result.value, null, 2));

    ws.close();
  } catch(e) {
    console.error(e);
  } finally {
    chrome.kill();
  }
}
checkStatus();
