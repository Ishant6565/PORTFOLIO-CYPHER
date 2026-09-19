const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function verifyAll() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_verify_final',
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

    // 1. Check Projects and GitHub icons
    console.log('--- Checking Projects & GitHub Icons ---');
    const projRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const projectsH3 = Array.from(document.querySelectorAll('h3')).filter(h => 
            h.textContent.includes('Copilot') || h.textContent.includes('DevAgent') || 
            h.textContent.includes('Grandmaster') || h.textContent.includes('Mindloop') || 
            h.textContent.includes('ARCADEX') || h.textContent.includes('Stock Analysis')
          );
          
          return projectsH3.map(h => {
            const gh = h.querySelector('.project-github-icon-link');
            const svg = gh ? gh.querySelector('svg') : null;
            return {
              title: h.textContent.trim(),
              hasGithubLink: !!gh,
              githubHref: gh ? gh.href : null,
              githubVisible: gh ? window.getComputedStyle(gh).display !== 'none' : false,
              githubColor: gh ? window.getComputedStyle(gh).color : null,
              githubBg: gh ? window.getComputedStyle(gh).backgroundColor : null
            };
          });
        })()
      `,
      returnByValue: true
    });
    console.log('Projects:', JSON.stringify(projRes.result.value, null, 2));

    // Scroll to ARCADEX and take screenshot
    await send('Runtime.evaluate', {
      expression: `
        const el = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('ARCADEX'));
        if (el) el.scrollIntoView({ block: 'center' });
      `
    });
    await new Promise(r => setTimeout(r, 800));
    const ssArcadex = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/final_arcadex_github.png', Buffer.from(ssArcadex.data, 'base64'));
    console.log('Saved scratch/final_arcadex_github.png');

    // 2. Check Lightbox on Caption click
    console.log('--- Testing Lightbox on Caption click ---');
    const lbTest = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Solo Leveling'));
          if (!h3) return { error: 'No Solo Leveling h3' };
          
          h3.scrollIntoView({ block: 'center' });
          const scrollBefore = window.scrollY;
          
          // Click caption
          h3.click();
          
          const lb = document.getElementById('poster-lightbox');
          const lbImg = document.getElementById('lightbox-img');
          const lbTitle = document.getElementById('lightbox-title');
          
          return {
            scrollBefore,
            scrollAfter: window.scrollY,
            lbDisplay: lb ? lb.style.display : null,
            lbImgSrc: lbImg ? lbImg.src : null,
            lbTitle: lbTitle ? lbTitle.textContent : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Lightbox test result:', JSON.stringify(lbTest.result.value, null, 2));

    // Wait 400ms for lightbox transition
    await new Promise(r => setTimeout(r, 400));
    const ssLb = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/final_lightbox_open.png', Buffer.from(ssLb.data, 'base64'));
    console.log('Saved scratch/final_lightbox_open.png');

    // Close lightbox
    await send('Runtime.evaluate', {
      expression: `
        const btn = document.getElementById('lightbox-close');
        if (btn) btn.click();
      `
    });
    await new Promise(r => setTimeout(r, 400));

    // 3. Check Footer Social Icons
    console.log('--- Checking Footer Social Icons ---');
    await send('Runtime.evaluate', {
      expression: `
        const pin = Array.from(document.querySelectorAll('a')).find(a => (a.href || '').includes('pinterest'));
        if (pin) pin.scrollIntoView({ block: 'center' });
      `
    });
    await new Promise(r => setTimeout(r, 800));

    const pinRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const pin = Array.from(document.querySelectorAll('a')).find(a => (a.href || '').includes('pinterest'));
          const svg = pin ? pin.querySelector('svg') : null;
          return {
            pinFound: !!pin,
            pinHref: pin ? pin.href : null,
            pinSvgHTML: svg ? svg.outerHTML : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Pinterest status:', JSON.stringify(pinRes.result.value, null, 2));

    const ssFooter = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/final_footer_social.png', Buffer.from(ssFooter.data, 'base64'));
    console.log('Saved scratch/final_footer_social.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

verifyAll();
