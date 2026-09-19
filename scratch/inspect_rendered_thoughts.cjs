const { spawn } = require('child_process');
const http = require('http');

async function inspectRenderedThoughts() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_session',
    'http://localhost:3000/'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }).on('error', rej));
  const page = list.find(p => p.url.includes('localhost:3000')) || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (m, p = {}) => new Promise(res => {
    const i = id++;
    ws.addEventListener('message', function h(e) {
      const msg = JSON.parse(e.data);
      if (msg.id === i) { ws.removeEventListener('message', h); res(msg.result); }
    });
    ws.send(JSON.stringify({ id: i, method: m, params: p }));
  });
  await send('Runtime.enable');
  await new Promise(r => setTimeout(r, 3000));
  const dom = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const card = document.querySelector('.framer-1leqxa3 .framer-1gwykho-container');
        return card ? card.outerHTML : null;
      })()
    `,
    returnByValue: true
  });
  console.log('First card HTML:', dom.result.value);
  ws.close();
  chrome.kill();
}
inspectRenderedThoughts();
