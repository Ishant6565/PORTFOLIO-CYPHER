const { spawn } = require('child_process');
const http = require('http');

async function checkAllH3s() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_all_h3',
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

    // Scroll gradually through page
    await send('Runtime.evaluate', {
      expression: `
        window.scrollTo(0, 1500);
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          return {
            h2s: Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim()),
            h3s: Array.from(document.querySelectorAll('h3')).map(h => h.textContent.trim()),
            projectTitles: Array.from(document.querySelectorAll('[data-framer-name="Title & Description"]')).map(el => el.textContent.trim())
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Results after scroll to 1500:', JSON.stringify(res.result.value, null, 2));

    ws.close();
  } catch(e) {
    console.error(e);
  } finally {
    chrome.kill();
  }
}
checkAllH3s();
