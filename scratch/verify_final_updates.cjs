const { spawn } = require('child_process');
const http = require('http');

async function testFinal() {
  console.log('Testing Home page...');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,1200',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_final',
    'http://localhost:3000/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const list = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:9222/json', r => {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
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

    await new Promise(r => setTimeout(r, 3000));

    // 1. Verify Featured Projects button is gone:
    const fpCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const fpHeader = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Featured Projects'));
          const parent = fpHeader ? fpHeader.parentElement.parentElement : null;
          const btns = parent ? parent.querySelectorAll('a, button, .framer-1ptmnz5') : [];
          return {
            hasFpHeader: !!fpHeader,
            buttonsCountNearFp: btns.length,
            parentText: parent ? parent.textContent.trim() : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Featured Projects check:', fpCheck.result.value);

    // 2. Check Coursera certificates
    const certCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const certs = Array.from(document.querySelectorAll('.framer-e41vzk-container'));
          return {
            certCardsCount: certs.length,
            certTitles: certs.map(c => c.textContent.trim())
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Certificates check:', certCheck.result.value);

    // 3. Test clicking a certificate card (e.g. first card)
    const clickCert = await send('Runtime.evaluate', {
      expression: `
        (() => {
          let openedUrl = null;
          const origOpen = window.open;
          window.open = function(url) { openedUrl = url; return null; };
          
          const cert = document.querySelector('.framer-e41vzk-container');
          if (cert) cert.click();
          
          window.open = origOpen;
          return { openedUrl };
        })()
      `,
      returnByValue: true
    });
    console.log('Click certificate result:', clickCert.result.value);

    // 4. Navigate to /blog
    console.log('Navigating to /blog...');
    await send('Page.navigate', { url: 'http://localhost:3000/blog' });
    await new Promise(r => setTimeout(r, 3000));

    const blogDom = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const h1 = document.querySelector('h1');
          const cards = document.querySelectorAll('.framer-khup2v-container');
          return {
            h1Text: h1 ? h1.textContent : null,
            cardsCount: cards.length
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Blog page check:', blogDom.result.value);

    ws.close();
  } catch (e) {
    console.error('Test error:', e);
  } finally {
    chrome.kill();
  }
}
testFinal();
