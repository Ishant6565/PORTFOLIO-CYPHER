const { spawn } = require('child_process');
const http = require('http');

async function testSelectorFixed() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_selfix',
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

    await new Promise(r => setTimeout(r, 2000));

    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Solo Leveling'));
          if (!h3) return 'No h3';
          
          const card = h3.closest('.framer-1gwykho-container') || 
                       h3.closest('.framer-1leqxa3 > *') || 
                       h3.closest('a');
          const img = card ? card.querySelector('img') : null;
          
          return {
            h3Text: h3.textContent,
            cardFound: !!card,
            cardTag: card ? card.tagName : null,
            cardClass: card ? card.className : null,
            imgFound: !!img,
            imgSrc: img ? img.src : null
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Fixed Selector result:', res.result.value);

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

testSelectorFixed();
