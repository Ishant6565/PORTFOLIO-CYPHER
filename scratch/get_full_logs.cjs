const { spawn } = require('child_process');
const http = require('http');

async function getFullLogs() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_session',
    'http://localhost:3000/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

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

    await send('Log.enable');
    await send('Runtime.enable');
    await send('Network.enable');

    const logs = [];
    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        logs.push({ type: 'EXCEPTION', text: msg.params.exceptionDetails.text, exception: msg.params.exceptionDetails.exception?.description });
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        logs.push({ type: 'CONSOLE_' + msg.params.type, args: msg.params.args.map(a => a.value) });
      } else if (msg.method === 'Network.responseReceived') {
        if (msg.params.response.status >= 400) {
          logs.push({ type: 'HTTP_' + msg.params.response.status, url: msg.params.response.url });
        }
      }
    });

    // Reload page to catch all startup errors
    await send('Page.reload', { ignoreCache: true });
    await new Promise(r => setTimeout(r, 4000));

    console.log('--- ALL BROWSER LOGS ---');
    console.log(JSON.stringify(logs, null, 2));

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

getFullLogs();
