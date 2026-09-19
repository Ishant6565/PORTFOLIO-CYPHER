const { spawn } = require('child_process');
const http = require('http');

async function inspectSocialInner() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_soc2',
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
          const socialLinks = Array.from(document.querySelectorAll('a')).filter(a => {
            const h = a.href || '';
            return h.includes('twitter') || h.includes('x.com') || h.includes('instagram') || h.includes('linkedin') || h.includes('pinterest');
          });
          
          return socialLinks.map(a => {
            const svg = a.querySelector('svg');
            return {
              href: a.href,
              svgClass: svg ? svg.className.baseVal : '',
              svgHTML: svg ? svg.outerHTML : ''
            };
          });
        })()
      `,
      returnByValue: true
    });

    console.log('Social SVGs:', JSON.stringify(res.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

inspectSocialInner();
