const fs = require('fs');

console.log('=== MATCHING SCREENSHOT 2 EXACTLY ===');

let chunk = fs.readFileSync('public/chunks/avatar_chunk.mjs', 'utf8');
let scriptMain = fs.readFileSync('public/chunks/script_main.mjs', 'utf8');
let html = fs.readFileSync('index.html', 'utf8');

// =========================================================================
// 1. PERFECT THE 4 CERTIFICATE CARDS
// =========================================================================
console.log('1. Setting certificate card titles at top, Coursera at bottom, Google logo everywhere...');

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

// Ensure all person photos are replaced with Google logo in chunk
const personPhotos = [
  'kAftuUN9iRKwIt9M6RqZo9NS314',
  'HqoHkPp6dpJFdgMqUKIaAXmy7o',
  'Y9KmJAQ4w53hsc4jJojfokLZ7D8',
  'HH8KrojyxZx6X20z1r13CSwiiWE',
  'photo-1521119989659',
  'photo-1534528741775',
  'photo-1507003211169',
  'photo-1500648767791'
];

personPhotos.forEach(token => {
  let idx = 0;
  while ((idx = chunk.indexOf(token)) !== -1) {
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

// Replace in default props of Testimonial Card
chunk = chunk.replaceAll('man standing near balcony', 'Google');
chunk = chunk.replaceAll('grayscale photo of man', 'Google');
chunk = chunk.replaceAll('man standing near white wall', 'Google');
chunk = chunk.replaceAll('man in black button-up shirt', 'Google');

// =========================================================================
// 2. PERFECT FOOTER TO MATCH SCREENSHOT 2
// =========================================================================
console.log('2. Matching footer layout with Screenshot 2 (Generous padding, clean horizontal columns, edge-to-edge CYPHER at bottom)...');

// In script_main.mjs:
// Ensure original footer container layout is preserved (relative, row, centered)
scriptMain = scriptMain.replaceAll(
  'padding: 80px 0px 0px 0px;',
  'padding: 140px 0px 280px 0px;'
);
scriptMain = scriptMain.replaceAll(
  'padding: 60px 0px 0px 0px;',
  'padding: 120px 0px 240px 0px;'
);
scriptMain = scriptMain.replaceAll(
  'padding: 50px 0px 0px 0px;',
  'padding: 100px 0px 180px 0px;'
);

// Restore framer-3vb2n7 to position: absolute, bottom: -40px, width: 100vw, z-index: 1
scriptMain = scriptMain.replaceAll(
  '.framer-soKIl .framer-3vb2n7 { bottom: 0px; flex: none; height: auto; left: 0px; right: 0px; width: 100vw; max-width: 100vw; position: relative; white-space: nowrap; margin-top: 30px; z-index: 1; overflow: hidden; display: block; }',
  '.framer-soKIl .framer-3vb2n7 { bottom: -40px; flex: none; height: auto; left: 50%; transform: translateX(-50%); width: 100vw; max-width: 100vw; position: absolute; white-space: nowrap; z-index: 1; overflow: hidden; display: block; pointer-events: none; }'
);
scriptMain = scriptMain.replaceAll(
  '.framer-soKIl.framer-v-1w2xgsd .framer-3vb2n7 { bottom: 0px; width: 100vw; max-width: 100vw; }',
  '.framer-soKIl.framer-v-1w2xgsd .framer-3vb2n7 { bottom: -20px; width: 100vw; max-width: 100vw; position: absolute; left: 50%; transform: translateX(-50%); }'
);
scriptMain = scriptMain.replaceAll(
  '.framer-soKIl.framer-v-1s9g854 .framer-3vb2n7 { bottom: 0px; width: 100vw; max-width: 100vw; }',
  '.framer-soKIl.framer-v-1s9g854 .framer-3vb2n7 { bottom: 0px; width: 100vw; max-width: 100vw; position: absolute; left: 50%; transform: translateX(-50%); }'
);

// CSS in index.html for Screenshot 2 layout
const exactScreenshot2Css = `
  /* === Exact Screenshot 2 Footer Layout === */
  .framer-soKIl.framer-788ly6,
  .framer-soKIl.framer-v-1w2xgsd.framer-788ly6,
  footer.framer-788ly6 {
    display: flex !important;
    flex-direction: row !important;
    justify-content: center !important;
    align-items: flex-start !important;
    width: 100% !important;
    max-width: 100vw !important;
    padding: 140px 0 280px 0 !important;
    position: relative !important;
    overflow: hidden !important;
    box-sizing: border-box !important;
  }

  @media (max-width: 809.98px) {
    .framer-soKIl.framer-v-1s9g854.framer-788ly6,
    footer.framer-788ly6 {
      padding: 100px 0 200px 0 !important;
    }
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
    flex: 1 0 auto !important;
  }

  .framer-soKIl .framer-1umwttr,
  .framer-1umwttr {
    flex: 1 1 320px !important;
    max-width: 380px !important;
    min-width: 260px !important;
    white-space: normal !important;
  }

  .framer-soKIl .framer-19u2gmr,
  .framer-19u2gmr {
    flex: 1 1 500px !important;
    max-width: 650px !important;
    min-width: 300px !important;
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

  /* Full Bleed Watermark Behind Content at Bottom (Screenshot 2 Match) */
  .framer-soKIl .framer-3vb2n7,
  .framer-3vb2n7 {
    display: block !important;
    position: absolute !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    right: auto !important;
    bottom: -30px !important;
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
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

  /* === Certificate Cards: Top Title & Google Logo === */
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
if (html.includes('/* === Exact Screenshot 2 Footer Layout')) {
  html = html.replace(/\/\* === Exact Screenshot 2 Footer Layout[\s\S]*?<\/style>/, exactScreenshot2Css + '\n</style>');
} else if (html.includes('/* === Bulletproof Footer Layout')) {
  html = html.replace(/\/\* === Bulletproof Footer Layout[\s\S]*?<\/style>/, exactScreenshot2Css + '\n</style>');
} else if (html.includes('/* === Edge-to-Edge CYPHER Watermark')) {
  html = html.replace(/\/\* === Edge-to-Edge CYPHER Watermark[\s\S]*?<\/style>/, exactScreenshot2Css + '\n</style>');
} else {
  html = html.replace('</style>', exactScreenshot2Css + '\n</style>');
}

// In index.html footer SVG:
const cypherSvg = `
<svg class="framer-3vb2n7" data-framer-component-type="RichTextContainer" viewBox="0 0 1000 160" preserveAspectRatio="none" style="--extracted-r6o4lv:var(--token-57f08e2a-01d8-4ce0-89a5-f6d5488003ee, rgba(250, 247, 243, 0.1));--framer-link-text-color:rgb(0, 153, 255);--framer-link-text-decoration:underline;width:100vw;max-width:100vw;height:auto;display:block;overflow:hidden;position:absolute;left:50%;transform:translateX(-50%);bottom:-30px;pointer-events:none">
  <text x="0" y="140" textLength="1000" lengthAdjust="spacing" font-family="'Archivo', 'Archivo Placeholder', sans-serif" font-weight="900" font-size="160" fill="var(--token-57f08e2a-01d8-4ce0-89a5-f6d5488003ee, rgba(250, 247, 243, 0.1))" letter-spacing="-0.02em">CYPHER</text>
</svg>
`.trim();

html = html.replace(/<svg class="framer-3vb2n7"[^>]*>[\s\S]*?<\/svg>/g, cypherSvg);

fs.writeFileSync('public/chunks/avatar_chunk.mjs', chunk, 'utf8');
fs.writeFileSync('public/chunks/script_main.mjs', scriptMain, 'utf8');
fs.writeFileSync('index.html', html, 'utf8');

console.log('=== APPLIED SCREENSHOT 2 MATCH PERFECTLY ===');
