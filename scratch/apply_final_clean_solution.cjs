const fs = require('fs');
const esbuild = require('esbuild');

console.log('=== CREATING FINAL PRISTINE SOLUTION ===');

// 1. Read pristine original avatar chunk
let chunk = fs.readFileSync('scratch/original_avatar_chunk.mjs', 'utf8');
let scriptMain = fs.readFileSync('public/chunks/script_main.mjs', 'utf8');
let html = fs.readFileSync('index.html', 'utf8');

console.log('Original chunk size:', chunk.length);

// Fix relative imports so browser fetches from Framer CDN instead of 404ing on localhost
const FRAMER_CDN = 'https://framerusercontent.com/sites/5OdC8fFdfIksjC0PHuA6WH/';
chunk = chunk.replaceAll('from"./', `from"${FRAMER_CDN}`);
chunk = chunk.replaceAll('from "./', `from "${FRAMER_CDN}`);
chunk = chunk.replaceAll('import("./', `import("${FRAMER_CDN}`);
chunk = chunk.replaceAll('import(`./', `import(\`${FRAMER_CDN}`);
console.log('Prefixed all relative imports with Framer CDN URL.');

// -------------------------------------------------------------------------
// 1. PINTEREST REPLACING YOUTUBE
// -------------------------------------------------------------------------
console.log('1. Setting Pinterest link and SVG icon...');
chunk = chunk.replaceAll('https://www.youtube.com/', 'https://in.pinterest.com/ishantgupta6094/');

// Replace YouTube SVG variable ht
const ytSvgStart = 'ht=`<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 0.45 1.993';
const ytSvgEnd = 'transform="translate(10 8.536)" width="6px"/></svg>`';
const startPos = chunk.indexOf(ytSvgStart);
const endPos = chunk.indexOf(ytSvgEnd);

if (startPos !== -1 && endPos !== -1) {
  const pinterestSvg = `ht=\`<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 12 2 C 6.48 2 2 6.48 2 12 C 2 16.24 4.65 17.86 6.39 19.29 C 6.3 18.5 6.22 17.29 6.43 16.43 C 6.62 15.66 7.68 11.13 7.68 11.13 C 7.68 11.13 7.36 10.49 7.36 9.55 C 7.36 8.07 8.22 6.97 9.29 6.97 C 10.2 6.97 10.64 7.65 10.64 8.47 C 10.64 9.38 10.06 10.75 9.76 12.02 C 9.51 13.08 10.29 13.95 11.34 13.95 C 13.24 13.95 14.7 11.95 14.7 9.06 C 14.7 6.5 12.86 4.71 10.23 4.71 C 7.18 4.71 5.39 7 5.39 9.36 C 5.39 10.28 5.74 11.27 6.19 11.8 C 6.28 11.91 6.29 12 6.26 12.11 C 6.18 12.44 5.96 13.17 5.92 13.31 C 5.87 13.51 5.76 13.55 5.55 13.46 C 4.17 12.82 3.31 10.81 3.31 9.19 C 3.31 5.72 5.83 2.53 10.59 2.53 C 14.41 2.53 17.38 5.25 17.38 8.89 C 17.38 12.69 14.99 15.74 11.67 15.74 C 10.55 15.74 9.5 15.16 9.14 14.48 L 8.45 17.11 C 8.2 18.07 7.53 19.27 7.08 20 C 8.62 20.65 10.27 21 12 21 C 17.52 21 22 16.52 22 11 C 22 5.48 17.52 2 12 2 Z" fill="transparent" stroke-width="var(--1ww558a, 2)" stroke="var(--4rxgx6, black)" stroke-linecap="round" stroke-linejoin="round"/></svg>\``;
  chunk = chunk.slice(0, startPos) + pinterestSvg + chunk.slice(endPos + ytSvgEnd.length);
  console.log('Pinterest SVG icon replaced successfully.');
}

// -------------------------------------------------------------------------
// 2. CERTIFICATES: GOOGLE LOGO, COURSERA, CIRCULAR BADGE
// -------------------------------------------------------------------------
console.log('2. Updating Certificates section...');
// Change section heading
chunk = chunk.replaceAll('children:`Testimonials`', 'children:`Licenses & Certifications`');

// Replace all person photos and Framer logos with the Google cert logo
const avatarUrls = [
  'https://framerusercontent.com/images/yceQCLz3chOtgu2oZRjmfEKjY.png?width=160&height=160',
  'https://framerusercontent.com/images/gN85dqTeMmVvE57UMiHhgeL4P4.png?width=196&height=160',
  'https://framerusercontent.com/images/WsYTUG4cqmLIU4lwbMUQX7FdOY.png?width=160&height=160',
  'https://framerusercontent.com/images/MG7SSqT3AUbDDMeyGynYFWvAWI.png?width=160&height=160',
  'https://framerusercontent.com/images/HqoHkPp6dpJFdgMqUKIaAXmy7o.jpg',
  'https://framerusercontent.com/images/Y9KmJAQ4w53hsc4jJojfokLZ7D8.jpg',
  'https://framerusercontent.com/images/HH8KrojyxZx6X20z1r13CSwiiWE.jpg',
  'https://framerusercontent.com/images/kAftuUN9iRKwIt9M6RqZo9NS314.jpg'
];

avatarUrls.forEach(u => {
  let idx = 0;
  while ((idx = chunk.indexOf(u, idx)) !== -1) {
    const qStart = chunk.lastIndexOf('`', idx);
    const qEnd = chunk.indexOf('`', idx);
    if (qStart !== -1 && qEnd !== -1) {
      const fullUrl = chunk.slice(qStart + 1, qEnd);
      chunk = chunk.replaceAll(fullUrl, '/images/google-cert-logo.png');
    } else {
      idx += u.length;
    }
  }
});

// Update the 4 certificate cards specifically
const certUpdates = [
  {
    id: 'Awcs6rmjA',
    title: 'Google Data Analytics',
    brand: 'Coursera',
    role: 'Professional Certificate'
  },
  {
    id: 'LPDDziUSt',
    title: 'Google IT Automation with Python',
    brand: 'Coursera',
    role: 'Professional Certificate'
  },
  {
    id: 'w2ZKyzhGF',
    title: 'Google Advanced Data Analytics',
    brand: 'Coursera',
    role: 'Professional Certificate'
  },
  {
    id: 'r7HDjo09x',
    title: 'Google Cybersecurity',
    brand: 'Coursera',
    role: 'Professional Certificate'
  }
];

certUpdates.forEach(c => {
  const marker = 'id:`' + c.id + '`';
  const pos = chunk.indexOf(marker);
  if (pos !== -1) {
    const cardStart = chunk.lastIndexOf('children:l(q,{', pos);
    const cardEnd = chunk.indexOf('})})})})', pos);
    if (cardStart !== -1 && cardEnd !== -1) {
      let card = chunk.slice(cardStart, cardEnd);
      card = card.replace(/FEOSCD2pf:`[^`]*`/, `FEOSCD2pf:\`${c.title}\``);
      card = card.replace(/imIplavjR:`[^`]*`/, `imIplavjR:\`${c.brand}\``);
      card = card.replace(/R9CRr7fB5:`[^`]*`/, `R9CRr7fB5:\`${c.role}\``);
      card = card.replace(/variant:Y\(`[^`]*`\)/, `variant:Y(\`LxTYbZf1i\`)`);
      if (card.includes('f6H9eFv_s:')) {
        card = card.replace(/f6H9eFv_s:Q\(\{[^}]*\},[^\)]*\)/, `f6H9eFv_s:Q({pixelHeight:160,pixelWidth:160,src:\`/images/google-cert-logo.png\`},\`Google\`)`);
      } else {
        card = card.replace('FEOSCD2pf:', `f6H9eFv_s:Q({pixelHeight:160,pixelWidth:160,src:\`/images/google-cert-logo.png\`},\`Google\`),FEOSCD2pf:`);
      }
      chunk = chunk.slice(0, cardStart) + card + chunk.slice(cardEnd);
      console.log('Card updated cleanly:', c.id, '->', c.title);
    }
  }
});

// -------------------------------------------------------------------------
// 3. PROJECTS SECTION & GITHUB INTEGRATION
// -------------------------------------------------------------------------
console.log('3. Injecting 6 GitHub projects into Projects Section...');

// Add id="projects" to section
chunk = chunk.replace(
  'l(`section`,{className:`framer-1ut795m`,"data-framer-name":`Projects Section`',
  'l(`section`,{className:`framer-1ut795m`,"data-framer-name":`Projects Section`,id:`projects`'
);

const githubProjectsData = [
  {
    id: "proj-1",
    pTZO_oSbE: "AI Career Copilot",
    d2tWDYLdk: "AUTONOMOUS CAREER COCKPIT • Next.js 15",
    vXM6wNGWb: {
      src: "/projects/ai-career-copilot.png",
      srcSet: "/projects/ai-career-copilot.png 1160w",
      pixelWidth: 1160,
      pixelHeight: 800
    },
    iOAqXTIM4: "https://github.com/Ishant6565/AI-Career-Copilot"
  },
  {
    id: "proj-2",
    pTZO_oSbE: "GenAI DevAgent",
    d2tWDYLdk: "MULTI-AGENT LANGGRAPH DAG • Docker",
    vXM6wNGWb: {
      src: "/projects/genai-devagent.png",
      srcSet: "/projects/genai-devagent.png 1160w",
      pixelWidth: 1160,
      pixelHeight: 800
    },
    iOAqXTIM4: "https://github.com/Ishant6565/GenAI-Developer-Agent"
  },
  {
    id: "proj-3",
    pTZO_oSbE: "The Daily Grandmaster",
    d2tWDYLdk: "MINIMAX ALPHA-BETA CHESS ENGINE",
    vXM6wNGWb: {
      src: "/projects/chess-ai.png",
      srcSet: "/projects/chess-ai.png 1160w",
      pixelWidth: 1160,
      pixelHeight: 800
    },
    iOAqXTIM4: "https://github.com/Ishant6565/Chess-AI-Engine"
  },
  {
    id: "proj-4",
    pTZO_oSbE: "Mindloop (Mental Health AI)",
    d2tWDYLdk: "PREDICTIVE ML PROTOTYPE • Random Forest",
    vXM6wNGWb: {
      src: "/projects/mental-health-ml.png",
      srcSet: "/projects/mental-health-ml.png 1160w",
      pixelWidth: 1160,
      pixelHeight: 800
    },
    iOAqXTIM4: "https://github.com/Ishant6565/Mental-Health-Score-ML"
  },
  {
    id: "proj-5",
    pTZO_oSbE: "Spotify Cloud DevOps",
    d2tWDYLdk: "TERRAFORM IAC & AWS AUTOMATION",
    vXM6wNGWb: {
      src: "/projects/spotify-devops.png",
      srcSet: "/projects/spotify-devops.png 1160w",
      pixelWidth: 1160,
      pixelHeight: 800
    },
    iOAqXTIM4: "https://github.com/Ishant6565/Spotify-Terraform-DevOps"
  },
  {
    id: "proj-6",
    pTZO_oSbE: "Stock Analysis Web App",
    d2tWDYLdk: "FINANCIAL API ENGINE • JavaScript",
    vXM6wNGWb: {
      src: "/projects/gamehub.png",
      srcSet: "/projects/gamehub.png 1160w",
      pixelWidth: 1160,
      pixelHeight: 800
    },
    iOAqXTIM4: "https://github.com/Ishant6565/Stock-Market-Analysis"
  }
];

const projDefString = `const ISHANT_CYPHER_PROJECTS = ${JSON.stringify(githubProjectsData)};\n`;
chunk = projDefString + chunk;

// In Projects Section, render ISHANT_CYPHER_PROJECTS and make the card link directly to GitHub
const oldProjectsRender = 'children:l(yr,{query:vr(),children:(e,t,n)=>l(m,{children:e?.map(({d2tWDYLdk:e,id:t,iOAqXTIM4:n,pTZO_oSbE:r,vXM6wNGWb:i},a)=>(r??=``,e??=``,n??=``,l(_,{id:`tJFCEWI5e-${t}`,children:l(ye.Provider,{value:{iOAqXTIM4:n},children:l(S,{links:[{href:{hash:`:L1D8jUzFR`,pathVariables:{iOAqXTIM4:n},webPageId:`mDmuV5aTK`},implicitPathVariables:void 0},{href:{hash:`:L1D8jUzFR`,pathVariables:{iOAqXTIM4:n},webPageId:`mDmuV5aTK`},implicitPathVariables:void 0},{href:{hash:`:L1D8jUzFR`,pathVariables:{iOAqXTIM4:n},webPageId:`mDmuV5aTK`},implicitPathVariables:void 0}]';
const newProjectsRender = 'children:l(yr,{query:vr(),children:(e,t,n)=>l(m,{children:ISHANT_CYPHER_PROJECTS.map(({d2tWDYLdk:e,id:t,iOAqXTIM4:n,pTZO_oSbE:r,vXM6wNGWb:i},a)=>(r??=``,e??=``,n??=``,l(_,{id:`tJFCEWI5e-${t}`,children:l(ye.Provider,{value:{iOAqXTIM4:n},children:l(S,{links:[{href:n,newTab:!0},{href:n,newTab:!0},{href:n,newTab:!0}]';

if (chunk.includes(oldProjectsRender)) {
  chunk = chunk.replace(oldProjectsRender, newProjectsRender);
  console.log('Project cards mapped directly to GitHub links!');
} else {
  console.warn('Warning: oldProjectsRender not found in chunk!');
}

// -------------------------------------------------------------------------
// 4. THOUGHTS SECTION & 8 POSTERS
// -------------------------------------------------------------------------
console.log('4. Updating Thoughts section with 8 graphic design posters...');

const allThoughts = [
  {
    id: "thought-1",
    title: "The Batman: Graphic Noir & Silhouette Form",
    desc: "Deconstructing brutalist typography, heavy rain textures, and cinematic comic framing.",
    date: "Sep 2026",
    img: "/thoughts/batman-rainy.jpg",
    slug: "#thoughts"
  },
  {
    id: "thought-2",
    title: "Jinx (Arcane): Character Dossier & Color Theory",
    desc: "Analyzing neon graffiti layering, dual-tone character psychology, and retro comic dossier art.",
    date: "Sep 2026",
    img: "/thoughts/jinx-arcane.jpg",
    slug: "#thoughts"
  },
  {
    id: "thought-3",
    title: "The Dark Knight: Torn-Paper Collage Aesthetics",
    desc: "Halftone dot rastering, architectural Gotham collage, and high-contrast comic strip layering.",
    date: "Sep 2026",
    img: "/thoughts/dark-knight-collage.jpg",
    slug: "#thoughts"
  },
  {
    id: "thought-4",
    title: "Solo Leveling: Sung Jin-Woo Shadow Monarch",
    desc: "Dynamic webtoon ink linework, commanding silhouette composition, and monochrome aura art.",
    date: "Sep 2026",
    img: "/thoughts/solo-leveling-jinwoo.jpg",
    slug: "#thoughts"
  },
  {
    id: "thought-5",
    title: "Naruto Team 7: Bonds, Nakama & Will of Fire",
    desc: "Iconic monochrome manga typography, raw emotional character linework, and Team 7 tribute.",
    date: "Sep 2026",
    img: "/thoughts/naruto-team-7.jpg",
    slug: "#thoughts"
  },
  {
    id: "thought-6",
    title: "Spider-Man: Into the Spider-Verse (Morales Graffiti)",
    desc: "Bold street graffiti lettering, glitch multiverse chromatic aberration, and electric comic panels.",
    date: "Sep 2026",
    img: "/thoughts/miles-morales-graffiti.jpg",
    slug: "#thoughts"
  },
  {
    id: "thought-7",
    title: "Spider-Man: Miles Morales Comic Cover Collage",
    desc: "Classic comic book cutouts, halftone pulp texture, and dynamic kinetic leap composition.",
    date: "Sep 2026",
    img: "/thoughts/spider-man-collage.jpg",
    slug: "#thoughts"
  },
  {
    id: "thought-8",
    title: "Lana Del Rey: Vintage Cinematic Noir Typography",
    desc: "Soft motion blur portraiture, classic script typography, and monochromatic album aesthetics.",
    date: "Sep 2026",
    img: "/thoughts/lana-del-rey.jpg",
    slug: "#thoughts"
  }
];

const thoughtsDataDef = `const ISHANT_THOUGHTS = ${JSON.stringify(allThoughts.map(t => ({
  id: t.id,
  FLXjmg39N: t.title,
  uHTfXP8yq: t.desc,
  createdAt: "2026-09-15T12:00:00.000Z",
  V1MRCV9ui: t.slug,
  omkZUzufP: {
    src: t.img,
    srcSet: `${t.img} 640w`,
    pixelWidth: 640,
    pixelHeight: 900
  }
})))};\n`;
chunk = thoughtsDataDef + chunk;

// In Thoughts Section, render ISHANT_THOUGHTS
const oldThoughtsRender = 'children:(e,t,n)=>f(m,{children:[e?.map(({createdAt:e,FLXjmg39N:t,id:n,omkZUzufP:r,uHTfXP8yq:i,V1MRCV9ui:a},o)=>(t??=``,i??=``,a??=``,l(_,{id:`UBgblAtbL-${n}`,children:l(ye.Provider,{value:{V1MRCV9ui:a},children:l(S,{links:[{href:{hash:`:SIBntN1fO`,pathVariables:{V1MRCV9ui:a},webPageId:`AyF_zYQaO`},implicitPathVariables:void 0},{href:{hash:`:SIBntN1fO`,pathVariables:{V1MRCV9ui:a},webPageId:`AyF_zYQaO`},implicitPathVariables:void 0},{href:{hash:`:SIBntN1fO`,pathVariables:{V1MRCV9ui:a},webPageId:`AyF_zYQaO`},implicitPathVariables:void 0}]';
const newThoughtsRender = 'children:(e,t,n)=>f(m,{children:[ISHANT_THOUGHTS.map(({createdAt:e,FLXjmg39N:t,id:n,omkZUzufP:r,uHTfXP8yq:i,V1MRCV9ui:a},o)=>(t??=``,i??=``,a??=``,l(_,{id:`UBgblAtbL-${n}`,children:l(ye.Provider,{value:{V1MRCV9ui:a},children:l(S,{links:[{href:`#thoughts`,implicitPathVariables:void 0},{href:`#thoughts`,implicitPathVariables:void 0},{href:`#thoughts`,implicitPathVariables:void 0}]';

if (chunk.includes(oldThoughtsRender)) {
  chunk = chunk.replace(oldThoughtsRender, newThoughtsRender);
  console.log('Thoughts section mapped to all 8 posters!');
} else {
  console.warn('Warning: oldThoughtsRender not found in chunk!');
}

// -------------------------------------------------------------------------
// 5. VALIDATE AVATAR_CHUNK WITH ESBUILD
// -------------------------------------------------------------------------
try {
  esbuild.transformSync(chunk, { loader: 'js' });
  console.log('avatar_chunk.mjs is 100% VALID ES JAVASCRIPT!');
  fs.writeFileSync('public/chunks/avatar_chunk.mjs', chunk, 'utf8');
} catch (e) {
  console.error('FATAL SYNTAX ERROR in avatar_chunk.mjs:', e.message);
  process.exit(1);
}

// -------------------------------------------------------------------------
// 6. VALIDATE SCRIPT_MAIN WITH ESBUILD
// -------------------------------------------------------------------------
// Fix Works nav link to jump to #projects
scriptMain = scriptMain.replaceAll(':TCEKPjkfm', '#projects');
scriptMain = scriptMain.replaceAll('https://cypher-portfolio.framer.website', 'https://cypher-red-iota.vercel.app');

try {
  esbuild.transformSync(scriptMain, { loader: 'js' });
  console.log('script_main.mjs is 100% VALID ES JAVASCRIPT!');
  fs.writeFileSync('public/chunks/script_main.mjs', scriptMain, 'utf8');
} catch (e) {
  console.error('FATAL SYNTAX ERROR in script_main.mjs:', e.message);
  process.exit(1);
}

// -------------------------------------------------------------------------
// 7. CLEAN & UNIFIED INDEX.HTML (CSS + LIGHTBOX + CYPHER)
// -------------------------------------------------------------------------
console.log('7. Finalizing index.html...');

// Remove any prior injected custom styles
html = html.replace(/<style id="custom-portfolio-style"[\s\S]*?<\/style>/g, '');
html = html.replace(/\/\* === Bulletproof Edge-to-Edge CYPHER Watermark === \*\/[\s\S]*?<\/style>/g, '</style>');
html = html.replace(/\/\* === Exact Screenshot 2 Footer Layout[\s\S]*?<\/style>/g, '</style>');
html = html.replace(/\/\* === CYPHER Watermark Touching Absolute Bottom Floor === \*\/[\s\S]*?<\/style>/g, '</style>');
html = html.replace(/\/\* 1\. Google Logo Circular Badges[\s\S]*?<\/style>/g, '</style>');

const unifiedStyles = `
<style id="custom-portfolio-style">
  /* Smooth scroll for navigation */
  html {
    scroll-behavior: smooth !important;
  }

  /* Projects Section Scroll Target */
  #projects,
  [data-framer-name="Projects Section"],
  .framer-1ut795m {
    scroll-margin-top: 80px !important;
  }

  /* 1. Google Circular Badges in Certificates */
  .framer-oiibR .framer-1i87y9p {
    width: 48px !important;
    height: 48px !important;
    min-width: 48px !important;
    min-height: 48px !important;
    border-radius: 50% !important;
    background: #ffffff !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    overflow: hidden !important;
    padding: 3px !important;
    box-sizing: border-box !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
  }

  .framer-oiibR .framer-1i87y9p img {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
    border-radius: 50% !important;
    display: block !important;
  }

  /* 2. Thoughts / Poster Cards Pointer Cursor & Hover Effect */
  .framer-1leqxa3 > *,
  .framer-1leqxa3 [data-framer-name] {
    cursor: pointer !important;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
  .framer-1leqxa3 > *:hover,
  .framer-1leqxa3 [data-framer-name]:hover {
    transform: translateY(-4px) scale(1.015) !important;
  }

  /* 3. CYPHER Watermark: Flush to Absolute Bottom Floor Edge-to-Edge */
  .framer-soKIl.framer-788ly6,
  footer.framer-788ly6 {
    position: relative !important;
    padding-bottom: 220px !important;
    overflow: hidden !important;
  }

  .framer-soKIl .framer-3vb2n7,
  .framer-3vb2n7 {
    display: block !important;
    position: absolute !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    right: auto !important;
    bottom: -10px !important;
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    pointer-events: none !important;
    user-select: none !important;
    z-index: 1 !important;
    line-height: 0 !important;
    opacity: 1 !important;
  }

  .framer-3vb2n7 svg {
    width: 100vw !important;
    max-width: 100vw !important;
    height: auto !important;
    display: block !important;
    overflow: hidden !important;
    margin-bottom: 0 !important;
    vertical-align: bottom !important;
  }
</style>
`;

html = html.replace('</head>', unifiedStyles + '\n</head>');

// Lightbox Modal & Scripts
const lightboxAndHandlers = `
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
    // 1. Poster Lightbox Modal
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

    // Dictionary for poster metadata fallback
    var posterMap = {
      'batman-rainy': { title: 'The Batman: Graphic Noir & Silhouette Form', desc: 'Deconstructing brutalist typography, heavy rain textures, and cinematic comic framing.' },
      'jinx-arcane': { title: 'Jinx (Arcane): Character Dossier & Color Theory', desc: 'Analyzing neon graffiti layering, dual-tone character psychology, and retro comic dossier art.' },
      'dark-knight-collage': { title: 'The Dark Knight: Torn-Paper Collage Aesthetics', desc: 'Halftone dot rastering, architectural Gotham collage, and high-contrast comic strip layering.' },
      'solo-leveling-jinwoo': { title: 'Solo Leveling: Sung Jin-Woo Shadow Monarch', desc: 'Dynamic webtoon ink linework, commanding silhouette composition, and monochrome aura art.' },
      'naruto-team-7': { title: 'Naruto Team 7: Bonds, Nakama & Will of Fire', desc: 'Iconic monochrome manga typography, raw emotional character linework, and Team 7 tribute.' },
      'miles-morales-graffiti': { title: 'Spider-Man: Into the Spider-Verse (Morales Graffiti)', desc: 'Bold street graffiti lettering, glitch multiverse chromatic aberration, and electric comic panels.' },
      'spider-man-collage': { title: 'Spider-Man: Miles Morales Comic Cover Collage', desc: 'Classic comic book cutouts, halftone pulp texture, and dynamic kinetic leap composition.' },
      'lana-del-rey': { title: 'Lana Del Rey: Vintage Cinematic Noir Typography', desc: 'Soft motion blur portraiture, classic script typography, and monochromatic album aesthetics.' }
    };

    // Capture clicks on ANY card in the thoughts / creative art section
    document.addEventListener('click', function(e) {
      var card = e.target.closest('.framer-1leqxa3 > *, .framer-1leqxa3 a, .framer-1leqxa3 [data-framer-name], .framer-1gwykho-container, a[href*="#thoughts"], [data-framer-name="Thoughts Section"] [data-framer-name]');
      if (card && !card.closest('#poster-lightbox')) {
        var img = card.querySelector('img');
        if (img) {
          e.preventDefault();
          e.stopPropagation();
          var src = img.currentSrc || img.getAttribute('src') || '';
          
          var title = '';
          var desc = '';

          // Check poster map first for exact authentic metadata
          for (var key in posterMap) {
            if (src.indexOf(key) !== -1) {
              title = posterMap[key].title;
              desc = posterMap[key].desc;
              break;
            }
          }

          if (!title) {
            var titleEl = card.querySelector('h3, [data-styles-preset="rnettFmGc"] p, .framer-mup09r p, .framer-styles-preset-16w8n5n');
            var descEl = card.querySelector('[data-styles-preset="e4lWfIAXv"] p, .framer-1m6g45b p');
            title = titleEl ? titleEl.textContent.trim() : (img.alt || 'Graphic Design Poster');
            desc = descEl ? descEl.textContent.trim() : '';
          }

          openLightbox(src, title, desc);
        }
      }
    }, true);

    // 2. Works Button Smooth Scroll to Projects
    function scrollToProjects() {
      var el = document.getElementById('projects') || 
               document.querySelector('[data-framer-name="Projects Section"]') ||
               document.querySelector('.framer-1ut795m');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    document.addEventListener('click', function(e) {
      var target = e.target.closest('a, button, [role="button"], .framer-W6IRo, .framer-ek1g9g-container');
      if (target) {
        var text = (target.textContent || target.innerText || '').trim();
        var href = target.getAttribute('href') || '';
        if (text === 'Works' || href.indexOf('#projects') !== -1 || href.indexOf('work') !== -1) {
          e.preventDefault();
          e.stopPropagation();
          scrollToProjects();
        }
      }
    }, true);
  })();
</script>
`;

// Replace existing lightbox if present, or add before </body>
if (html.includes('id="poster-lightbox"')) {
  const lbIndex = html.indexOf('<!-- Fullscreen Poster Lightbox Modal -->');
  const bodyEnd = html.indexOf('</body>');
  html = html.slice(0, lbIndex) + lightboxAndHandlers + '\n</body>';
} else {
  html = html.replace('</body>', lightboxAndHandlers + '\n</body>');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated cleanly.');
console.log('=== ALL COMPLETED SUCCESSFULLY! ===');
