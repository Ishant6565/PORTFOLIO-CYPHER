const fs = require('fs');

console.log('=== RUNNING COMPREHENSIVE UPDATE SCRIPT ===');

let chunk = fs.readFileSync('public/chunks/avatar_chunk.mjs', 'utf8');
let scriptMain = fs.readFileSync('public/chunks/script_main.mjs', 'utf8');
let html = fs.readFileSync('index.html', 'utf8');

// =========================================================================
// 1. PINTEREST SVG ICON REPLACEMENT (REPLACING YOUTUBE)
// =========================================================================
console.log('1. Replacing YouTube icon with authentic Pinterest SVG icon...');

// Pinterest SVG string for Framer icon component (24x24)
const pinterestSvg = `<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 12 2 C 6.48 2 2 6.48 2 12 C 2 16.24 4.65 17.86 6.39 19.29 C 6.3 18.5 6.22 17.29 6.43 16.43 C 6.62 15.66 7.68 11.13 7.68 11.13 C 7.68 11.13 7.36 10.49 7.36 9.55 C 7.36 8.07 8.22 6.97 9.29 6.97 C 10.2 6.97 10.64 7.65 10.64 8.47 C 10.64 9.38 10.06 10.75 9.76 12.02 C 9.51 13.08 10.29 13.95 11.34 13.95 C 13.24 13.95 14.7 11.95 14.7 9.06 C 14.7 6.5 12.86 4.71 10.23 4.71 C 7.18 4.71 5.39 7 5.39 9.36 C 5.39 10.28 5.74 11.27 6.19 11.8 C 6.28 11.91 6.29 12 6.26 12.11 C 6.18 12.44 5.96 13.17 5.92 13.31 C 5.87 13.51 5.76 13.55 5.55 13.46 C 4.17 12.82 3.31 10.81 3.31 9.19 C 3.31 5.72 5.83 2.53 10.59 2.53 C 14.41 2.53 17.38 5.25 17.38 8.89 C 17.38 12.69 14.99 15.74 11.67 15.74 C 10.55 15.74 9.5 15.16 9.14 14.48 L 8.45 17.11 C 8.2 18.07 7.53 19.27 7.08 20 C 8.62 20.65 10.27 21 12 21 C 17.52 21 22 16.52 22 11 C 22 5.48 17.52 2 12 2 Z" fill="transparent" stroke-width="var(--1ww558a, 2)" stroke="var(--4rxgx6, black)" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// Replace ht definition in avatar_chunk.mjs
const oldHtRegex = /ht=`<svg display="block" role="presentation" viewBox="0 0 24 24"[\s\S]*?<\/svg>`/;
chunk = chunk.replace(oldHtRegex, 'ht=`' + pinterestSvg + '`');

// Replace in index.html static svg definition
const oldStaticSvgRegex = /<svg id="832930135"[\s\S]*?<\/svg>/;
html = html.replace(oldStaticSvgRegex, '<svg id="832930135" display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 12 2 C 6.48 2 2 6.48 2 12 C 2 16.24 4.65 17.86 6.39 19.29 C 6.3 18.5 6.22 17.29 6.43 16.43 C 6.62 15.66 7.68 11.13 7.68 11.13 C 7.68 11.13 7.36 10.49 7.36 9.55 C 7.36 8.07 8.22 6.97 9.29 6.97 C 10.2 6.97 10.64 7.65 10.64 8.47 C 10.64 9.38 10.06 10.75 9.76 12.02 C 9.51 13.08 10.29 13.95 11.34 13.95 C 13.24 13.95 14.7 11.95 14.7 9.06 C 14.7 6.5 12.86 4.71 10.23 4.71 C 7.18 4.71 5.39 7 5.39 9.36 C 5.39 10.28 5.74 11.27 6.19 11.8 C 6.28 11.91 6.29 12 6.26 12.11 C 6.18 12.44 5.96 13.17 5.92 13.31 C 5.87 13.51 5.76 13.55 5.55 13.46 C 4.17 12.82 3.31 10.81 3.31 9.19 C 3.31 5.72 5.83 2.53 10.59 2.53 C 14.41 2.53 17.38 5.25 17.38 8.89 C 17.38 12.69 14.99 15.74 11.67 15.74 C 10.55 15.74 9.5 15.16 9.14 14.48 L 8.45 17.11 C 8.2 18.07 7.53 19.27 7.08 20 C 8.62 20.65 10.27 21 12 21 C 17.52 21 22 16.52 22 11 C 22 5.48 17.52 2 12 2 Z" fill="transparent" stroke-width="var(--1ww558a, 2)" stroke="var(--4rxgx6, black)" stroke-linecap="round" stroke-linejoin="round"/></svg>');

// Replace Pinterest link ensuring it is accurate
chunk = chunk.replace(/https:\/\/in\.pinterest\.com\/[^"']*/g, 'https://in.pinterest.com/ishantgupta6094/');
html = html.replace(/https:\/\/in\.pinterest\.com\/[^"']*/g, 'https://in.pinterest.com/ishantgupta6094/');

// =========================================================================
// 2. CERTIFICATES SECTION: CIRCULAR GOOGLE LOGO & NO FINGERPRINT
// =========================================================================
console.log('2. Configuring Certificates section: circular Google logo on all cards...');

// Ensure default back face logo is google-cert-logo.png
chunk = chunk.replaceAll('https://framerusercontent.com/images/MG7SSqT3AUbDDMeyGynYFWvAWI.png?width=160&height=160', '/images/google-cert-logo.png');

// Ensure all 4 cards have f6H9eFv_s set to google-cert-logo.png
const card1Target = `FEOSCD2pf:\`Google Data Analytics\`,height:\`100%\`,id:\`Awcs6rmjA\``;
const card1Replacement = `f6H9eFv_s:Q({pixelHeight:160,pixelWidth:160,src:\`/images/google-cert-logo.png\`},\`Google\`),FEOSCD2pf:\`Google Data Analytics\`,height:\`100%\`,id:\`Awcs6rmjA\``;
chunk = chunk.replace(card1Target, card1Replacement);

// Set Card 1 default variant to Front Face so it displays identically to the others
chunk = chunk.replace(`variant:Y(\`NQ4gmArur\`),width:\`100%\`})})})}),l(M,{breakpoint:E,overrides:{iibj7PzWt:{width:\`max((min(max(\${p?.width||\\\`100`, `variant:Y(\`LxTYbZf1i\`),width:\`100%\`})})})}),l(M,{breakpoint:E,overrides:{iibj7PzWt:{width:\`max((min(max(\${p?.width||\\\`100`);

// =========================================================================
// 3. CYPHER WATERMARK: TOUCHING ABSOLUTE BOTTOM FLOOR WITH ZERO GAP
// =========================================================================
console.log('3. Sticking CYPHER watermark to the bottom floor edge...');

// In script_main.mjs: replace the 375px viewBox and top alignment with bottom-touching parameters
scriptMain = scriptMain.replace(/verticalAlignment:\`top\`,viewBox:\`0 0 1400 375\`/g, 'verticalAlignment:`bottom`,viewBox:`0 0 1400 230`');
scriptMain = scriptMain.replace(/--framer-line-height":\`0\.9em\`/g, '--framer-line-height:`0.75em`');

// Clean up canonical URL
scriptMain = scriptMain.replaceAll('https://majd-portfolio.framer.website', 'https://cypher-red-iota.vercel.app');
html = html.replaceAll('https://majd-portfolio.framer.website', 'https://cypher-red-iota.vercel.app');

// =========================================================================
// 4. GRAPHIC DESIGN POSTERS: ROBUST LIGHTBOX EVENT LISTENER
// =========================================================================
console.log('4. Setting up robust poster click delegation in index.html...');

const newLightboxScript = `
<!-- Fullscreen Poster Lightbox Modal -->
<div id="poster-lightbox" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.94);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);z-index:9999999;align-items:center;justify-content:center;flex-direction:column;opacity:0;transition:opacity 0.25s ease;box-sizing:border-box;padding:24px;">
  <button id="lightbox-close" aria-label="Close" style="position:absolute;top:24px;right:28px;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.2);color:#fff;width:48px;height:48px;border-radius:50%;font-size:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;z-index:10000000;" onmouseover="this.style.background='rgba(255,255,255,0.35)';this.style.transform='scale(1.08)'" onmouseout="this.style.background='rgba(255,255,255,0.18)';this.style.transform='scale(1)'">✕</button>
  <div style="max-width:92vw;max-height:86vh;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;">
    <img id="lightbox-img" src="" alt="Poster" style="max-width:100%;max-height:78vh;object-fit:contain;border-radius:12px;box-shadow:0 25px 70px rgba(0,0,0,0.85);display:block;border:1px solid rgba(255,255,255,0.12);">
    <div style="margin-top:16px;text-align:center;">
      <h3 id="lightbox-title" style="margin:0;font-family:'Archivo',sans-serif;font-size:20px;font-weight:700;color:#faf7f3;line-height:1.3;letter-spacing:-0.02em;"></h3>
      <p id="lightbox-desc" style="margin:6px 0 0 0;font-family:'Inter',sans-serif;font-size:14px;color:rgba(250,247,243,0.7);max-width:600px;line-height:1.4;"></p>
    </div>
  </div>
</div>

<script>
  (function() {
    var lightbox = document.getElementById('poster-lightbox');
    var lbImg = document.getElementById('lightbox-img');
    var lbTitle = document.getElementById('lightbox-title');
    var lbDesc = document.getElementById('lightbox-desc');
    var lbClose = document.getElementById('lightbox-close');

    function openLightbox(src, title, desc) {
      if (!lightbox) return;
      lbImg.src = src;
      lbTitle.textContent = title || '';
      lbDesc.textContent = desc || '';
      lightbox.style.display = 'flex';
      setTimeout(function() {
        lightbox.style.opacity = '1';
      }, 10);
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.style.opacity = '0';
      setTimeout(function() {
        lightbox.style.display = 'none';
        lbImg.src = '';
        document.body.style.overflow = '';
      }, 250);
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lightbox) {
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target === lbClose) closeLightbox();
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeLightbox();
    });

    // Capture clicks on ANY card in the thoughts / creative art section
    document.addEventListener('click', function(e) {
      var card = e.target.closest('.framer-1leqxa3 > *, .framer-1leqxa3 a, .framer-1leqxa3 [data-framer-name], .framer-1gwykho-container, a[href*=":SIBntN1fO"], [data-framer-name="Thoughts Section"] [data-framer-name]');
      if (card && !card.closest('#poster-lightbox')) {
        var img = card.querySelector('img');
        if (img) {
          e.preventDefault();
          e.stopPropagation();
          var src = img.currentSrc || img.getAttribute('src') || '';
          var titleEl = card.querySelector('h3, .framer-styles-preset-18hoqs7, [data-styles-preset="JW7_JT3Q0"], p');
          var descEl = card.querySelector('.framer-styles-preset-8qcqpn, [data-styles-preset="e4lWfIAXv"]');
          var title = titleEl ? titleEl.textContent.trim() : (img.alt || 'Graphic Design Poster');
          var desc = (descEl && descEl !== titleEl) ? descEl.textContent.trim() : '';
          openLightbox(src, title, desc);
        }
      }
    }, true);
  })();
</script>
`;

// Replace existing lightbox in index.html or append
if (html.includes('id="poster-lightbox"')) {
  const lbStart = html.indexOf('<!-- Fullscreen Poster Lightbox Modal -->');
  const lbEnd = html.indexOf('</script>', html.indexOf('(function() {\n    var lightbox = document.getElementById(\'poster-lightbox\');')) + 9;
  if (lbStart !== -1 && lbEnd !== -1) {
    html = html.slice(0, lbStart) + newLightboxScript + html.slice(lbEnd);
  }
} else {
  html = html.replace('</body>', newLightboxScript + '\n</body>');
}

// =========================================================================
// 5. MASTER CSS OVERRIDES (CLEAN & CONSOLIDATED)
// =========================================================================
console.log('5. Consolidating CSS overrides for circular Google logo and flush bottom watermark...');

// Remove previously appended duplicate styles if present
const styleMarker = '/* === FINAL MASTER STYLES === */';
if (html.includes(styleMarker)) {
  html = html.slice(0, html.indexOf(styleMarker)) + html.slice(html.indexOf('</style>', html.indexOf(styleMarker)));
}

const finalMasterCss = `
${styleMarker}
  /* 1. Perfect Circular Google Logo on Certificates (Front & Back) */
  .framer-oiibR .framer-1i87y9p,
  .framer-oiibR .framer-16m8xcg,
  .framer-oiibR [data-framer-background-image-wrapper="true"] {
    width: 48px !important;
    height: 48px !important;
    min-width: 48px !important;
    min-height: 48px !important;
    border-radius: 50% !important;
    background: #ffffff !important;
    overflow: hidden !important;
    box-sizing: border-box !important;
    padding: 3px !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .framer-oiibR .framer-1i87y9p img,
  .framer-oiibR .framer-16m8xcg img,
  .framer-oiibR img[alt="Google"] {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
    border-radius: 50% !important;
    display: block !important;
    background: #ffffff !important;
  }

  /* 2. CYPHER Watermark: Flush to the Absolute Bottom Floor */
  .framer-soKIl.framer-788ly6,
  footer.framer-788ly6 {
    position: relative !important;
    padding-top: 100px !important;
    padding-bottom: 140px !important;
    width: 100% !important;
    max-width: 100vw !important;
    overflow: hidden !important;
    box-sizing: border-box !important;
  }

  .framer-soKIl .framer-3vb2n7,
  .framer-3vb2n7 {
    display: block !important;
    position: absolute !important;
    left: 0 !important;
    right: 0 !important;
    bottom: -10px !important;
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    pointer-events: none !important;
    -webkit-user-select: none !important;
    user-select: none !important;
    z-index: 1 !important;
    line-height: 0 !important;
    opacity: 1 !important;
    transform: none !important;
  }

  .framer-3vb2n7 svg {
    width: 100vw !important;
    max-width: 100vw !important;
    height: auto !important;
    display: block !important;
    overflow: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
    vertical-align: bottom !important;
  }

  /* 3. Thoughts & Creative Art Poster Cursor */
  .framer-1leqxa3 > *,
  .framer-1leqxa3 [data-framer-name] {
    cursor: pointer !important;
    transition: transform 0.25s ease, box-shadow 0.25s ease !important;
  }
  .framer-1leqxa3 > *:hover {
    transform: translateY(-4px) scale(1.01) !important;
  }
`;

html = html.replace('</style>', finalMasterCss + '\n</style>');

fs.writeFileSync('public/chunks/avatar_chunk.mjs', chunk, 'utf8');
fs.writeFileSync('public/chunks/script_main.mjs', scriptMain, 'utf8');
fs.writeFileSync('index.html', html, 'utf8');

console.log('=== ALL FILES SUCCESSFULLY UPDATED ===');
