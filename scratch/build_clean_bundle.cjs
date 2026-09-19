const fs = require('fs');

console.log('=== BUILDING CLEAN BUNDLE FROM PRISTINE CHUNK ===');

// 1. Read the pristine original chunk
let chunk = fs.readFileSync('scratch/original_avatar_chunk.mjs', 'utf8');
let scriptMain = fs.readFileSync('public/chunks/script_main.mjs', 'utf8');
let html = fs.readFileSync('index.html', 'utf8');

console.log('Original chunk loaded, length:', chunk.length);

// -------------------------------------------------------------------------
// STEP 1: Pinterest SVG & Link Replacement
// -------------------------------------------------------------------------
console.log('Step 1: Replacing YouTube with Pinterest...');

// Replace YouTube link with Pinterest profile
const ytLinkOld = 'DH2pKcG5C:`https://www.youtube.com/`';
const ytLinkNew = 'DH2pKcG5C:`https://in.pinterest.com/ishantgupta6094/`';
if (chunk.includes(ytLinkOld)) {
  chunk = chunk.replace(ytLinkOld, ytLinkNew);
  console.log('YouTube link replaced with Pinterest profile link.');
} else {
  console.warn('Warning: ytLinkOld not found in chunk!');
}

// Replace YouTube SVG variable (ht)
// Original ht in pristine chunk:
const ytSvgStart = 'ht=`<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 0.45 1.993';
const ytSvgEnd = 'transform="translate(10 8.536)" width="6px"/></svg>`';
const startPos = chunk.indexOf(ytSvgStart);
const endPos = chunk.indexOf(ytSvgEnd);

if (startPos !== -1 && endPos !== -1) {
  const fullOldHt = chunk.slice(startPos, endPos + ytSvgEnd.length);
  const pinterestSvg = `ht=\`<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 12 2 C 6.48 2 2 6.48 2 12 C 2 16.24 4.65 17.86 6.39 19.29 C 6.3 18.5 6.22 17.29 6.43 16.43 C 6.62 15.66 7.68 11.13 7.68 11.13 C 7.68 11.13 7.36 10.49 7.36 9.55 C 7.36 8.07 8.22 6.97 9.29 6.97 C 10.2 6.97 10.64 7.65 10.64 8.47 C 10.64 9.38 10.06 10.75 9.76 12.02 C 9.51 13.08 10.29 13.95 11.34 13.95 C 13.24 13.95 14.7 11.95 14.7 9.06 C 14.7 6.5 12.86 4.71 10.23 4.71 C 7.18 4.71 5.39 7 5.39 9.36 C 5.39 10.28 5.74 11.27 6.19 11.8 C 6.28 11.91 6.29 12 6.26 12.11 C 6.18 12.44 5.96 13.17 5.92 13.31 C 5.87 13.51 5.76 13.55 5.55 13.46 C 4.17 12.82 3.31 10.81 3.31 9.19 C 3.31 5.72 5.83 2.53 10.59 2.53 C 14.41 2.53 17.38 5.25 17.38 8.89 C 17.38 12.69 14.99 15.74 11.67 15.74 C 10.55 15.74 9.5 15.16 9.14 14.48 L 8.45 17.11 C 8.2 18.07 7.53 19.27 7.08 20 C 8.62 20.65 10.27 21 12 21 C 17.52 21 22 16.52 22 11 C 22 5.48 17.52 2 12 2 Z" fill="transparent" stroke-width="var(--1ww558a, 2)" stroke="var(--4rxgx6, black)" stroke-linecap="round" stroke-linejoin="round"/></svg>\``;
  chunk = chunk.slice(0, startPos) + pinterestSvg + chunk.slice(endPos + ytSvgEnd.length);
  console.log('Pinterest SVG icon replaced cleanly.');
} else {
  console.warn('Warning: YouTube SVG not found in chunk!');
}

// -------------------------------------------------------------------------
// STEP 2: Certificates Section Updates
// -------------------------------------------------------------------------
console.log('Step 2: Updating Certificates Section with Google logo & Coursera courses...');

// Replace all person avatar images with Google logo
const personPhotoUrls = [
  'https://framerusercontent.com/images/yceQCLz3chOtgu2oZRjmfEKjY.png?width=160&height=160',
  'https://framerusercontent.com/images/gN85dqTeMmVvE57UMiHhgeL4P4.png?width=196&height=160',
  'https://framerusercontent.com/images/WsYTUG4cqmLIU4lwbMUQX7FdOY.png?width=160&height=160',
  'https://framerusercontent.com/images/MG7SSqT3AUbDDMeyGynYFWvAWI.png?width=160&height=160'
];

personPhotoUrls.forEach(url => {
  chunk = chunk.replaceAll(url, '/images/google-cert-logo.png');
});

// Update the 4 certificate cards specifically
const certCards = [
  {
    nodeId: 'Awcs6rmjA',
    title: 'Google Data Analytics',
    author: 'Coursera',
    role: 'Professional Certificate'
  },
  {
    nodeId: 'LPDDziUSt',
    title: 'Google IT Automation with Python',
    author: 'Coursera',
    role: 'Professional Certificate'
  },
  {
    nodeId: 'w2ZKyzhGF',
    title: 'Google Advanced Data Analytics',
    author: 'Coursera',
    role: 'Professional Certificate'
  },
  {
    nodeId: 'r7HDjo09x',
    title: 'Google Cybersecurity',
    author: 'Coursera',
    role: 'Professional Certificate'
  }
];

// In Card 1 (Awcs6rmjA), add the image logo and set variant to front face
const card1Old = 'FEOSCD2pf:`Templyo completely changed how I approach building sites in Framer. The templates are not just beautiful, they’re actually structured in a way that makes scaling so much easier.`,height:`100%`,id:`Awcs6rmjA`,imIplavjR:`Yakoub Kashmiri`,layoutId:`Awcs6rmjA`,R9CRr7fB5:`Marketing Director`,style:{width:`100%`},variant:Y(`NQ4gmArur`),width:`100%`}';
const card1New = 'f6H9eFv_s:Q({pixelHeight:160,pixelWidth:160,src:`/images/google-cert-logo.png`},``),FEOSCD2pf:`Google Data Analytics`,height:`100%`,id:`Awcs6rmjA`,imIplavjR:`Coursera`,layoutId:`Awcs6rmjA`,R9CRr7fB5:`Professional Certificate`,style:{width:`100%`},variant:Y(`LxTYbZf1i`),width:`100%`}';

if (chunk.includes(card1Old)) {
  chunk = chunk.replace(card1Old, card1New);
  console.log('Card 1 updated to Google Data Analytics & Coursera.');
} else {
  console.warn('Warning: card1Old not found in chunk!');
}

// In Card 2 (LPDDziUSt)
const card2Old = 'FEOSCD2pf:`I’ve tried dozens of Framer templates, but Templyo stands out. Everything feels intentional, from the layout to the interactions. Saved us a ton of design time.`,height:`100%`,id:`LPDDziUSt`,imIplavjR:`Lili Fox`,layoutId:`LPDDziUSt`,R9CRr7fB5:`Design Lead`,style:{width:`100%`},variant:Y(`LxTYbZf1i`),width:`100%`}';
const card2New = 'FEOSCD2pf:`Google IT Automation with Python`,height:`100%`,id:`LPDDziUSt`,imIplavjR:`Coursera`,layoutId:`LPDDziUSt`,R9CRr7fB5:`Professional Certificate`,style:{width:`100%`},variant:Y(`LxTYbZf1i`),width:`100%`}';

if (chunk.includes(card2Old)) {
  chunk = chunk.replace(card2Old, card2New);
  console.log('Card 2 updated to Google IT Automation with Python.');
} else {
  console.warn('Warning: card2Old not found in chunk!');
}

// In Card 3 (w2ZKyzhGF)
const card3Old = 'FEOSCD2pf:`Templyo saved me weeks of work. I was able to launch my landing page in a day, and it still looks fully custom. Highly recommended for creators.`,height:`100%`,id:`w2ZKyzhGF`,imIplavjR:`Lucas Martin`,layoutId:`w2ZKyzhGF`,R9CRr7fB5:`Founder`,style:{width:`100%`},variant:Y(`LxTYbZf1i`),width:`100%`}';
const card3New = 'FEOSCD2pf:`Google Advanced Data Analytics`,height:`100%`,id:`w2ZKyzhGF`,imIplavjR:`Coursera`,layoutId:`w2ZKyzhGF`,R9CRr7fB5:`Professional Certificate`,style:{width:`100%`},variant:Y(`LxTYbZf1i`),width:`100%`}';

if (chunk.includes(card3Old)) {
  chunk = chunk.replace(card3Old, card3New);
  console.log('Card 3 updated to Google Advanced Data Analytics.');
} else {
  console.warn('Warning: card3Old not found in chunk!');
}

// In Card 4 (r7HDjo09x)
const card4Old = 'FEOSCD2pf:`The quality is insane. Clean structure, smooth animations, and super easy to customize. It feels like a premium studio build right out of the box.`,height:`100%`,id:`r7HDjo09x`,imIplavjR:`Arjun Nair`,layoutId:`r7HDjo09x`,R9CRr7fB5:`Product Designer`,style:{width:`100%`},variant:Y(`LxTYbZf1i`),width:`100%`}';
const card4New = 'FEOSCD2pf:`Google Cybersecurity`,height:`100%`,id:`r7HDjo09x`,imIplavjR:`Coursera`,layoutId:`r7HDjo09x`,R9CRr7fB5:`Professional Certificate`,style:{width:`100%`},variant:Y(`LxTYbZf1i`),width:`100%`}';

if (chunk.includes(card4Old)) {
  chunk = chunk.replace(card4Old, card4New);
  console.log('Card 4 updated to Google Cybersecurity.');
} else {
  console.warn('Warning: card4Old not found in chunk!');
}

// -------------------------------------------------------------------------
// STEP 3: Projects Section & GitHub Project Links
// -------------------------------------------------------------------------
console.log('Step 3: Setting Projects section ID and GitHub project links...');

// Add id="projects" to Projects Section
const projSectionOld = 'l(`section`,{className:`framer-1ut795m`,"data-framer-name":`Projects Section`';
const projSectionNew = 'l(`section`,{className:`framer-1ut795m`,"data-framer-name":`Projects Section`,id:`projects`';

if (chunk.includes(projSectionOld)) {
  chunk = chunk.replace(projSectionOld, projSectionNew);
  console.log('Projects section id="projects" added.');
}

// Define the 6 GitHub projects
const ishantProjects = [
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

// In the original chunk, the project query returns CMS projects.
// Let's see how the project query function vr() is defined:
// Let's find "function vr()" or where vr is defined
const vrMatch = chunk.match(/function\s+vr\(\)\s*\{[^}]*\}/);
if (vrMatch) {
  console.log('Found vr():', vrMatch[0]);
}

// -------------------------------------------------------------------------
// Save chunk & scriptMain
// -------------------------------------------------------------------------
fs.writeFileSync('public/chunks/avatar_chunk.mjs', chunk, 'utf8');
console.log('New avatar_chunk.mjs written, length:', chunk.length);

