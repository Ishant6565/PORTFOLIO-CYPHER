const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function verifyAllRequirements() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_session',
    'http://localhost:3000/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

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
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

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

    await send('Runtime.enable');
    await send('Page.enable');

    // Wait for hydration
    await new Promise(r => setTimeout(r, 3000));

    // 1. Verify Certificates Section
    console.log('--- 1. VERIFYING CERTIFICATES SECTION ---');
    const certsData = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const certCards = document.querySelectorAll('.framer-oiibR, .framer-1i87y9p, [data-framer-name="Testimonials Cards"] > div, .framer-1rv89an');
          const cards = [];
          document.querySelectorAll('.framer-1e4g14l, .framer-e41vzk-container, .framer-1wumwmx-container, .framer-1tcmudk-container, .framer-lyzmts-container').forEach(c => {
            const title = c.querySelector('p, h3, .framer-styles-preset-18hoqs7')?.textContent?.trim();
            const brand = c.querySelector('.framer-styles-preset-8qcqpn')?.textContent?.trim();
            const img = c.querySelector('img')?.src;
            cards.push({ title, brand, img });
          });
          return cards;
        })()
      `,
      returnByValue: true
    });
    console.log('Certificates Cards:', JSON.stringify(certsData.result.value, null, 2));

    // 2. Verify Projects Section
    console.log('--- 2. VERIFYING PROJECTS & GITHUB LINKS ---');
    const projectsData = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const projs = [];
          document.querySelectorAll('.framer-6rbvdk a, #projects a, .framer-19xgbbo-container a').forEach(a => {
            projs.push({
              text: a.textContent.trim().replace(/\\s+/g, ' ').slice(0, 50),
              href: a.href,
              target: a.target
            });
          });
          return projs;
        })()
      `,
      returnByValue: true
    });
    console.log('Projects Links:', JSON.stringify(projectsData.result.value, null, 2));

    // 3. Verify Pinterest Link & Icon
    console.log('--- 3. VERIFYING PINTEREST SOCIAL LINK ---');
    const pinterestData = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const pinterestLink = document.querySelector('a[href*="pinterest.com"]');
          return {
            found: !!pinterestLink,
            href: pinterestLink ? pinterestLink.href : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Pinterest Data:', JSON.stringify(pinterestData.result.value, null, 2));

    // 4. Test Lightbox on Poster Click
    console.log('--- 4. TESTING POSTER LIGHTBOX MODAL ---');
    const lightboxTest = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const posterCard = document.querySelector('.framer-1leqxa3 [data-framer-name], .framer-1leqxa3 a, .framer-1gwykho-container');
          if (!posterCard) return { error: 'No poster card found' };
          posterCard.click();
          const modal = document.getElementById('poster-lightbox');
          const img = document.getElementById('lightbox-img');
          const title = document.getElementById('lightbox-title');
          return {
            modalVisible: modal ? window.getComputedStyle(modal).display : 'none',
            imgSrc: img ? img.src : null,
            title: title ? title.textContent : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Lightbox test result:', JSON.stringify(lightboxTest.result.value, null, 2));

    // Screenshot of Lightbox
    await new Promise(r => setTimeout(r, 500));
    const ss1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verify_live_lightbox.png', Buffer.from(ss1.data, 'base64'));
    console.log('Saved scratch/verify_live_lightbox.png');

    // Close lightbox
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.getElementById('lightbox-close');
          if (btn) btn.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 500));

    // 5. Scroll to bottom and verify CYPHER watermark
    console.log('--- 5. VERIFYING CYPHER AT BOTTOM FLOOR ---');
    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, document.body.scrollHeight);`
    });
    await new Promise(r => setTimeout(r, 1000));

    const footerData = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const cypherEl = document.querySelector('.framer-3vb2n7, .framer-soKIl .framer-3vb2n7');
          if (!cypherEl) return null;
          const rect = cypherEl.getBoundingClientRect();
          const cs = window.getComputedStyle(cypherEl);
          return {
            rect: { top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height },
            position: cs.position,
            bottom: cs.bottom,
            width: cs.width
          };
        })()
      `,
      returnByValue: true
    });
    console.log('CYPHER footer layout:', JSON.stringify(footerData.result.value, null, 2));

    const ss2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verify_live_footer.png', Buffer.from(ss2.data, 'base64'));
    console.log('Saved scratch/verify_live_footer.png');

    // Scroll to certificates section and screenshot
    console.log('--- 6. SCREENSHOTTING CERTIFICATES ---');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const cert = document.querySelector('.framer-1rv89an, .framer-1nq91on');
          if (cert) cert.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1000));
    const ss3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verify_live_certs.png', Buffer.from(ss3.data, 'base64'));
    console.log('Saved scratch/verify_live_certs.png');

    ws.close();
  } catch (err) {
    console.error('Error in verification:', err);
  } finally {
    chrome.kill();
  }
}

verifyAllRequirements();
