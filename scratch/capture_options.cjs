const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function shot() {
  const filePath = path.resolve('scratch/pinterest_preview.html');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1000,700',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_shot_pin',
    'file:///' + filePath.replace(/\\/g, '/')
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
    await new Promise(r => setTimeout(r, 1000));
    const ss = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/pinterest_options.png', Buffer.from(ss.data, 'base64'));
    console.log('Saved scratch/pinterest_options.png');
    ws.close();
  } catch(e) {
    console.error(e);
  } finally {
    chrome.kill();
  }
}
shot();
