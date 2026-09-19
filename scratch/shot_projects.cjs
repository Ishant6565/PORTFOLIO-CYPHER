const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function shotProjects() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,1100',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_projects_view',
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

    // Scroll to Featured Projects section
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Featured Projects'));
          if (heading) heading.scrollIntoView({ block: 'start' });
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1200));

    const ssRes = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/projects_top_view.png', Buffer.from(ssRes.data, 'base64'));
    console.log('Saved scratch/projects_top_view.png');

    // Scroll further down into the project grid to see ARCADEX
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const arcadexH3 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('ARCADEX'));
          if (arcadexH3) arcadexH3.scrollIntoView({ block: 'center' });
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1200));

    const ssRes2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/projects_arcadex_view.png', Buffer.from(ssRes2.data, 'base64'));
    console.log('Saved scratch/projects_arcadex_view.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

shotProjects();
