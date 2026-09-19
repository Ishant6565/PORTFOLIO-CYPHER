const { spawn } = require('child_process');
const http = require('http');

async function debugErrors() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,1200',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_err',
    'http://localhost:3000/blog'
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

    ws.addEventListener('message', evt => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Console.messageAdded') {
        console.log('CONSOLE:', msg.params.message.text);
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        console.log('EXCEPTION:', JSON.stringify(msg.params.exceptionDetails, null, 2));
      }
    });

    await send('Console.enable');
    await send('Runtime.enable');

    await new Promise(r => setTimeout(r, 4000));

    const html = await send('Runtime.evaluate', {
      expression: 'document.getElementById("main") ? document.getElementById("main").innerHTML : "NO MAIN"'
    });
    console.log('Main innerHTML length:', (html.result.value || '').length);
    console.log('Snippet:', (html.result.value || '').slice(0, 300));

    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    chrome.kill();
  }
}
debugErrors();
