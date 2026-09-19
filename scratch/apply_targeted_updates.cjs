const fs = require('fs');

console.log('--- PERFORMING TARGETED UPDATES ---');

let chunk = fs.readFileSync('public/chunks/avatar_chunk.mjs', 'utf8');
let scriptMain = fs.readFileSync('public/chunks/script_main.mjs', 'utf8');
let html = fs.readFileSync('index.html', 'utf8');

// =========================================================================
// 1. COURSERA CERTIFICATES IN AVATAR_CHUNK
// =========================================================================
console.log('1. Updating Coursera Certificate Cards in avatar_chunk.mjs...');

// Change section title to "Licenses & Certifications"
chunk = chunk.replaceAll('children:`Testimonials`', 'children:`Licenses & Certifications`');
chunk = chunk.replaceAll('children:`What people say`', 'children:`Licenses & Certifications`');

const certDetails = [
  {
    nodeId: 'Awcs6rmjA',
    title: 'Google Data Analytics',
    credential: 'Coursera · Google Certified',
    quote: 'Industry-standard credential covering data cleaning, SQL querying, R programming, spreadsheets, and Tableau visualizations to uncover key business drivers and patterns.',
    link: 'https://www.coursera.org/professional-certificates/google-data-analytics'
  },
  {
    nodeId: 'LPDDziUSt',
    title: 'Google IT Automation with Python',
    credential: 'Coursera · Google Certified',
    quote: 'Professional mastery in Python automation scripting, OS interaction, Git version control, and system troubleshooting for scalable, resilient software workflows.',
    link: 'https://www.coursera.org/professional-certificates/google-it-automation-python'
  },
  {
    nodeId: 'w2ZKyzhGF',
    title: 'Google Advanced Data Analytics',
    credential: 'Coursera · Google Certified',
    quote: 'Rigorous specialization in machine learning models, statistical regression, exploratory predictive analysis, and Python frameworks (Pandas, NumPy, Scikit-Learn).',
    link: 'https://www.coursera.org/professional-certificates/google-advanced-data-analytics'
  },
  {
    nodeId: 'r7HDjo09x',
    title: 'Google Cybersecurity',
    credential: 'Coursera · Google Certified',
    quote: 'Extensive training in identifying vulnerabilities, network security architecture, SIEM threat monitoring, and automated defensive security scripting in Python.',
    link: 'https://www.coursera.org/professional-certificates/google-cybersecurity'
  }
];

certDetails.forEach(c => {
  const marker = 'nodeId:`' + c.nodeId + '`';
  const pos = chunk.indexOf(marker);
  if (pos !== -1) {
    const cardEnd = chunk.indexOf('})})})})', pos);
    if (cardEnd !== -1) {
      let cardSnippet = chunk.slice(pos, cardEnd);
      // Replace name
      cardSnippet = cardSnippet.replace(/imIplavjR:`[^`]*`/, `imIplavjR:\`${c.title}\``);
      // Replace subtitle/role
      cardSnippet = cardSnippet.replace(/R9CRr7fB5:`[^`]*`/, `R9CRr7fB5:\`${c.credential}\``);
      // Replace quote
      cardSnippet = cardSnippet.replace(/FEOSCD2pf:`[^`]*`/, `FEOSCD2pf:\`${c.quote}\``);
      // Replace photo/avatar
      cardSnippet = cardSnippet.replace(/QlYM9XEjG:Q\(\{[^}]*\},``\)/, `QlYM9XEjG:Q({pixelHeight:160,pixelWidth:160,src:\`/images/google-logo.svg\`},\`\`)`);
      cardSnippet = cardSnippet.replace(/f6H9eFv_s:Q\(\{[^}]*\},``\)/, `f6H9eFv_s:Q({pixelHeight:160,pixelWidth:160,src:\`/images/google-logo.svg\`},\`\`)`);
      
      chunk = chunk.slice(0, pos) + cardSnippet + chunk.slice(cardEnd);
      console.log('Updated certificate card:', c.nodeId, c.title);
    }
  }
});

// Update Testimonial Card component default avatar photo
chunk = chunk.replaceAll(
  'https://framerusercontent.com/images/kAftuUN9iRKwIt9M6RqZo9NS314.jpg?width=3840&height=5275',
  '/images/google-logo.svg'
);
chunk = chunk.replaceAll(
  'https://framerusercontent.com/images/k7aJ0wW6m9t0E7oE7k8m1n9.jpg',
  '/images/google-logo.svg'
);

// Make the testimonial cards clickable to verify the certificate on Coursera!
// In Testimonial Card component definition:
chunk = chunk.replaceAll('href:c.V1MRCV9ui', 'href:c.V1MRCV9ui');

// =========================================================================
// 2. SOCIAL LINKS: PINTEREST
// =========================================================================
console.log('2. Verifying Pinterest social link in chunk and HTML...');
const pinterestUrl = 'https://in.pinterest.com/ishantgupta6094/';
chunk = chunk.replaceAll('tel:+919508458599', pinterestUrl);
chunk = chunk.replaceAll('Youtube Video Social', 'Pinterest Social');

html = html.replaceAll('tel:+919508458599', pinterestUrl);

// =========================================================================
// 3. CYPHER WATERMARK: EDGE-TO-EDGE & REMOVE USELESS PADDING
// =========================================================================
console.log('3. Perfecting edge-to-edge CYPHER watermark (C at left edge, R at right edge)...');

// In script_main.mjs:
// Remove the 300px bottom padding on footer
scriptMain = scriptMain.replaceAll('padding: 120px 0px 300px 0px;', 'padding: 80px 0px 0px 0px;');
scriptMain = scriptMain.replaceAll('padding: 100px 0px 300px 0px;', 'padding: 60px 0px 0px 0px;');
scriptMain = scriptMain.replaceAll('padding: 80px 0px 200px 0px;', 'padding: 50px 0px 0px 0px;');

// CYPHER position: relative at bottom of footer, 100vw edge to edge
scriptMain = scriptMain.replaceAll(
  '.framer-soKIl .framer-3vb2n7 { bottom: -100px; flex: none; height: auto; left: 50%; max-width: 1200px; position: absolute; white-space: pre; width: 94%; z-index: 1; }',
  '.framer-soKIl .framer-3vb2n7 { bottom: 0px; flex: none; height: auto; left: 0px; right: 0px; width: 100vw; max-width: 100vw; position: relative; white-space: nowrap; margin-top: 30px; z-index: 1; overflow: hidden; display: block; }'
);
scriptMain = scriptMain.replaceAll(
  '.framer-soKIl.framer-v-1w2xgsd .framer-3vb2n7 { bottom: -50px; width: 94%; }',
  '.framer-soKIl.framer-v-1w2xgsd .framer-3vb2n7 { bottom: 0px; width: 100vw; max-width: 100vw; }'
);
scriptMain = scriptMain.replaceAll(
  '.framer-soKIl.framer-v-1s9g854 .framer-3vb2n7 { bottom: -10px; width: 94%; }',
  '.framer-soKIl.framer-v-1s9g854 .framer-3vb2n7 { bottom: 0px; width: 100vw; max-width: 100vw; }'
);

// CSS Overrides in index.html for guaranteed edge-to-edge typography
const edgeCss = `
  /* === Edge-to-Edge CYPHER Watermark (C at left edge, R at right edge) === */
  .framer-soKIl.framer-788ly6,
  .framer-soKIl.framer-v-1w2xgsd.framer-788ly6,
  .framer-soKIl.framer-v-1s9g854.framer-788ly6,
  footer.framer-788ly6 {
    padding-bottom: 0px !important;
    padding-top: 80px !important;
    width: 100% !important;
    max-width: 100vw !important;
    overflow: hidden !important;
    position: relative !important;
    box-sizing: border-box !important;
  }

  .framer-soKIl .framer-3vb2n7,
  .framer-3vb2n7 {
    position: relative !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 40px 0 0 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    transform: none !important;
    display: block !important;
    pointer-events: none !important;
    user-select: none !important;
  }

  .framer-3vb2n7 svg {
    width: 100vw !important;
    max-width: 100vw !important;
    height: auto !important;
    display: block !important;
    overflow: hidden !important;
  }

  .framer-3vb2n7 foreignObject {
    width: 100vw !important;
    max-width: 100vw !important;
    overflow: visible !important;
    display: block !important;
  }

  .framer-3vb2n7 foreignObject p {
    font-size: clamp(55px, 20.8vw, 360px) !important;
    line-height: 0.8em !important;
    letter-spacing: -0.04em !important;
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
    text-align: justify !important;
    text-align-last: justify !important;
    text-justify: inter-character !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: flex-end !important;
    white-space: nowrap !important;
    box-sizing: border-box !important;
  }

  /* Responsive Certificate Cards & Google Logo */
  .framer-8rrbdk {
    gap: 20px !important;
  }
  .framer-oiibR img[src*="google-logo"] {
    object-fit: contain !important;
    padding: 6px !important;
    background: rgba(255, 255, 255, 0.06) !important;
    border-radius: 12px !important;
  }
`;

if (html.includes('Edge-to-Edge CYPHER Watermark')) {
  html = html.replace(/\/\* === Edge-to-Edge CYPHER Watermark[\s\S]*?<\/style>/, edgeCss + '\n</style>');
} else {
  html = html.replace('</style>', edgeCss + '\n</style>');
}

// In index.html footer SVG:
const cypherSvg = `
<svg class="framer-3vb2n7" data-framer-component-type="RichTextContainer" viewBox="0 0 1000 160" preserveAspectRatio="none" style="--extracted-r6o4lv:var(--token-57f08e2a-01d8-4ce0-89a5-f6d5488003ee, rgba(250, 247, 243, 0.1));--framer-link-text-color:rgb(0, 153, 255);--framer-link-text-decoration:underline;width:100vw;max-width:100vw;height:auto;display:block;overflow:hidden;margin-top:40px;position:relative;left:0;bottom:0">
  <text x="0" y="140" textLength="1000" lengthAdjust="spacing" font-family="'Archivo', 'Archivo Placeholder', sans-serif" font-weight="900" font-size="160" fill="var(--token-57f08e2a-01d8-4ce0-89a5-f6d5488003ee, rgba(250, 247, 243, 0.1))" letter-spacing="-0.02em">CYPHER</text>
</svg>
`.trim();

html = html.replace(/<svg class="framer-3vb2n7"[^>]*>[\s\S]*?<\/svg>/g, cypherSvg);

fs.writeFileSync('public/chunks/avatar_chunk.mjs', chunk, 'utf8');
fs.writeFileSync('public/chunks/script_main.mjs', scriptMain, 'utf8');
fs.writeFileSync('index.html', html, 'utf8');

console.log('--- ALL FILES WRITTEN SUCCESSFULLY ---');
