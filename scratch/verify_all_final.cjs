const http = require('http');
const { spawn } = require('child_process');

async function verifyAll() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9250',
    '--window-size=1440,1200',
    '--user-data-dir=C:\\Users\\ishan\\AppData\\Local\\Temp\\chrome_debug_verify_all',
    'http://localhost:3000/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9250/json', res => {
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

    await new Promise(r => setTimeout(r, 3500));

    // 1. Check footer "Send a Message" button and #contact-modal
    const checkFooterAndModal = await send('Runtime.evaluate', {
      expression: `(() => {
        const sendMsgBtn = document.getElementById('open-contact-modal-btn');
        const contactModal = document.getElementById('contact-modal');
        const footerLinks = Array.from(document.querySelectorAll('footer a')).map(a => ({
          text: a.textContent.trim().split('\\n')[0],
          href: a.getAttribute('href')
        }));
        return {
          sendMsgBtnExists: !!sendMsgBtn,
          contactModalExists: !!contactModal,
          footerLinks: footerLinks
        };
      })()`,
      returnByValue: true
    });
    console.log('1. Footer & Modal Check:', JSON.stringify(checkFooterAndModal.result.value, null, 2));

    // 2. Check clicking "Contact" in footer Quick Links
    const testContactClick = await send('Runtime.evaluate', {
      expression: `(() => {
        const contactLink = Array.from(document.querySelectorAll('footer a, nav a')).find(a => a.textContent.includes('Contact'));
        const beforeY = window.scrollY;
        if (contactLink) {
          contactLink.click();
        }
        return {
          contactLinkFound: !!contactLink,
          beforeY: beforeY
        };
      })()`,
      returnByValue: true
    });
    console.log('2. Contact Click Triggered:', JSON.stringify(testContactClick.result.value, null, 2));

    await new Promise(r => setTimeout(r, 800));

    const checkScrollPosition = await send('Runtime.evaluate', {
      expression: `(() => {
        const contactSec = document.querySelector('[data-framer-name="Contact Section"]');
        const form = document.querySelector('form');
        const secTop = contactSec ? (contactSec.getBoundingClientRect().top + window.scrollY) : 0;
        return {
          scrollY: window.scrollY,
          secTop: secTop,
          nearSection: Math.abs(window.scrollY - secTop) < 300
        };
      })()`,
      returnByValue: true
    });
    console.log('2. Post Scroll Position:', JSON.stringify(checkScrollPosition.result.value, null, 2));

    // 3. Check project cards action buttons (GitHub + Picture 2 Arrow)
    const checkProjectButtons = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = Array.from(document.querySelectorAll('[data-framer-name="Project Card"]'));
        return cards.map(c => {
          const h3 = c.querySelector('h3, [data-styles-preset="sJTxBXgD6"]');
          const title = h3 ? h3.textContent.trim() : 'Unknown';
          const cardHref = c.tagName === 'A' ? c.href : c.querySelector('a')?.href;
          const githubBtn = c.querySelector('.project-github-btn');
          const liveBtn = c.querySelector('.project-live-btn');
          return {
            title: title,
            cardHref: cardHref,
            hasGithubBtn: !!githubBtn,
            githubHref: githubBtn ? githubBtn.href : null,
            hasLiveBtn: !!liveBtn,
            liveHref: liveBtn ? liveBtn.href : null
          };
        });
      })()`,
      returnByValue: true
    });
    console.log('3. Homepage Project Cards:', JSON.stringify(checkProjectButtons.result.value, null, 2));

    // 4. Check clicking thoughts poster on Homepage opens minimalist lightbox
    const testPosterLightbox = await send('Runtime.evaluate', {
      expression: `(() => {
        const posterImg = document.querySelector('img[src*="batman"], img[src*="dark-knight"], img[src*="thoughts"]');
        if (posterImg) {
          posterImg.click();
        }
        return { posterFound: !!posterImg, src: posterImg ? posterImg.src : null };
      })()`,
      returnByValue: true
    });
    console.log('4. Clicked Poster:', JSON.stringify(testPosterLightbox.result.value, null, 2));

    await new Promise(r => setTimeout(r, 600));

    const checkLightboxState = await send('Runtime.evaluate', {
      expression: `(() => {
        const lb = document.getElementById('poster-lightbox');
        const img = document.getElementById('lightbox-img');
        const title = document.getElementById('lightbox-title');
        const desc = document.getElementById('lightbox-desc');
        const sidebar = document.querySelector('.poster-modal-info-col');
        return {
          isOpen: lb ? lb.classList.contains('lightbox-open') : false,
          imgSrc: img ? img.src : null,
          title: title ? title.textContent : null,
          desc: desc ? desc.textContent : null,
          hasSidebar: !!sidebar
        };
      })()`,
      returnByValue: true
    });
    console.log('4. Lightbox State:', JSON.stringify(checkLightboxState.result.value, null, 2));

    // Capture screenshot of lightbox
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verify_lightbox.png', Buffer.from(screenshot.data, 'base64'));
    console.log('Saved screenshot to scratch/verify_lightbox.png');

    // Close lightbox
    await send('Runtime.evaluate', {
      expression: `(() => {
        const closeBtn = document.getElementById('lightbox-close');
        if (closeBtn) closeBtn.click();
      })()`
    });

    await new Promise(r => setTimeout(r, 400));

    // 5. Navigate to /work and check all 10 projects have dual action buttons
    await send('Page.navigate', { url: 'http://localhost:3000/work' });
    await new Promise(r => setTimeout(r, 3500));

    const checkWorkPageProjects = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = Array.from(document.querySelectorAll('.framer-khup2v-container'));
        return {
          totalCards: cards.length,
          cards: cards.map(c => {
            const h3 = c.querySelector('h3, [data-styles-preset="sJTxBXgD6"]');
            const title = h3 ? h3.textContent.trim() : 'Unknown';
            const cardHref = c.querySelector('a')?.href;
            const githubBtn = c.querySelector('.project-github-btn');
            const liveBtn = c.querySelector('.project-live-btn');
            return {
              title: title,
              cardHref: cardHref,
              hasGithubBtn: !!githubBtn,
              githubHref: githubBtn ? githubBtn.href : null,
              hasLiveBtn: !!liveBtn,
              liveHref: liveBtn ? liveBtn.href : null
            };
          })
        };
      })()`,
      returnByValue: true
    });
    console.log('5. /work Page Projects:', JSON.stringify(checkWorkPageProjects.result.value, null, 2));

    // Capture screenshot of /work
    const workScreenshot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verify_work.png', Buffer.from(workScreenshot.data, 'base64'));
    console.log('Saved screenshot to scratch/verify_work.png');

    ws.close();
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    chrome.kill();
  }
}
verifyAll();
