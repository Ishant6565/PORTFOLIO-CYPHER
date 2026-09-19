const http = require('http');
const { spawn } = require('child_process');

async function checkSections() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9230',
    '--window-size=1440,1200',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_sec',
    'http://localhost:3000/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9230/json', res => {
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

    await new Promise(r => setTimeout(r, 4000));

    const fn = function() {
      const sections = Array.from(document.querySelectorAll('section, footer')).map(function(s) {
        const r = s.getBoundingClientRect();
        return {
          tag: s.tagName,
          name: s.getAttribute('data-framer-name'),
          top: r.top + window.scrollY,
          bottom: r.bottom + window.scrollY,
          height: r.height,
          textSnippet: s.textContent.trim().slice(0, 50)
        };
      });
      return { sections: sections };
    };

    const res = await send('Runtime.evaluate', {
      expression: '(' + fn.toString() + ')()',
      returnByValue: true
    });

    console.log('Sections:', JSON.stringify(res.result.value, null, 2));
    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chrome.kill();
  }
}
checkSections();
