const { spawn } = require('child_process');
const http = require('http');

async function inspectCards() {
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

    await send('Runtime.enable');
    await new Promise(r => setTimeout(r, 3000));

    const cardInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('.framer-19xgbbo-container');
          if (!card) return null;
          return {
            html: card.innerHTML.slice(0, 1500),
            headings: [...card.querySelectorAll('h3, h4, p, div')].map(el => ({
              tag: el.tagName,
              cls: el.className,
              text: el.textContent.trim()
            })).filter(x => x.text)
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Card DOM:', JSON.stringify(cardInfo.result.value, null, 2));

    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    chrome.kill();
  }
}

inspectCards();
