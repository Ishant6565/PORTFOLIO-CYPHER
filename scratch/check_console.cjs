const { spawn } = require('child_process');
const http = require('http');

async function checkConsole() {
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

    await send('Console.enable');
    await send('Runtime.enable');

    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled' || msg.method === 'Runtime.exceptionThrown') {
        console.log('BROWSER LOG:', JSON.stringify(msg.params));
      }
    });

    await new Promise(r => setTimeout(r, 3000));

    const checkRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          return {
            title: document.title,
            bodyChildren: document.body.children.length,
            hasCertSection: !!document.querySelector('.framer-1nq91on'),
            hasThoughtsSection: !!document.querySelector('.framer-1leqxa3'),
            hasFooter: !!document.querySelector('footer, .framer-788ly6'),
            hasWatermark: !!document.querySelector('.framer-3vb2n7')
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Page Check:', checkRes.result.value);

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

checkConsole();
