const fs = require('fs');
const esbuild = require('esbuild');

console.log('=== UPDATING ALL USER REQUESTS (BIO, SERVICES, ARCADEX, GITHUB LOGOS, NO SCROLL JUMP, PINTEREST) ===');

// 1. Read base files
let chunk = fs.readFileSync('scratch/original_avatar_chunk.mjs', 'utf8');
let scriptMain = fs.readFileSync('public/chunks/script_main.mjs', 'utf8');
let html = fs.readFileSync('index.html', 'utf8');

// Fix CDN prefix so nothing 404s
const FRAMER_CDN = 'https://framerusercontent.com/sites/5OdC8fFdfIksjC0PHuA6WH/';
chunk = chunk.replaceAll('from"./', `from"${FRAMER_CDN}`);
chunk = chunk.replaceAll('from "./', `from "${FRAMER_CDN}`);
chunk = chunk.replaceAll('import("./', `import("${FRAMER_CDN}`);
chunk = chunk.replaceAll('import(`./', `import(\`${FRAMER_CDN}`);

// =========================================================================
// 1. AUTHENTIC PINTEREST SVG ICON
// =========================================================================
console.log('1. Setting authentic, official Pinterest vector logo...');
chunk = chunk.replaceAll('https://www.youtube.com/', 'https://in.pinterest.com/ishantgupta6094/');
html = html.replaceAll('https://www.youtube.com/', 'https://in.pinterest.com/ishantgupta6094/');

// Replace YouTube SVG variable ht in avatar_chunk with authentic Pinterest badge
const ytSvgStart = 'ht=`<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 0.45 1.993';
const ytSvgEnd = 'transform="translate(10 8.536)" width="6px"/></svg>`';
const startPos = chunk.indexOf(ytSvgStart);
const endPos = chunk.indexOf(ytSvgEnd);

// Authentic, high-precision Pinterest vector path
const authenticPinterestSvg = `ht=\`<svg display="block" role="presentation" viewBox="0 0 24 24" fill="var(--4rxgx6, currentColor)" xmlns="http://www.w3.org/2000/svg"><path d="M12 0a12 12 0 0 0-4.37 23.18c-.05-.95-.1-2.42.02-3.46l1.32-5.6s-.34-.67-.34-1.66c0-1.56.9-2.72 2.03-2.72.96 0 1.42.72 1.42 1.58 0 .96-.61 2.4-1 3.73-.26 1.12.56 2.03 1.66 2.03 2 0 3.53-2.1 3.53-5.14 0-2.69-1.93-4.57-4.69-4.57-3.2 0-5.07 2.4-5.07 4.88 0 .96.37 2 1.03 2.56.09.11.1.2.08.35l-.31 1.28c-.05.2-.16.25-.38.15-1.4-.65-2.28-2.7-2.28-4.34 0-3.54 2.57-6.79 7.41-6.79 3.89 0 6.92 2.77 6.92 6.48 0 3.86-2.44 6.97-5.82 6.97-1.14 0-2.2-.6-2.57-1.3l-.7 2.66c-.25.98-.93 2.2-1.39 2.95A12 12 0 1 0 12 0z"/></svg>\``;

if (startPos !== -1 && endPos !== -1) {
  chunk = chunk.slice(0, startPos) + authenticPinterestSvg + chunk.slice(endPos + ytSvgEnd.length);
}

// In index.html static svg:
const oldStaticSvgRegex = /<svg id="832930135"[\s\S]*?<\/svg>/;
html = html.replace(oldStaticSvgRegex, '<svg id="832930135" display="block" role="presentation" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0a12 12 0 0 0-4.37 23.18c-.05-.95-.1-2.42.02-3.46l1.32-5.6s-.34-.67-.34-1.66c0-1.56.9-2.72 2.03-2.72.96 0 1.42.72 1.42 1.58 0 .96-.61 2.4-1 3.73-.26 1.12.56 2.03 1.66 2.03 2 0 3.53-2.1 3.53-5.14 0-2.69-1.93-4.57-4.69-4.57-3.2 0-5.07 2.4-5.07 4.88 0 .96.37 2 1.03 2.56.09.11.1.2.08.35l-.31 1.28c-.05.2-.16.25-.38.15-1.4-.65-2.28-2.7-2.28-4.34 0-3.54 2.57-6.79 7.41-6.79 3.89 0 6.92 2.77 6.92 6.48 0 3.86-2.44 6.97-5.82 6.97-1.14 0-2.2-.6-2.57-1.3l-.7 2.66c-.25.98-.93 2.2-1.39 2.95A12 12 0 1 0 12 0z"/></svg>');

// =========================================================================
// 2. HERO, BIO & ISHANT PERSONAL DETAILS
// =========================================================================
console.log('2. Restoring Ishant personal bio details & CREATING SINCE 2026...');

// 4th request: /CREATING SINCE 2026
chunk = chunk.replaceAll('/CREATING SINCE 2020', '/CREATING SINCE 2026');
chunk = chunk.replaceAll('/CREATING SINCE 2022', '/CREATING SINCE 2026');
html = html.replaceAll('/CREATING SINCE 2020', '/CREATING SINCE 2026');
html = html.replaceAll('/CREATING SINCE 2022', '/CREATING SINCE 2026');

// Bio intro
const originalIntro = 'I’m Majd, a builder based in Syria, currently working on Templyo, a platform for high-quality Framer templates.';
const ishantIntro = 'I’m Ishant, an engineer based in Kolkata, India, crafting intelligent systems, multi-agent AI, and high-performance web experiences.';
chunk = chunk.replaceAll(originalIntro, ishantIntro);
html = html.replaceAll(originalIntro, ishantIntro);

// Bio paragraphs
const originalP1 = 'I’m a software engineer and Framer creator with a strong focus on building modern, scalable, and conversion-driven web experiences.';
const ishantP1 = 'I’m a software engineer and AI builder with a strong focus on crafting intelligent multi-agent systems, scalable web apps, and data architectures.';
chunk = chunk.replaceAll(originalP1, ishantP1);
html = html.replaceAll(originalP1, ishantP1);

const originalP2 = 'Over the years, I’ve created and shipped multiple SaaS products and Framer templates used by global customers, helping them launch faster.';
const ishantP2 = 'Over the years, I’ve engineered full-stack platforms, predictive ML pipelines, and DevOps workflows, turning complex data into seamless user products.';
chunk = chunk.replaceAll(originalP2, ishantP2);
html = html.replaceAll(originalP2, ishantP2);

// Quote section
const originalQuote = 'From idea to launch. Clean, scalable digital products built to move fast, stay simple, and perform in real-world use, driven by clarity, structured systems, and intentional design.';
const ishantQuote = 'Bridging software engineering and data analytics to solve real-world problems. Clean code, structured database design, and intuitive user interfaces built for modern scale.';
chunk = chunk.replaceAll(originalQuote, ishantQuote);
html = html.replaceAll(originalQuote, ishantQuote);

// =========================================================================
// 3. SERVICES SECTION RESTORATION
// =========================================================================
console.log('3. Restoring Ishant custom services (Full-Stack, AI & Data, Cloud/DevOps, Digital Art)...');

// Card 1: Full-Stack Engineering
chunk = chunk.replaceAll('UzVzIR5Q8:`Website Migration`', 'UzVzIR5Q8:`Full-Stack Engineering`');
chunk = chunk.replaceAll('IzreI8lrP:`Web Migration`', 'IzreI8lrP:`React & Next.js`');
chunk = chunk.replaceAll('QdLpP1h83:`Optimization`', 'QdLpP1h83:`FastAPI & Node`');
chunk = chunk.replaceAll('F2jZW6zTp:`CMS Rebuild`', 'F2jZW6zTp:`Scalable Systems`');

// Card 2: AI & Data Intelligence
chunk = chunk.replaceAll('UzVzIR5Q8:`Framer Templates`', 'UzVzIR5Q8:`AI & Data Intelligence`');
chunk = chunk.replaceAll('IzreI8lrP:`Startup`', 'IzreI8lrP:`LangGraph Agents`');
chunk = chunk.replaceAll('QdLpP1h83:`Agency`', 'QdLpP1h83:`ML Models`');
chunk = chunk.replaceAll('F2jZW6zTp:`SaaS`', 'F2jZW6zTp:`Predictive Pipelines`');

// Card 3: Cloud, DevOps & IaC
chunk = chunk.replaceAll('UzVzIR5Q8:`Frontend Development`', 'UzVzIR5Q8:`Cloud, DevOps & IaC`');
chunk = chunk.replaceAll('IzreI8lrP:`UI Dev`', 'IzreI8lrP:`Docker & CI/CD`');
chunk = chunk.replaceAll('QdLpP1h83:`Responsive Layouts`', 'QdLpP1h83:`AWS & Terraform`');
chunk = chunk.replaceAll('F2jZW6zTp:`Web Performance`', 'F2jZW6zTp:`Cloud Architecture`');

// Card 4: Digital Art & Creative Design
chunk = chunk.replaceAll('UzVzIR5Q8:`Product Consulting`', 'UzVzIR5Q8:`Digital Art & Creative Design`');
chunk = chunk.replaceAll('IzreI8lrP:`Product Direction`', 'IzreI8lrP:`Manga & Sketch Art`');
chunk = chunk.replaceAll('QdLpP1h83:`Web Strategy`', 'QdLpP1h83:`UI/UX Visuals`');
chunk = chunk.replaceAll('F2jZW6zTp:`Technical Guidance`', 'F2jZW6zTp:`Brand Aesthetics`');

// Also update SSR in index.html
html = html.replaceAll('Website Migration', 'Full-Stack Engineering');
html = html.replaceAll('Web Migration', 'React & Next.js');
html = html.replaceAll('Optimization', 'FastAPI & Node');
html = html.replaceAll('CMS Rebuild', 'Scalable Systems');

html = html.replaceAll('Framer Templates', 'AI & Data Intelligence');
html = html.replaceAll('Startup', 'LangGraph Agents');
html = html.replaceAll('Agency', 'ML Models');
html = html.replaceAll('SaaS', 'Predictive Pipelines');

html = html.replaceAll('Frontend Development', 'Cloud, DevOps & IaC');
html = html.replaceAll('UI Dev', 'Docker & CI/CD');
html = html.replaceAll('Responsive Layouts', 'AWS & Terraform');
html = html.replaceAll('Web Performance', 'Cloud Architecture');

html = html.replaceAll('Product Consulting', 'Digital Art & Creative Design');
html = html.replaceAll('Product Direction', 'Manga & Sketch Art');
html = html.replaceAll('Web Strategy', 'UI/UX Visuals');
html = html.replaceAll('Technical Guidance', 'Brand Aesthetics');

// =========================================================================
// 4. CERTIFICATES SECTION (CIRCULAR GOOGLE LOGO & COURSERA)
// =========================================================================
console.log('4. Configuring Certificates with circular Google logo & Coursera...');
chunk = chunk.replaceAll('children:`Testimonials`', 'children:`Licenses & Certifications`');
html = html.replaceAll('Testimonials', 'Licenses & Certifications');

// Replace all testimonial card avatars with google-cert-logo.png
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
    }
  }
});

// =========================================================================
// 5. PROJECTS SECTION: REPLACE SPOTIFY WITH ARCADEX & GITHUB LOGOS
// =========================================================================
console.log('5. Replacing Spotify with ARCADEX and preparing GitHub icon integration...');

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
    pTZO_oSbE: "ARCADEX",
    d2tWDYLdk: "RETRO & MODERN ARCADE HUB • Next.js & React",
    vXM6wNGWb: {
      src: "/projects/arcadex.png",
      srcSet: "/projects/arcadex.png 1160w",
      pixelWidth: 1160,
      pixelHeight: 800
    },
    iOAqXTIM4: "https://github.com/Ishant6565/ARCADEX.git"
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

// Map projects to render ISHANT_CYPHER_PROJECTS and attach GitHub links
const oldProjectsRender = 'children:l(yr,{query:vr(),children:(e,t,n)=>l(m,{children:e?.map(({d2tWDYLdk:e,id:t,iOAqXTIM4:n,pTZO_oSbE:r,vXM6wNGWb:i},a)=>(r??=``,e??=``,n??=``,l(_,{id:`tJFCEWI5e-${t}`,children:l(ye.Provider,{value:{iOAqXTIM4:n},children:l(S,{links:[{href:{hash:`:L1D8jUzFR`,pathVariables:{iOAqXTIM4:n},webPageId:`mDmuV5aTK`},implicitPathVariables:void 0},{href:{hash:`:L1D8jUzFR`,pathVariables:{iOAqXTIM4:n},webPageId:`mDmuV5aTK`},implicitPathVariables:void 0},{href:{hash:`:L1D8jUzFR`,pathVariables:{iOAqXTIM4:n},webPageId:`mDmuV5aTK`},implicitPathVariables:void 0}]';
const newProjectsRender = 'children:l(yr,{query:vr(),children:(e,t,n)=>l(m,{children:ISHANT_CYPHER_PROJECTS.map(({d2tWDYLdk:e,id:t,iOAqXTIM4:n,pTZO_oSbE:r,vXM6wNGWb:i},a)=>(r??=``,e??=``,n??=``,l(_,{id:`tJFCEWI5e-${t}`,children:l(ye.Provider,{value:{iOAqXTIM4:n},children:l(S,{links:[{href:n,newTab:!0},{href:n,newTab:!0},{href:n,newTab:!0}]';
chunk = chunk.replace(oldProjectsRender, newProjectsRender);

// =========================================================================
// 6. THOUGHTS SECTION: 8 POSTERS WITHOUT HASH NAVIGATION
// =========================================================================
console.log('6. Configuring 8 Graphic Design posters without jumpy hash...');

const allThoughts = [
  {
    id: "thought-1",
    title: "The Batman: Graphic Noir & Silhouette Form",
    desc: "Deconstructing brutalist typography, heavy rain textures, and cinematic comic framing.",
    date: "Sep 2026",
    img: "/thoughts/batman-rainy.jpg",
    slug: "javascript:void(0)"
  },
  {
    id: "thought-2",
    title: "Jinx (Arcane): Character Dossier & Color Theory",
    desc: "Analyzing neon graffiti layering, dual-tone character psychology, and retro comic dossier art.",
    date: "Sep 2026",
    img: "/thoughts/jinx-arcane.jpg",
    slug: "javascript:void(0)"
  },
  {
    id: "thought-3",
    title: "The Dark Knight: Torn-Paper Collage Aesthetics",
    desc: "Halftone dot rastering, architectural Gotham collage, and high-contrast comic strip layering.",
    date: "Sep 2026",
    img: "/thoughts/dark-knight-collage.jpg",
    slug: "javascript:void(0)"
  },
  {
    id: "thought-4",
    title: "Solo Leveling: Sung Jin-Woo Shadow Monarch",
    desc: "Dynamic webtoon ink linework, commanding silhouette composition, and monochrome aura art.",
    date: "Sep 2026",
    img: "/thoughts/solo-leveling-jinwoo.jpg",
    slug: "javascript:void(0)"
  },
  {
    id: "thought-5",
    title: "Naruto Team 7: Bonds, Nakama & Will of Fire",
    desc: "Iconic monochrome manga typography, raw emotional character linework, and Team 7 tribute.",
    date: "Sep 2026",
    img: "/thoughts/naruto-team-7.jpg",
    slug: "javascript:void(0)"
  },
  {
    id: "thought-6",
    title: "Spider-Man: Into the Spider-Verse (Morales Graffiti)",
    desc: "Bold street graffiti lettering, glitch multiverse chromatic aberration, and electric comic panels.",
    date: "Sep 2026",
    img: "/thoughts/miles-morales-graffiti.jpg",
    slug: "javascript:void(0)"
  },
  {
    id: "thought-7",
    title: "Spider-Man: Miles Morales Comic Cover Collage",
    desc: "Classic comic book cutouts, halftone pulp texture, and dynamic kinetic leap composition.",
    date: "Sep 2026",
    img: "/thoughts/spider-man-collage.jpg",
    slug: "javascript:void(0)"
  },
  {
    id: "thought-8",
    title: "Lana Del Rey: Vintage Cinematic Noir Typography",
    desc: "Soft motion blur portraiture, classic script typography, and monochromatic album aesthetics.",
    date: "Sep 2026",
    img: "/thoughts/lana-del-rey.jpg",
    slug: "javascript:void(0)"
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

// In Thoughts Section, map to ISHANT_THOUGHTS and use null links so browser never jumps
const oldThoughtsRender = 'children:(e,t,n)=>f(m,{children:[e?.map(({createdAt:e,FLXjmg39N:t,id:n,omkZUzufP:r,uHTfXP8yq:i,V1MRCV9ui:a},o)=>(t??=``,i??=``,a??=``,l(_,{id:`UBgblAtbL-${n}`,children:l(ye.Provider,{value:{V1MRCV9ui:a},children:l(S,{links:[{href:{hash:`:SIBntN1fO`,pathVariables:{V1MRCV9ui:a},webPageId:`AyF_zYQaO`},implicitPathVariables:void 0},{href:{hash:`:SIBntN1fO`,pathVariables:{V1MRCV9ui:a},webPageId:`AyF_zYQaO`},implicitPathVariables:void 0},{href:{hash:`:SIBntN1fO`,pathVariables:{V1MRCV9ui:a},webPageId:`AyF_zYQaO`},implicitPathVariables:void 0}]';
const newThoughtsRender = 'children:(e,t,n)=>f(m,{children:[ISHANT_THOUGHTS.map(({createdAt:e,FLXjmg39N:t,id:n,omkZUzufP:r,uHTfXP8yq:i,V1MRCV9ui:a},o)=>(t??=``,i??=``,a??=``,l(_,{id:`UBgblAtbL-${n}`,children:l(ye.Provider,{value:{V1MRCV9ui:a},children:l(S,{links:[{href:`javascript:void(0)`,implicitPathVariables:void 0},{href:`javascript:void(0)`,implicitPathVariables:void 0},{href:`javascript:void(0)`,implicitPathVariables:void 0}]';
chunk = chunk.replace(oldThoughtsRender, newThoughtsRender);

// Validate with esbuild
esbuild.transformSync(chunk, { loader: 'js' });
fs.writeFileSync('public/chunks/avatar_chunk.mjs', chunk, 'utf8');
console.log('public/chunks/avatar_chunk.mjs updated and verified!');

// =========================================================================
// 7. SCRIPT_MAIN UPDATES
// =========================================================================
scriptMain = scriptMain.replaceAll(':TCEKPjkfm', '#projects');
scriptMain = scriptMain.replaceAll('https://majd-portfolio.framer.website', 'https://cypher-red-iota.vercel.app');
esbuild.transformSync(scriptMain, { loader: 'js' });
fs.writeFileSync('public/chunks/script_main.mjs', scriptMain, 'utf8');

// =========================================================================
// 8. INDEX.HTML: CSS, GITHUB ICONS ON TITLE, ZERO-SCROLL LIGHTBOX
// =========================================================================
console.log('8. Updating index.html with GitHub project logos, zero-scroll lightbox, circular Google logo...');

// Clean existing custom styles & scripts
html = html.replace(/<style id="custom-portfolio-style"[\s\S]*?<\/style>/g, '');

const masterStyles = `
<style id="custom-portfolio-style">
  html {
    scroll-behavior: smooth !important;
  }

  /* Projects Section Scroll Offset */
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

  /* 2. Thoughts / Poster Cards Cursor */
  .framer-1leqxa3 > *,
  .framer-1leqxa3 [data-framer-name],
  .framer-1leqxa3 a {
    cursor: pointer !important;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
  .framer-1leqxa3 > *:hover,
  .framer-1leqxa3 [data-framer-name]:hover {
    transform: translateY(-4px) scale(1.015) !important;
  }

  /* 3. GitHub Icon Badge Next to Project Titles */
  .project-title-wrapper {
    display: inline-flex !important;
    align-items: center !important;
    gap: 8px !important;
    flex-wrap: wrap !important;
  }

  .project-github-icon-link {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: rgba(250, 247, 243, 0.65) !important;
    transition: all 0.2s ease !important;
    vertical-align: middle !important;
    margin-left: 8px !important;
    padding: 2px !important;
    border-radius: 4px !important;
    background: rgba(255, 255, 255, 0.06) !important;
  }

  .project-github-icon-link:hover {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.18) !important;
    transform: scale(1.18) !important;
  }

  /* 4. CYPHER Watermark: Flush to Floor Edge-to-Edge */
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

html = html.replace('</head>', masterStyles + '\n</head>');

// Zero-scroll Jump Lightbox and Project GitHub Injection Script
const clientScripts = `
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
    // -----------------------------------------------------------------------
    // 1. Poster Lightbox Modal (ZERO SCROLL JUMP)
    // -----------------------------------------------------------------------
    var lightbox = document.getElementById('poster-lightbox');
    var lbImg = document.getElementById('lightbox-img');
    var lbTitle = document.getElementById('lightbox-title');
    var lbDesc = document.getElementById('lightbox-desc');
    var lbClose = document.getElementById('lightbox-close');

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

    function openLightbox(src, title, desc) {
      if (!lightbox) return;
      lbImg.src = src;
      lbTitle.textContent = title || '';
      lbDesc.textContent = desc || '';
      lightbox.style.display = 'flex';
      setTimeout(function() {
        lightbox.style.opacity = '1';
      }, 10);
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.style.opacity = '0';
      setTimeout(function() {
        lightbox.style.display = 'none';
        lbImg.src = '';
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

    // Capture clicks on ANY card in thoughts section (image OR caption)
    document.addEventListener('click', function(e) {
      var card = e.target.closest('.framer-1leqxa3 > *, .framer-1leqxa3 a, .framer-1leqxa3 [data-framer-name], .framer-1gwykho-container, [data-framer-name="Thoughts Section"] [data-framer-name]');
      if (card && !card.closest('#poster-lightbox')) {
        var img = card.querySelector('img');
        if (img) {
          // CRITICAL: Stop all bubbling and default hash jump immediately!
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          var src = img.currentSrc || img.getAttribute('src') || '';
          var title = '';
          var desc = '';

          for (var key in posterMap) {
            if (src.indexOf(key) !== -1) {
              title = posterMap[key].title;
              desc = posterMap[key].desc;
              break;
            }
          }

          if (!title) {
            var titleEl = card.querySelector('h3, [data-styles-preset="rnettFmGc"] p, .framer-mup09r p');
            var descEl = card.querySelector('[data-styles-preset="e4lWfIAXv"] p, .framer-1m6g45b p');
            title = titleEl ? titleEl.textContent.trim() : (img.alt || 'Graphic Design Poster');
            desc = descEl ? descEl.textContent.trim() : '';
          }

          openLightbox(src, title, desc);
          return false;
        }
      }
    }, true);

    // -----------------------------------------------------------------------
    // 2. Project Card GitHub Icon Next to Titles
    // -----------------------------------------------------------------------
    var githubSvgIcon = '<svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor" style="display:block;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';

    var projectRepoMap = {
      'AI Career Copilot': 'https://github.com/Ishant6565/AI-Career-Copilot',
      'GenAI DevAgent': 'https://github.com/Ishant6565/GenAI-Developer-Agent',
      'The Daily Grandmaster': 'https://github.com/Ishant6565/Chess-AI-Engine',
      'Mindloop (Mental Health AI)': 'https://github.com/Ishant6565/Mental-Health-Score-ML',
      'Mental Health Signal': 'https://github.com/Ishant6565/Mental-Health-Score-ML',
      'ARCADEX': 'https://github.com/Ishant6565/ARCADEX.git',
      'Stock Analysis Web App': 'https://github.com/Ishant6565/Stock-Market-Analysis'
    };

    function attachGithubLogos() {
      var titleHeaders = document.querySelectorAll('.framer-1a1g2uv h3, .framer-v4eg3f h3');
      titleHeaders.forEach(function(h3) {
        if (h3.querySelector('.project-github-icon-link')) return;
        var text = h3.textContent.trim();
        var repoUrl = '';
        for (var key in projectRepoMap) {
          if (text.indexOf(key) !== -1 || key.indexOf(text) !== -1) {
            repoUrl = projectRepoMap[key];
            break;
          }
        }
        if (!repoUrl) {
          var cardLink = h3.closest('a');
          if (cardLink && cardLink.href && cardLink.href.includes('github.com')) {
            repoUrl = cardLink.href;
          }
        }
        if (repoUrl) {
          var ghLink = document.createElement('a');
          ghLink.href = repoUrl;
          ghLink.target = '_blank';
          ghLink.rel = 'noopener noreferrer';
          ghLink.className = 'project-github-icon-link';
          ghLink.title = 'View Source Code on GitHub';
          ghLink.innerHTML = githubSvgIcon;
          ghLink.addEventListener('click', function(evt) {
            evt.stopPropagation();
          });
          h3.style.display = 'inline-flex';
          h3.style.alignItems = 'center';
          h3.appendChild(ghLink);
        }
      });
    }

    // Attach now and on mutation
    attachGithubLogos();
    var observer = new MutationObserver(attachGithubLogos);
    observer.observe(document.body, { childList: true, subtree: true });

    // -----------------------------------------------------------------------
    // 3. Works Nav Button Smooth Scroll
    // -----------------------------------------------------------------------
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
      if (target && !target.closest('.project-github-icon-link')) {
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

if (html.includes('id="poster-lightbox"')) {
  const lbIndex = html.indexOf('<!-- Fullscreen Poster Lightbox Modal -->');
  html = html.slice(0, lbIndex) + clientScripts + '\n</body>';
} else {
  html = html.replace('</body>', clientScripts + '\n</body>');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated successfully.');
console.log('=== ALL 6 REQUIREMENTS APPLIED! ===');
