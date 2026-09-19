const { spawn } = require('child_process');
const http = require('http');

async function testHomeToBlog() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,1200',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_home',
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

    // Find links to /blog
    const blogLinks = await send('Runtime.evaluate', {
      expression: 'Array.from(document.querySelectorAll("a")).filter(a => a.href.includes("/blog")).map(a => ({ text: a.textContent.trim(), href: a.href }))',
      returnByValue: true
    });
    console.log('Blog links on home page:', blogLinks.result.value);

    // Test clicking that link:
    const clickNav = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = Array.from(document.querySelectorAll('a')).find(a => a.href.includes('/blog'));
          if (!btn) return { error: 'No blog button found' };
          btn.click();
          return { clicked: true, href: btn.href };
        })()
      `,
      returnByValue: true
    });
    console.log('Nav click result:', clickNav.result.value);

    await new Promise(r => setTimeout(r, 2000));
    const finalUrl = await send('Runtime.evaluate', { expression: 'location.href', returnByValue: true });
    console.log('Final URL after clicking:', finalUrl.result.value);

    const h1AfterNav = await send('Runtime.evaluate', {
      expression: 'document.querySelector("h1") ? document.querySelector("h1").textContent : null',
      returnByValue: true
    });
    console.log('H1 after nav:', h1AfterNav.result.value);

    const cardsCountAfterNav = await send('Runtime.evaluate', {
      expression: 'document.querySelectorAll(".framer-khup2v-container").length',
      returnByValue: true
    });
    console.log('Cards count on /blog after nav:', cardsCountAfterNav.result.value);

    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    chrome.kill();
  }
}
testHomeToBlog();
