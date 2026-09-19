const fs = require('fs');

console.log('=== FIXING CERTIFICATE CARDS AND FOOTER LAYOUT ===');

let chunk = fs.readFileSync('public/chunks/avatar_chunk.mjs', 'utf8');
let scriptMain = fs.readFileSync('public/chunks/script_main.mjs', 'utf8');
let html = fs.readFileSync('index.html', 'utf8');

// =========================================================================
// 1. FIX CERTIFICATE CARDS
// =========================================================================
console.log('1. Updating Certificate Cards: Course title at top, "Coursera" at bottom, Google logo everywhere...');

const certs = [
  {
    nodeId: 'Awcs6rmjA',
    title: 'Google Data Analytics',
    brand: 'Coursera',
    sub: 'Professional Certificate'
  },
  {
    nodeId: 'LPDDziUSt',
    title: 'Google IT Automation with Python',
    brand: 'Coursera',
    sub: 'Professional Certificate'
  },
  {
    nodeId: 'w2ZKyzhGF',
    title: 'Google Advanced Data Analytics',
    brand: 'Coursera',
    sub: 'Professional Certificate'
  },
  {
    nodeId: 'r7HDjo09x',
    title: 'Google Cybersecurity',
    brand: 'Coursera',
    sub: 'Professional Certificate'
  }
];

// In avatar_chunk.mjs, update each card:
// Top text (FEOSCD2pf) = Course Title
// Bottom text (imIplavjR) = Coursera
// Subtitle (R9CRr7fB5) = Professional Certificate
certs.forEach(c => {
  const marker = 'nodeId:`' + c.nodeId + '`';
  const pos = chunk.indexOf(marker);
  if (pos !== -1) {
    const cardEnd = chunk.indexOf('})})})})', pos);
    if (cardEnd !== -1) {
      let cardSnippet = chunk.slice(pos, cardEnd);
      // Top text is FEOSCD2pf
      cardSnippet = cardSnippet.replace(/FEOSCD2pf:`[^`]*`/, `FEOSCD2pf:\`${c.title}\``);
      // Bottom name is imIplavjR
      cardSnippet = cardSnippet.replace(/imIplavjR:`[^`]*`/, `imIplavjR:\`${c.brand}\``);
      // Bottom subtitle is R9CRr7fB5
      cardSnippet = cardSnippet.replace(/R9CRr7fB5:`[^`]*`/, `R9CRr7fB5:\`${c.sub}\``);
      
      chunk = chunk.slice(0, pos) + cardSnippet + chunk.slice(cardEnd);
      console.log('Card updated:', c.nodeId, '-> Title at top:', c.title);
    }
  }
});

// Replace ALL human photos and CDN URLs with Google logo
const personPhotos = [
  'kAftuUN9iRKwIt9M6RqZo9NS314',
  'HqoHkPp6dpJFdgMqUKIaAXmy7o',
  'Y9KmJAQ4w53hsc4jJojfokLZ7D8',
  'HH8KrojyxZx6X20z1r13CSwiiWE',
  'photo-1521119989659-a83eee488004',
  'photo-1534528741775-53994a69daeb',
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1500648767791-00dcc994a43e'
];

personPhotos.forEach(token => {
  let idx = 0;
  while ((idx = chunk.indexOf(token)) !== -1) {
    // Find URL boundary
    const quoteStart = chunk.lastIndexOf('`', idx);
    const quoteEnd = chunk.indexOf('`', idx);
    if (quoteStart !== -1 && quoteEnd !== -1) {
      const oldUrl = chunk.slice(quoteStart + 1, quoteEnd);
      chunk = chunk.replaceAll(oldUrl, '/images/google-logo.svg');
    } else {
      break;
    }
  }
});

// Also replace in fallback props:
chunk = chunk.replaceAll('man standing near balcony', 'Google');
chunk = chunk.replaceAll('grayscale photo of man', 'Google');
chunk = chunk.replaceAll('man standing near white wall', 'Google');
chunk = chunk.replaceAll('man in black button-up shirt', 'Google');

// Make sure Testimonial Card default values use Google logo
chunk = chunk.replace(
  /srcSet:`[^`]*kAftu[^`]*`/g,
  'srcSet:`/images/google-logo.svg 160w`'
);

// Style adjustments for top title font in Testimonial Card
// In CSS in avatar_chunk.mjs: make the top quote text prominent like a title
chunk = chunk.replaceAll(
  '.framer-oiibR .framer-xd6564 {',
  '.framer-oiibR .framer-xd6564 { font-size: 22px !important; font-weight: 700 !important; line-height: 1.3em !important; color: #faf7f3 !important;'
);

// =========================================================================
// 2. FIX FOOTER LAYOUT (RESOLVE SQUISHED S C A L I N G ... KABADA)
// =========================================================================
console.log('2. Fixing footer layout: stacking content above watermark, restoring spacious width...');

// In script_main.mjs:
// Change footer from flex-direction: row to flex-direction: column
scriptMain = scriptMain.replaceAll(
  'flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: var(--overflow-clip-fallback, clip); padding: 80px 0px 0px 0px; position: relative; width: 1280px;',
  'flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; align-items: center; overflow: hidden; padding: 100px 0px 0px 0px; position: relative; width: 100%; max-width: 100vw;'
);

// Change framer-1got5e6 from width: 1px to width: 90%; max-width: 1180px
scriptMain = scriptMain.replaceAll(
  'align-content: flex-end; align-items: flex-end; display: flex; flex: 1 0 0px; flex-direction: row; flex-wrap: nowrap; height: min-content; justify-content: space-between; max-width: 1180px; overflow: visible; padding: 0px; position: relative; width: 1px;',
  'align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: row; flex-wrap: wrap; height: min-content; justify-content: space-between; width: 90%; max-width: 1180px; overflow: visible; padding: 0px; position: relative; z-index: 2;'
);

// In index.html, inject bulletproof CSS overrides for footer and card styling
const bulletproofCss = `
  /* === Bulletproof Footer Layout (Spacious Content on Top, CYPHER on Bottom) === */
  .framer-soKIl.framer-788ly6,
  .framer-soKIl.framer-v-1w2xgsd.framer-788ly6,
  .framer-soKIl.framer-v-1s9g854.framer-788ly6,
  footer.framer-788ly6 {
    display: flex !important;
    flex-direction: column !important;
    place-content: flex-start center !important;
    align-items: center !important;
    width: 100% !important;
    max-width: 100vw !important;
    padding: 100px 0 0 0 !important;
    position: relative !important;
    overflow: hidden !important;
    box-sizing: border-box !important;
  }

  .framer-soKIl .framer-1got5e6,
  .framer-1got5e6 {
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: flex-start !important;
    flex-wrap: wrap !important;
    width: 90% !important;
    max-width: 1180px !important;
    gap: 40px !important;
    margin: 0 auto !important;
    padding: 0 20px !important;
    box-sizing: border-box !important;
    position: relative !important;
    z-index: 2 !important;
    flex: none !important;
  }

  .framer-soKIl .framer-1umwttr,
  .framer-1umwttr {
    flex: 1 1 320px !important;
    max-width: 420px !important;
    min-width: 260px !important;
    white-space: normal !important;
  }

  .framer-soKIl .framer-19u2gmr,
  .framer-19u2gmr {
    flex: 1 1 450px !important;
    max-width: 650px !important;
    min-width: 280px !important;
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: flex-start !important;
    gap: 40px !important;
    white-space: normal !important;
  }

  .framer-soKIl .framer-kularx,
  .framer-kularx {
    display: flex !important;
    flex-direction: column !important;
    gap: 16px !important;
  }

  .framer-soKIl .framer-1ac7wjl,
  .framer-1ac7wjl {
    display: flex !important;
    flex-direction: column !important;
    gap: 16px !important;
  }

  .framer-soKIl .framer-3drypv p,
  .framer-3drypv a {
    white-space: nowrap !important;
  }

  /* Full Bleed CYPHER Typography at bottom of footer */
  .framer-soKIl .framer-3vb2n7,
  .framer-3vb2n7 {
    display: block !important;
    position: relative !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
    margin-top: 60px !important;
    margin-bottom: 0px !important;
    padding: 0 !important;
    overflow: hidden !important;
    transform: none !important;
    pointer-events: none !important;
    user-select: none !important;
    z-index: 1 !important;
  }

  .framer-3vb2n7 svg {
    width: 100vw !important;
    max-width: 100vw !important;
    height: auto !important;
    display: block !important;
    overflow: hidden !important;
  }

  /* === Certificate Cards Styling === */
  .framer-oiibR .framer-xd6564 p,
  .framer-oiibR .framer-xd6564 {
    font-size: 22px !important;
    font-weight: 700 !important;
    line-height: 1.3em !important;
    letter-spacing: -0.01em !important;
    color: rgb(250, 247, 243) !important;
    font-family: 'Archivo', sans-serif !important;
  }

  .framer-oiibR .framer-1i87y9p {
    width: 48px !important;
    height: 48px !important;
    border-radius: 50% !important;
    overflow: hidden !important;
    background: rgba(255, 255, 255, 0.08) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 6px !important;
    box-sizing: border-box !important;
  }

  .framer-oiibR .framer-1i87y9p img {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
    border-radius: 0 !important;
  }
`;

// Replace existing CSS rules in index.html
if (html.includes('/* === Edge-to-Edge CYPHER Watermark')) {
  html = html.replace(/\/\* === Edge-to-Edge CYPHER Watermark[\s\S]*?<\/style>/, bulletproofCss + '\n</style>');
} else if (html.includes('/* === Bulletproof Footer Layout')) {
  html = html.replace(/\/\* === Bulletproof Footer Layout[\s\S]*?<\/style>/, bulletproofCss + '\n</style>');
} else {
  html = html.replace('</style>', bulletproofCss + '\n</style>');
}

fs.writeFileSync('public/chunks/avatar_chunk.mjs', chunk, 'utf8');
fs.writeFileSync('public/chunks/script_main.mjs', scriptMain, 'utf8');
fs.writeFileSync('index.html', html, 'utf8');

console.log('=== ALL CHANGES SAVED SUCCESSFULLY ===');
