const fs = require('fs');

console.log('--- Applying Blog and Poster Updates ---');

// =========================================================================
// 1. Update public/chunks/script_main.mjs
// =========================================================================
let scriptMain = fs.readFileSync('public/chunks/script_main.mjs', 'utf8');
const oldBlogImport = "import('https://framerusercontent.com/sites/5OdC8fFdfIksjC0PHuA6WH/IkMqf1YcJJ4RbXedRqETkz9Utud6RQTn8RP4tQUjX5U.DERSj9Mw.mjs')";
const newBlogImport = "import('/chunks/blog_chunk.mjs')";

if (scriptMain.includes(oldBlogImport)) {
  scriptMain = scriptMain.replace(oldBlogImport, newBlogImport);
  fs.writeFileSync('public/chunks/script_main.mjs', scriptMain, 'utf8');
  console.log('Updated public/chunks/script_main.mjs successfully');
} else {
  console.log('Note: oldBlogImport not found in script_main, checking for alternatives');
  scriptMain = scriptMain.replace(/import\(['"][^'"]*IkMqf1YcJJ4RbXedRqETkz9Utud6RQTn8RP4tQUjX5U[^'"]*['"]\)/, newBlogImport);
  fs.writeFileSync('public/chunks/script_main.mjs', scriptMain, 'utf8');
}

// =========================================================================
// 2. Update home page teaser card in public/chunks/avatar_chunk.mjs
// =========================================================================
let avatarChunk = fs.readFileSync('public/chunks/avatar_chunk.mjs', 'utf8');

// Replace "See how we shape brands with clarity and craft— explore our blog"
avatarChunk = avatarChunk.replace(
  'See how we shape brands with clarity and craft— explore our blog',
  'Explore our creative gallery of graphic designs, anime posters, and visual experiments.'
);

// Replace button label in that card if it says "View All Work"
avatarChunk = avatarChunk.replace(/loQ5l86x8:`View All Work`,OhdJIzr4k:e\[0\]/, 'loQ5l86x8:`View All Posters`,OhdJIzr4k:e[0]');

fs.writeFileSync('public/chunks/avatar_chunk.mjs', avatarChunk, 'utf8');
console.log('Updated public/chunks/avatar_chunk.mjs successfully');

// =========================================================================
// 3. Build public/chunks/blog_chunk.mjs
// =========================================================================
let blogCode = fs.readFileSync('scratch/blog_chunk_original.mjs', 'utf8');

// Prefix relative imports
const cdnBase = 'https://framerusercontent.com/sites/5OdC8fFdfIksjC0PHuA6WH/';
blogCode = blogCode.replace(/from"\.\//g, `from"${cdnBase}`);
blogCode = blogCode.replace(/from '\.\//g, `from '${cdnBase}`);
blogCode = blogCode.replace(/import\("\.\//g, `import("${cdnBase}`);
blogCode = blogCode.replace(/import\('\.\//g, `import('${cdnBase}`);

// Update header text to suit Ishant's creative profile
blogCode = blogCode.replace(
  'My Brightest Thoughts',
  'Graphic Design & Visual Archives'
);
blogCode = blogCode.replace(
  'Discover ideas, perspectives, and creative thinking shaped by our work in brand identity and art direction. Each article explores how thoughtful design helps brands with clarity and intention.',
  'A curated collection of manga posters, brutalist graphic compositions, and high-contrast digital artworks crafted with precision and passion.'
);

// Define the 5 posters
const postersData = [
  {
    id: "poster-1",
    title: "Itachi Uchiha: Tsukuyomi & The Crimson Moon",
    desc: "Manga ink linework, Akatsuki cloud iconography, and the tragic silhouette of the Uchiha prodigy.",
    date: "Sep 18, 2026",
    link: "javascript:void(0)",
    img: {
      src: "/thoughts/itachi-moon.jpg",
      srcSet: "/thoughts/itachi-moon.jpg 723w",
      pixelWidth: 723,
      pixelHeight: 1024
    }
  },
  {
    id: "poster-2",
    title: "Vi (Arcane): Hextech Brute Force & Zaun Resolve",
    desc: "High-octane red and black brutalist dossier, kinetic boxing stance, and industrial steampunk typography.",
    date: "Sep 18, 2026",
    link: "javascript:void(0)",
    img: {
      src: "/thoughts/vi-strength-arcane.jpg",
      srcSet: "/thoughts/vi-strength-arcane.jpg 736w",
      pixelWidth: 736,
      pixelHeight: 981
    }
  },
  {
    id: "poster-3",
    title: "Resident Evil 4: Biohazard Noir & Rural Gothic Horror",
    desc: "Vintage manga paneling, halftone grit, Las Plagas occult insignia, and cinematic survival-action framing.",
    date: "Sep 18, 2026",
    link: "javascript:void(0)",
    img: {
      src: "/thoughts/resident-evil-4.jpg",
      srcSet: "/thoughts/resident-evil-4.jpg 723w",
      pixelWidth: 723,
      pixelHeight: 1024
    }
  },
  {
    id: "poster-4",
    title: "Arcane: Jinx vs Vi — Two Legends Torn Apart",
    desc: "Split duo-tone comic composition, electric blue graffiti streaks, and visceral Zaun underworld grit.",
    date: "Sep 18, 2026",
    link: "javascript:void(0)",
    img: {
      src: "/thoughts/arcane-jinx-vi.jpg",
      srcSet: "/thoughts/arcane-jinx-vi.jpg 735w",
      pixelWidth: 735,
      pixelHeight: 919
    }
  },
  {
    id: "poster-5",
    title: "Cyberwave: Neon Cybernetics & Dystopian Fiction",
    desc: "Retro-futuristic anime raster portrait, Japanese Kanji grid typography, and cyberpunk terminal aesthetics.",
    date: "Sep 18, 2026",
    link: "javascript:void(0)",
    img: {
      src: "/thoughts/cyberwave-dystopia.jpg",
      srcSet: "/thoughts/cyberwave-dystopia.jpg 736w",
      pixelWidth: 736,
      pixelHeight: 920
    }
  }
];

blogCode = `const ISHANT_BLOG_POSTERS = ${JSON.stringify(postersData)};\n` + blogCode;

// Replace grid items
const startMarker = 'a(`div`,{className:`framer-bv39vk`,children:';
const endMarker = ',a(`div`,{id:`overlay`})';

const sIdx = blogCode.indexOf(startMarker);
const eIdx = blogCode.indexOf(endMarker);

if (sIdx === -1 || eIdx === -1) {
  console.error('Error: grid markers not found', { sIdx, eIdx });
  process.exit(1);
}

const innerCardsCode = `a(te,{children:ISHANT_BLOG_POSTERS.map(({date:e,title:t,id:n,img:r,desc:i,link:o},s)=>(t??=\`\`,i??=\`\`,o??=\`\`,a(l,{id:\`Fn20Ri3K1-\${n}\`,children:a(ge.Provider,{value:{V1MRCV9ui:o},children:a(ie,{links:[{href:\`javascript:void(0)\`},{href:\`javascript:void(0)\`},{href:\`javascript:void(0)\`}],children:n=>a(y,{breakpoint:x,overrides:{InUaW9Rvc:{width:\`max(min(max(\${m?.width||\`100vw\`} - 40px, 1px), 1080px) - 40px, 50px)\`,y:(m?.y||0)+160+0+0+140+0+248+0+0},roKBWzAFp:{width:\`max((min(max(\${m?.width||\`100vw\`} - 40px, 1px), 900px) - 76px) / 2, 50px)\`,y:(m?.y||0)+160+0+0+160+0+268+0+0}},children:a(de,{height:460,width:\`max((min(max(\${m?.width||\`100vw\`} - 40px, 1px), 1080px) - 32px) / 3, 50px)\`,y:(m?.y||0)+160+0+0+180+0+268+0+0,children:a(M,{animate:V,className:\`framer-khup2v-container\`,\"data-framer-appear-id\":\`khup2v-\${s}\`,initial:H,nodeId:\`PHWVHsDcy\`,optimized:!0,rendersWithMotion:!0,scopeId:\`HpHbG8OLS\`,children:a(y,{breakpoint:x,overrides:{InUaW9Rvc:{u3qjlDHSa:n[2]},roKBWzAFp:{u3qjlDHSa:n[1]}},children:a(O,{bDLUU4atH:e,eq1bfUtHV:t,hDvLDnBDz:i,height:\`100%\`,id:\`PHWVHsDcy\`,layoutId:\`PHWVHsDcy\`,lImbmi2X8:U(r),style:{width:\`100%\`},u3qjlDHSa:n[0],width:\`100%\`})})})})})})})}))})})})})})}`;

blogCode = blogCode.slice(0, sIdx + startMarker.length) + innerCardsCode + blogCode.slice(eIdx);

// Disable loader
blogCode = blogCode.replace(/Q\.loader=\{load:\(e,t\)=>\{[\s\S]*?\}\}\},/, 'Q.loader={load:()=>Promise.resolve([])},');

// Harmonize background color
blogCode = blogCode.replace(/background: rgb\(255, 255, 255\);/g, 'background: var(--token-2fcd1089-c4fe-44ec-8e47-1defe3c9bd50, #faf7f3);');

fs.writeFileSync('public/chunks/blog_chunk.mjs', blogCode, 'utf8');
console.log('Saved public/chunks/blog_chunk.mjs successfully');

// =========================================================================
// 4. Update index.html
// =========================================================================
let html = fs.readFileSync('index.html', 'utf8');

// Update import map in index.html
const importMapSnippet = `"/chunks/avatar_chunk.mjs": "/chunks/avatar_chunk.mjs",
    "/chunks/blog_chunk.mjs": "/chunks/blog_chunk.mjs",
    "./IkMqf1YcJJ4RbXedRqETkz9Utud6RQTn8RP4tQUjX5U.DERSj9Mw.mjs": "/chunks/blog_chunk.mjs",
    "https://framerusercontent.com/sites/5OdC8fFdfIksjC0PHuA6WH/IkMqf1YcJJ4RbXedRqETkz9Utud6RQTn8RP4tQUjX5U.DERSj9Mw.mjs": "/chunks/blog_chunk.mjs",`;

if (!html.includes('/chunks/blog_chunk.mjs')) {
  html = html.replace('"/chunks/avatar_chunk.mjs": "/chunks/avatar_chunk.mjs",', importMapSnippet);
}

// Add new posters to posterMap in index.html
const posterMapEntry = `// Blog / Thoughts Posters:
      'itachi-moon': {
        title: 'Itachi Uchiha: Tsukuyomi & The Crimson Moon',
        desc: 'Manga ink linework, Akatsuki cloud iconography, and the tragic silhouette of the Uchiha prodigy.'
      },
      'vi-strength-arcane': {
        title: 'Vi (Arcane): Hextech Brute Force & Zaun Resolve',
        desc: 'High-octane red and black brutalist dossier, kinetic boxing stance, and industrial steampunk typography.'
      },
      'resident-evil-4': {
        title: 'Resident Evil 4: Biohazard Noir & Rural Gothic Horror',
        desc: 'Vintage manga paneling, halftone grit, Las Plagas occult insignia, and cinematic survival-action framing.'
      },
      'arcane-jinx-vi': {
        title: 'Arcane: Jinx vs Vi — Two Legends Torn Apart',
        desc: 'Split duo-tone comic composition, electric blue graffiti streaks, and visceral Zaun underworld grit.'
      },
      'cyberwave-dystopia': {
        title: 'Cyberwave: Neon Cybernetics & Dystopian Fiction',
        desc: 'Retro-futuristic anime raster portrait, Japanese Kanji grid typography, and cyberpunk terminal aesthetics.'
      },
      // Home page posters:`;

if (!html.includes('itachi-moon')) {
  html = html.replace('var posterMap = {', 'var posterMap = {\n      ' + posterMapEntry);
}

// Update card selector to cover blog grid cards as well
html = html.replace(
  "var card = e.target.closest('.framer-1leqxa3 > *') || e.target.closest('.framer-1gwykho-container');",
  "var card = e.target.closest('.framer-1leqxa3 > *') || e.target.closest('.framer-1gwykho-container') || e.target.closest('.framer-bv39vk > *') || e.target.closest('.framer-khup2v-container');"
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated index.html successfully');
console.log('--- Done applying blog & poster updates! ---');
