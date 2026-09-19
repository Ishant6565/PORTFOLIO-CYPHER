const fs = require('fs');
const path = require('path');

console.log('=== STARTING COMPLETE UPDATE FOR ALL USER REQUIREMENTS ===');

let html = fs.readFileSync('index.html', 'utf8');
let chunk = fs.readFileSync('public/chunks/avatar_chunk.mjs', 'utf8');
let scriptMain = fs.readFileSync('public/chunks/script_main.mjs', 'utf8');

// =========================================================================
// 1. THOUGHTS & CREATIVE ART: 8 POSTERS
// =========================================================================
console.log('1. Updating Thoughts section to include all 8 artworks...');

const vTime = Date.now();

const allThoughts = [
  {
    id: "thought-1",
    title: "The Batman: Graphic Noir & Silhouette Form",
    desc: "Deconstructing brutalist typography, heavy rain textures, and cinematic comic framing.",
    date: "Sep 2026",
    isoDate: "2026-09-15T12:00:00.000Z",
    img: `/thoughts/batman-rainy.jpg?v=${vTime}`,
    slug: "#thoughts"
  },
  {
    id: "thought-2",
    title: "Jinx (Arcane): Character Dossier & Color Theory",
    desc: "Analyzing neon graffiti layering, dual-tone character psychology, and retro comic dossier art.",
    date: "Sep 2026",
    isoDate: "2026-09-10T12:00:00.000Z",
    img: `/thoughts/jinx-arcane.jpg?v=${vTime}`,
    slug: "#thoughts"
  },
  {
    id: "thought-3",
    title: "The Dark Knight: Torn-Paper Collage Aesthetics",
    desc: "Halftone dot rastering, architectural Gotham collage, and high-contrast comic strip layering.",
    date: "Sep 2026",
    isoDate: "2026-09-05T12:00:00.000Z",
    img: `/thoughts/dark-knight-collage.jpg?v=${vTime}`,
    slug: "#thoughts"
  },
  {
    id: "thought-4",
    title: "Solo Leveling: Sung Jin-Woo Shadow Monarch",
    desc: "Dynamic webtoon ink linework, commanding silhouette composition, and monochrome aura art.",
    date: "Sep 2026",
    isoDate: "2026-09-01T12:00:00.000Z",
    img: `/thoughts/solo-leveling-jinwoo.jpg?v=${vTime}`,
    slug: "#thoughts"
  },
  {
    id: "thought-5",
    title: "Naruto Team 7: Bonds, Nakama & Will of Fire",
    desc: "Iconic monochrome manga typography, raw emotional character linework, and Team 7 tribute.",
    date: "Sep 2026",
    isoDate: "2026-08-28T12:00:00.000Z",
    img: `/thoughts/naruto-team-7.jpg?v=${vTime}`,
    slug: "#thoughts"
  },
  {
    id: "thought-6",
    title: "Spider-Man: Into the Spider-Verse (Morales Graffiti)",
    desc: "Bold street graffiti lettering, glitch multiverse chromatic aberration, and electric comic panels.",
    date: "Sep 2026",
    isoDate: "2026-08-25T12:00:00.000Z",
    img: `/thoughts/miles-morales-graffiti.jpg?v=${vTime}`,
    slug: "#thoughts"
  },
  {
    id: "thought-7",
    title: "Spider-Man: Miles Morales Comic Cover Collage",
    desc: "Classic comic book cutouts, halftone pulp texture, and dynamic kinetic leap composition.",
    date: "Sep 2026",
    isoDate: "2026-08-20T12:00:00.000Z",
    img: `/thoughts/spider-man-collage.jpg?v=${vTime}`,
    slug: "#thoughts"
  },
  {
    id: "thought-8",
    title: "Lana Del Rey: Vintage Cinematic Noir Typography",
    desc: "Soft motion blur portraiture, classic script typography, and monochromatic album aesthetics.",
    date: "Sep 2026",
    isoDate: "2026-08-15T12:00:00.000Z",
    img: `/thoughts/lana-del-rey.jpg?v=${vTime}`,
    slug: "#thoughts"
  }
];

// Update ISHANT_THOUGHTS in avatar_chunk.mjs
const thoughtsDataDef = `
const ISHANT_THOUGHTS = ${JSON.stringify(allThoughts.map(t => ({
  id: t.id,
  FLXjmg39N: t.title,
  uHTfXP8yq: t.desc,
  createdAt: t.isoDate,
  V1MRCV9ui: t.slug,
  omkZUzufP: {
    src: t.img,
    srcSet: `${t.img} 640w`,
    pixelWidth: 640,
    pixelHeight: 900
  }
})), null, 2)};
`;

if (chunk.includes('const ISHANT_THOUGHTS =')) {
  chunk = chunk.replace(/const ISHANT_THOUGHTS = [\s\S]*?\];/g, thoughtsDataDef.trim());
} else {
  chunk = thoughtsDataDef + '\n' + chunk;
}

// Update SSR HTML in index.html for all 8 thoughts
function renderThoughtCard(t) {
  return `
    <div class="framer-1gwykho-container" style="will-change:transform;opacity:1;transform:none">
      <!--$--><a as="a" class="framer-6Ku2B framer-cZC2Y framer-zr0hx framer-hvjv56 framer-v-hvjv56 framer-191gk2e" data-framer-name="Primary" href="${t.slug}" style="width:100%;border-radius:20px;overflow:hidden;position:relative;display:flex;flex-direction:column;text-decoration:none;border:1px solid rgba(0,0,0,0.08);background:#111">
        <div class="framer-jkaeo8" data-framer-name="Image" style="border-radius:20px;overflow:hidden;height:420px;position:relative;background:#111">
          <div style="position:absolute;border-radius:inherit;top:0;right:0;bottom:0;left:0" data-framer-background-image-wrapper="true">
            <img decoding="async" width="640" height="900" srcset="${t.img} 640w" src="${t.img}" alt="${t.title}" style="display:block;width:100%;height:100%;border-radius:inherit;object-position:center top;object-fit:cover;transition:transform 0.4s ease" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
          </div>
        </div>
        <div class="framer-18acmlx" data-framer-name="Overlay" style="position:absolute;top:0;right:0;bottom:0;left:0;background:linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.88) 100%);border-radius:20px;pointer-events:none"></div>
        <div class="framer-1gvst6m" data-framer-name="Content" style="position:absolute;bottom:0;left:0;right:0;padding:24px;display:flex;flex-direction:column;gap:8px;z-index:2">
          <div class="framer-1x5yol4" data-framer-name="Title &amp; Date" style="display:flex;flex-direction:column;gap:4px">
            <div class="framer-mup09r" data-framer-component-type="RichTextContainer">
              <h3 class="framer-text framer-styles-preset-16w8n5n" data-styles-preset="rnettFmGc" dir="auto" style="font-family:'Archivo',sans-serif;font-size:18px;font-weight:600;color:rgb(250, 247, 243);margin:0;line-height:1.25em">${t.title}</h3>
            </div>
            <div class="framer-1f1981t" data-framer-component-type="RichTextContainer">
              <p class="framer-text framer-styles-preset-8qcqpn" data-styles-preset="e4lWfIAXv" dir="auto" style="font-size:12px;color:rgba(250, 247, 243, 0.6);margin:0;text-transform:uppercase;letter-spacing:0.05em">${t.date}</p>
            </div>
          </div>
          <div class="framer-1m6g45b" data-framer-component-type="RichTextContainer">
            <p class="framer-text framer-styles-preset-8qcqpn" data-styles-preset="e4lWfIAXv" dir="auto" style="font-size:13px;color:rgba(250, 247, 243, 0.85);margin:0;line-height:1.4em">${t.desc}</p>
          </div>
        </div>
      </a><!--/$-->
    </div>
  `;
}

const thoughtsGridHtml = `
<div class="framer-1leqxa3" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:20px;width:100%">
  <!--$--><div class="ssr-variant" style="display:contents">
    ${allThoughts.map(renderThoughtCard).join('')}
  </div><!--/$-->
</div>
`;

const tStart = html.indexOf('<div class="framer-1leqxa3"');
const tEnd = html.indexOf('</div></div></div></section>', tStart);
if (tStart !== -1 && tEnd !== -1) {
  html = html.substring(0, tStart) + thoughtsGridHtml + html.substring(tEnd + 6);
  console.log('Updated 8 thoughts cards in index.html');
}

// =========================================================================
// 2. REPLACE YOUTUBE WITH PINTEREST
// =========================================================================
console.log('2. Replacing YouTube with Pinterest in avatar_chunk and index.html...');

const pinterestUrl = 'https://in.pinterest.com/ishantgupta6094/';

// In avatar_chunk.mjs: replace tel link or youtube references with Pinterest
chunk = chunk.replaceAll('tel:+919508458599', pinterestUrl);
chunk = chunk.replaceAll('Youtube Video Social', 'Pinterest Social');

// In index.html: replace href and SVG path
const oldYoutubeLinkStart = html.indexOf('href="tel:+919508458599"');
if (oldYoutubeLinkStart !== -1) {
  const cEnd = html.indexOf('</a><!--/$--></div></div></div><form', oldYoutubeLinkStart);
  if (cEnd !== -1) {
    const pinterestSnippet = `href="${pinterestUrl}" target="_blank" rel="noopener noreferrer" style="background-color:var(--token-050a7e9f-40b2-4d5e-8e58-10c5e629e538, rgba(0, 0, 0, 0.1));border-radius:8px;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="20" height="20" fill="var(--token-e44374f3-0aa3-4326-a0ec-25df52a31057, rgb(17, 17, 17))"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>`;
    html = html.substring(0, oldYoutubeLinkStart) + pinterestSnippet + html.substring(cEnd);
    console.log('Replaced YouTube link with Pinterest in index.html');
  }
}

// Also replace in footer if any
html = html.replaceAll('href="tel:+919508458599"', `href="${pinterestUrl}" target="_blank"`);

// =========================================================================
// 3. COURSERA GOOGLE CERTIFICATES REPLACING TESTIMONIALS
// =========================================================================
console.log('3. Replacing Testimonials with Coursera Google Licensed Certificates...');

// In avatar_chunk.mjs:
// Update section title
chunk = chunk.replaceAll('children:`Testimonials`', 'children:`Licenses & Certifications`');

// Certificates data:
const certs = [
  {
    id: "Awcs6rmjA",
    title: "Google Data Analytics",
    credential: "Coursera · Google Certified",
    quote: "Industry-standard credential covering end-to-end data cleaning, SQL querying, R programming, spreadsheets, and Tableau visualizations to uncover key business drivers.",
    link: "https://www.coursera.org/professional-certificates/google-data-analytics"
  },
  {
    id: "LPDDziUSt",
    title: "Google IT Automation with Python",
    credential: "Coursera · Google Certified",
    quote: "Professional mastery in Python automation scripting, OS interaction, Git version control, and system troubleshooting for scalable software workflows.",
    link: "https://www.coursera.org/professional-certificates/google-it-automation-python"
  },
  {
    id: "w2ZKyzhGF",
    title: "Google Advanced Data Analytics",
    credential: "Coursera · Google Certified",
    quote: "Rigorous specialization in machine learning models, statistical regression, exploratory predictive analysis, and Python frameworks (Pandas, Scikit-Learn).",
    link: "https://www.coursera.org/professional-certificates/google-advanced-data-analytics"
  },
  {
    id: "r7HDjo09x",
    title: "Google Cybersecurity",
    credential: "Coursera · Google Certified",
    quote: "Extensive training in identifying vulnerabilities, network security architecture, SIEM threat monitoring, and automated defensive scripting in Python.",
    link: "https://www.coursera.org/professional-certificates/google-cybersecurity"
  }
];

// In avatar_chunk.mjs, replace each card's quote and person details
chunk = chunk.replace(
  /FEOSCD2pf:`Templyo completely changed[\s\S]*?`Awcs6rmjA`,imIplavjR:`Yakoub Kashmiri`,layoutId:`Awcs6rmjA`,R9CRr7fB5:`Marketing Director`/,
  `FEOSCD2pf:\`${certs[0].quote}\`,height:\`100%\`,id:\`Awcs6rmjA\`,imIplavjR:\`${certs[0].title}\`,layoutId:\`Awcs6rmjA\`,R9CRr7fB5:\`${certs[0].credential}\``
);

chunk = chunk.replace(
  /FEOSCD2pf:`I’ve tried dozens of Framer templates[\s\S]*?`LPDDziUSt`,imIplavjR:`Daniel K\.`,layoutId:`LPDDziUSt`,R9CRr7fB5:`Founder`/,
  `FEOSCD2pf:\`${certs[1].quote}\`,height:\`100%\`,id:\`LPDDziUSt\`,imIplavjR:\`${certs[1].title}\`,layoutId:\`LPDDziUSt\`,R9CRr7fB5:\`${certs[1].credential}\``
);

chunk = chunk.replace(
  /FEOSCD2pf:`Templyo saved me weeks of work[\s\S]*?`w2ZKyzhGF`,imIplavjR:`Mark M\.`,layoutId:`w2ZKyzhGF`,R9CRr7fB5:`SaaS Founder`/,
  `FEOSCD2pf:\`${certs[2].quote}\`,height:\`100%\`,id:\`w2ZKyzhGF\`,imIplavjR:\`${certs[2].title}\`,layoutId:\`w2ZKyzhGF\`,R9CRr7fB5:\`${certs[2].credential}\``
);

chunk = chunk.replace(
  /FEOSCD2pf:`The quality is insane[\s\S]*?`r7HDjo09x`,imIplavjR:`Omar H\.`,layoutId:`r7HDjo09x`,R9CRr7fB5:`Product Designer`/,
  `FEOSCD2pf:\`${certs[3].quote}\`,height:\`100%\`,id:\`r7HDjo09x\`,imIplavjR:\`${certs[3].title}\`,layoutId:\`r7HDjo09x\`,R9CRr7fB5:\`${certs[3].credential}\``
);

// Replace avatar photos with Google Logo SVG in avatar_chunk.mjs
chunk = chunk.replaceAll(
  'https://framerusercontent.com/images/kAftuUN9iRKwIt9M6RqZo9NS314.jpg?width=3840&height=5275',
  '/images/google-logo.svg'
);
chunk = chunk.replaceAll(
  'https://framerusercontent.com/images/k7aJ0wW6m9t0E7oE7k8m1n9.jpg',
  '/images/google-logo.svg'
);

// Also update the Testimonial Card component default avatar photo
chunk = chunk.replace(
  /src:`https:\/\/framerusercontent\.com\/images\/kAftuUN9iRKwIt9M6RqZo9NS314\.jpg[^`]*`/g,
  'src:`/images/google-logo.svg`'
);

// Update Testimonial Card to render a link and Google logo
// =========================================================================
// 4. FOOTER: CYPHER EDGE-TO-EDGE & REMOVE USELESS SPACE
// =========================================================================
console.log('4. Making CYPHER watermark stretch 100% edge-to-edge (C at 0, R at 100%) and removing void...');

// In script_main.mjs:
// Replace the footer padding so there is NO useless 300px blank space
scriptMain = scriptMain.replaceAll(
  'padding: 120px 0px 300px 0px;',
  'padding: 80px 0px 0px 0px;'
);
scriptMain = scriptMain.replaceAll(
  'padding: 100px 0px 300px 0px;',
  'padding: 60px 0px 0px 0px;'
);
scriptMain = scriptMain.replaceAll(
  'padding: 80px 0px 200px 0px;',
  'padding: 50px 0px 0px 0px;'
);

// In script_main.mjs CSS for framer-3vb2n7:
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

// Also in index.html CSS:
// Inject a bulletproof responsive edge-to-edge typography rule
const edgeToEdgeCss = `
  /* === Bulletproof Edge-to-Edge CYPHER Watermark === */
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

  /* Certificate cards hover & styling */
  .framer-oiibR {
    transition: transform 0.3s ease, border-color 0.3s ease !important;
    cursor: pointer !important;
  }
  .framer-oiibR:hover {
    transform: translateY(-4px) !important;
  }
`;

// Replace existing watermark CSS with edgeToEdgeCss
if (html.includes('Responsive footer watermark CYPHER')) {
  html = html.replace(/\/\* Responsive footer watermark CYPHER \*\/[\s\S]*?<\/style>/, edgeToEdgeCss + '\n</style>');
} else {
  html = html.replace('</style>', edgeToEdgeCss + '\n</style>');
}

// In index.html: update the footer SVG element directly
const cypherSvgMarkup = `
<svg class="framer-3vb2n7" data-framer-component-type="RichTextContainer" viewBox="0 0 1000 165" preserveAspectRatio="none" style="--extracted-r6o4lv:var(--token-57f08e2a-01d8-4ce0-89a5-f6d5488003ee, rgba(250, 247, 243, 0.1));--framer-link-text-color:rgb(0, 153, 255);--framer-link-text-decoration:underline;width:100vw;max-width:100vw;height:auto;display:block;overflow:hidden;margin-top:40px;position:relative;left:0;bottom:0">
  <text x="0" y="145" textLength="1000" lengthAdjust="spacing" font-family="'Archivo', 'Archivo Placeholder', sans-serif" font-weight="900" font-size="170" fill="var(--token-57f08e2a-01d8-4ce0-89a5-f6d5488003ee, rgba(250, 247, 243, 0.1))" letter-spacing="-0.02em">CYPHER</text>
</svg>
`.trim();

// Replace SVG in index.html
html = html.replace(
  /<svg class="framer-3vb2n7"[^>]*>[\s\S]*?<\/svg>/g,
  cypherSvgMarkup
);

// Save all 3 files
fs.writeFileSync('public/chunks/avatar_chunk.mjs', chunk, 'utf8');
fs.writeFileSync('public/chunks/script_main.mjs', scriptMain, 'utf8');
fs.writeFileSync('index.html', html, 'utf8');

console.log('=== ALL FILES WRITTEN SUCCESSFULLY ===');
