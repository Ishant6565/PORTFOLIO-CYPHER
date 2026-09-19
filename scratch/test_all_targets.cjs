const { spawn } = require('child_process');
const http = require('http');

async function testAllTargets() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_targets',
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
          const grid = document.querySelector('.framer-1leqxa3');
          if (!grid) return 'No .framer-1leqxa3 grid';
          
          const cards = Array.from(grid.children);
          const results = [];
          
          cards.forEach((card, i) => {
            const img = card.querySelector('img');
            const h3 = card.querySelector('h3');
            const p = card.querySelector('p');
            const a = card.querySelector('a');
            
            // Test closest from each sub-element
            const fromCard = card.closest('.framer-1leqxa3 > *');
            const fromImg = img ? img.closest('.framer-1leqxa3 > *') : null;
            const fromH3 = h3 ? h3.closest('.framer-1leqxa3 > *') : null;
            const fromP = p ? p.closest('.framer-1leqxa3 > *') : null;
            const fromA = a ? a.closest('.framer-1leqxa3 > *') : null;
            
            results.push({
              cardIndex: i,
              hasImg: !!img,
              imgSrc: img ? img.src : null,
              h3Text: h3 ? h3.textContent : null,
              allClosestMatchCard: (fromImg === card && fromH3 === card && fromP === card && fromA === card)
            });
          });
          
          return results;
        })()
      `,
      returnByValue: true
    });

    console.log('Targets test result:', JSON.stringify(res.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

testAllTargets();
