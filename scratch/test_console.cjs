const { spawn } = require('child_process');
const http = require('http');

async function testConsole() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_console',
    'http://localhost:3000/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

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

    await send('Console.enable');
    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Console.messageAdded') {
        console.log('BROWSER LOG:', msg.params.message.text);
      }
    });

    await new Promise(r => setTimeout(r, 2000));

    // Instrument closeLightbox
    await send('Runtime.evaluate', {
      expression: `
        window.closeLightboxCalls = [];
        const originalClose = window.closeLightbox;
        // Also listen to all clicks anywhere
        window.addEventListener('click', (e) => {
          console.log('Window clicked on:', e.target.tagName, e.target.className, e.target.id);
        }, true);
      `
    });

    // Scroll and click
    await send('Runtime.evaluate', {
      expression: `
        const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Solo Leveling'));
        h3.scrollIntoView({ block: 'center' });
        setTimeout(() => {
          console.log('Dispatching click to h3');
          h3.click();
        }, 500);
      `
    });

    await new Promise(r => setTimeout(r, 2000));

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

testConsole();
