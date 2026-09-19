const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function verifyAll() {
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
    await new Promise(r => setTimeout(r, 3000));

    // 1. Verify Bio & Creating Since 2026
    console.log('--- 1. VERIFYING BIO & CREATING SINCE 2026 ---');
    const bioData = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const bioSection = document.querySelector('[data-framer-name="Bio Section"], .framer-m00iei');
          const creatingSince = document.body.innerText.includes('CREATING SINCE 2026');
          const hasIshantIntro = document.body.innerText.includes('I’m Ishant') || document.body.innerText.includes('engineer based in Kolkata');
          return {
            creatingSince2026: creatingSince,
            hasIshantBio: hasIshantIntro,
            bioTextSnippet: bioSection ? bioSection.innerText.slice(0, 300) : 'Not found'
          };
        })()
      `,
      returnByValue: true
    });
    console.log(JSON.stringify(bioData.result.value, null, 2));

    // 2. Verify Services Section
    console.log('--- 2. VERIFYING SERVICES SECTION ---');
    const servicesData = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const services = document.querySelector('[data-framer-name="Services Section"], .framer-1bgnipk');
          const cards = [];
          if (services) {
            services.querySelectorAll('.framer-jhjn7z > div').forEach(c => {
              cards.push(c.innerText.replace(/\\n+/g, ' • '));
            });
          }
          return {
            servicesFound: !!services,
            cards: cards
          };
        })()
      `,
      returnByValue: true
    });
    console.log(JSON.stringify(servicesData.result.value, null, 2));

    // 3. Verify Projects (including ARCADEX & GitHub logo next to title)
    console.log('--- 3. VERIFYING PROJECTS & GITHUB LOGOS ---');
    const projectsData = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const projs = [];
          document.querySelectorAll('.framer-1a1g2uv h3').forEach(h3 => {
            const gh = h3.querySelector('.project-github-icon-link');
            projs.push({
              title: h3.textContent.trim(),
              hasGithubIcon: !!gh,
              githubHref: gh ? gh.href : null
            });
          });
          const hasArcadexImg = !!document.querySelector('img[src*="arcadex.png"]');
          return {
            projects: projs,
            hasArcadexImage: hasArcadexImg
          };
        })()
      `,
      returnByValue: true
    });
    console.log(JSON.stringify(projectsData.result.value, null, 2));

    // Screenshot of Projects section showing ARCADEX & GitHub logos
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const proj = document.getElementById('projects') || document.querySelector('.framer-1ut795m');
          if (proj) proj.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1000));
    const ssProjects = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verify_projects_arcadex_github.png', Buffer.from(ssProjects.data, 'base64'));
    console.log('Saved scratch/verify_projects_arcadex_github.png');

    // 4. Test Graphic Design Poster click on CAPTION and verify scroll position does not move
    console.log('--- 4. TESTING POSTER CLICK (ZERO SCROLL JUMP) ---');
    const scrollTest = await send('Runtime.evaluate', {
      expression: `
        (() => {
          // Scroll to thoughts section
          const thoughts = document.querySelector('.framer-1leqxa3');
          if (thoughts) thoughts.scrollIntoView({ behavior: 'instant', block: 'center' });
          const scrollBefore = window.scrollY;

          // Click on CAPTION specifically
          const caption = document.querySelector('.framer-1leqxa3 [data-framer-name="Content"], .framer-1leqxa3 h3, .framer-1leqxa3 p');
          if (caption) caption.click();

          const scrollAfter = window.scrollY;
          const modal = document.getElementById('poster-lightbox');
          const modalDisplay = modal ? window.getComputedStyle(modal).display : 'none';
          const title = document.getElementById('lightbox-title')?.textContent;

          return {
            scrollBefore,
            scrollAfter,
            scrolledDistance: Math.abs(scrollAfter - scrollBefore),
            modalDisplay,
            openedTitle: title
          };
        })()
      `,
      returnByValue: true
    });
    console.log(JSON.stringify(scrollTest.result.value, null, 2));

    // Screenshot of lightbox opened from caption
    const ssLb = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verify_caption_lightbox.png', Buffer.from(ssLb.data, 'base64'));
    console.log('Saved scratch/verify_caption_lightbox.png');

    // Close lightbox
    await send('Runtime.evaluate', {
      expression: `document.getElementById('lightbox-close')?.click();`
    });
    await new Promise(r => setTimeout(r, 500));

    // 5. Verify Pinterest logo in social icons
    console.log('--- 5. VERIFYING PINTEREST LOGO & SOCIALS ---');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const contact = document.querySelector('.framer-9u1bc5');
          if (contact) contact.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()
      `
    });
    await new Promise(r => setTimeout(r, 1000));
    const ssSocial = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verify_social_pinterest.png', Buffer.from(ssSocial.data, 'base64'));
    console.log('Saved scratch/verify_social_pinterest.png');

    ws.close();
  } catch (e) {
    console.error('Error during verification:', e);
  } finally {
    chrome.kill();
  }
}

verifyAll();
