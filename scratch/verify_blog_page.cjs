const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testBlogPage() {
  console.log('Launching headless Chrome to test /blog...');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,1200',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_blog_15',
    'http://localhost:3000/blog'
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

    await new Promise(r => setTimeout(r, 4000));

    // Check DOM on /blog
    const blogDom = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const h1 = document.querySelector('h1');
          const pDesc = document.querySelector('.framer-6551sn p');
          const imgs = Array.from(document.querySelectorAll('img')).map(i => i.src);
          const h3s = Array.from(document.querySelectorAll('h3')).map(h => h.textContent.trim());
          const thoughtsImgs = imgs.filter(s => s.includes('/thoughts/'));
          const cards = document.querySelectorAll('.framer-khup2v-container');
          
          return {
            currentUrl: location.href,
            h1Text: h1 ? h1.textContent : null,
            descText: pDesc ? pDesc.textContent : null,
            thoughtsImgCount: thoughtsImgs.length,
            thoughtsImgs,
            cardsCount: cards.length,
            posterTitles: h3s
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Blog page DOM evaluation:', JSON.stringify(blogDom.result.value, null, 2));

    // Capture screenshot of /blog page
    const ssBlog = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/blog_15_screenshot.png', Buffer.from(ssBlog.data, 'base64'));
    console.log('Saved scratch/blog_15_screenshot.png');

    // Test clicking on a poster (e.g. Gengar or Itachi) to test Lightbox
    const clickRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const cards = Array.from(document.querySelectorAll('.framer-khup2v-container'));
          if (!cards.length) return { error: 'No poster cards found' };
          
          const testCard = cards[5] || cards[0]; // Gengar or first card
          const img = testCard.querySelector('img');
          const scrollBefore = window.scrollY;
          
          testCard.click();
          
          const lb = document.getElementById('poster-lightbox');
          const lbImg = document.getElementById('lightbox-img');
          const lbTitle = document.getElementById('lightbox-title');
          const lbDesc = document.getElementById('lightbox-desc');
          
          return {
            scrollBefore,
            scrollAfter: window.scrollY,
            lbDisplay: lb ? lb.style.display : null,
            lbOpacity: lb ? lb.style.opacity : null,
            lbImgSrc: lbImg ? lbImg.src : null,
            lbTitle: lbTitle ? lbTitle.textContent : null,
            lbDesc: lbDesc ? lbDesc.textContent : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Lightbox click test result:', JSON.stringify(clickRes.result.value, null, 2));

    await new Promise(r => setTimeout(r, 600));
    const ssLb = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/blog_15_lightbox_screenshot.png', Buffer.from(ssLb.data, 'base64'));
    console.log('Saved scratch/blog_15_lightbox_screenshot.png');

    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chrome.kill();
  }
}

testBlogPage();
