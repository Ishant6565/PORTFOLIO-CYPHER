const { spawn } = require('child_process');
const http = require('http');

async function traceClick() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_trace',
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

    await new Promise(r => setTimeout(r, 2500));

    // Scroll down to the thoughts section
    await send('Runtime.evaluate', {
      expression: `
        window.scrollLogs = [];
        window.addEventListener('scroll', () => {
          window.scrollLogs.push({ time: Date.now(), scrollY: window.scrollY });
        });
        
        const img = Array.from(document.querySelectorAll('img')).find(img => img.src.includes('batman'));
        img.scrollIntoView();
      `
    });

    await new Promise(r => setTimeout(r, 1000));

    // Now click the poster image and check what happens
    const clickTrace = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const img = Array.from(document.querySelectorAll('img')).find(img => img.src.includes('batman'));
          const beforeY = window.scrollY;
          
          // Click on the image
          img.click();
          
          const afterY = window.scrollY;
          const lb = document.getElementById('poster-lightbox');
          
          return {
            beforeY,
            afterY,
            lbDisplay: lb ? lb.style.display : null,
            lbOpacity: lb ? lb.style.opacity : null,
            scrollLogs: window.scrollLogs.slice(-10)
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Click on img trace:', clickTrace.result.value);

    // Now test clicking on caption text (h3)
    const captionTrace = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Batman'));
          if (!h3) return 'No Batman h3 found';
          
          const beforeY = window.scrollY;
          h3.click();
          const afterY = window.scrollY;
          const lb = document.getElementById('poster-lightbox');
          
          return {
            beforeY,
            afterY,
            lbDisplay: lb ? lb.style.display : null,
            lbOpacity: lb ? lb.style.opacity : null,
            scrollLogs: window.scrollLogs.slice(-10)
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Click on caption h3 trace:', captionTrace.result.value);

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

traceClick();
