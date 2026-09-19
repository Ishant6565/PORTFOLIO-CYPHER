const { spawn } = require('child_process');
const http = require('http');

async function inspectSocial() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_soc',
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
          // Find the social links at the bottom
          const socialLinks = Array.from(document.querySelectorAll('a')).filter(a => {
            const h = a.href || '';
            return h.includes('twitter') || h.includes('x.com') || h.includes('instagram') || h.includes('linkedin') || h.includes('pinterest');
          });
          
          return socialLinks.map(a => {
            const svg = a.querySelector('svg');
            const paths = svg ? Array.from(svg.querySelectorAll('path')).map(p => ({
              d: p.getAttribute('d'),
              fill: p.getAttribute('fill'),
              stroke: p.getAttribute('stroke'),
              strokeWidth: p.getAttribute('stroke-width')
            })) : [];
            
            return {
              href: a.href,
              tag: a.tagName,
              svgViewBox: svg ? svg.getAttribute('viewBox') : null,
              svgWidth: svg ? svg.getAttribute('width') || window.getComputedStyle(svg).width : null,
              svgHeight: svg ? svg.getAttribute('height') || window.getComputedStyle(svg).height : null,
              svgFill: svg ? svg.getAttribute('fill') : null,
              paths,
              outerHTML: a.outerHTML.slice(0, 400)
            };
          });
        })()
      `,
      returnByValue: true
    });

    console.log('Social icons:', JSON.stringify(res.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

inspectSocial();
