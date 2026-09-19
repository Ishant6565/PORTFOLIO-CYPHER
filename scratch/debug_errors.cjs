const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function debugErrors() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9252',
    '--window-size=1440,1200',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_errs',
    'http://localhost:3000/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9252/json', res => {
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

    const consoleLogs = [];
    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled' || msg.method === 'Runtime.exceptionThrown') {
        consoleLogs.push(msg);
      }
    });

    await send('Runtime.enable');

    await new Promise(r => setTimeout(r, 3500));

    console.log('Console Logs / Exceptions:', JSON.stringify(consoleLogs, null, 2));

    // Evaluate attachProjectActionButtons directly to see what happens
    const directEval = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = document.querySelectorAll('[data-framer-name="Project Card"]');
        const results = [];
        cards.forEach(card => {
          const h3 = card.querySelector('h3, h2, [data-styles-preset="sJTxBXgD6"]');
          const titleText = h3 ? h3.textContent.trim().toLowerCase() : '';
          results.push({
            title: titleText,
            innerHTML: card.innerHTML.slice(0, 300)
          });
        });
        return { count: cards.length, results };
      })()`,
      returnByValue: true
    });
    console.log('Direct Eval Cards:', JSON.stringify(directEval.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Debug Error:', err);
  } finally {
    chrome.kill();
  }
}
debugErrors();
