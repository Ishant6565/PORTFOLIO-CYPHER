const fs = require('fs');

console.log('Building public/chunks/blog_chunk.mjs...');

let code = fs.readFileSync('scratch/blog_chunk_original.mjs', 'utf8');

// 1. Prefix relative imports with Framer CDN base URL
const cdnBase = 'https://framerusercontent.com/sites/5OdC8fFdfIksjC0PHuA6WH/';
code = code.replace(/from"\.\//g, `from"${cdnBase}`);
code = code.replace(/from '\.\//g, `from '${cdnBase}`);
code = code.replace(/import\("\.\//g, `import("${cdnBase}`);
code = code.replace(/import\('\.\//g, `import('${cdnBase}`);

// 2. Define ISHANT_BLOG_POSTERS array
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

const postersJson = JSON.stringify(postersData);

// Prepend ISHANT_BLOG_POSTERS
code = `const ISHANT_BLOG_POSTERS = ${postersJson};\n` + code;

// 3. Locate the thoughts container
const startMarker = 'a(`div`,{className:`framer-bv39vk`,children:';
const endMarker = ',a(`div`,{id:`overlay`})';

const startIdx = code.indexOf(startMarker);
const endIdx = code.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('ERROR: markers not found!', { startIdx, endIdx });
  process.exit(1);
}

// Inside framer-bv39vk children, we replace with our clean React mapping
const innerCardsCode = `a(te,{children:ISHANT_BLOG_POSTERS.map(({date:e,title:t,id:n,img:r,desc:i,link:o},s)=>(t??=\`\`,i??=\`\`,o??=\`\`,a(l,{id:\`Fn20Ri3K1-\${n}\`,children:a(ge.Provider,{value:{V1MRCV9ui:o},children:a(ie,{links:[{href:\`javascript:void(0)\`},{href:\`javascript:void(0)\`},{href:\`javascript:void(0)\`}],children:n=>a(y,{breakpoint:x,overrides:{InUaW9Rvc:{width:\`max(min(max(\${m?.width||\`100vw\`} - 40px, 1px), 1080px) - 40px, 50px)\`,y:(m?.y||0)+160+0+0+140+0+248+0+0},roKBWzAFp:{width:\`max((min(max(\${m?.width||\`100vw\`} - 40px, 1px), 900px) - 76px) / 2, 50px)\`,y:(m?.y||0)+160+0+0+160+0+268+0+0}},children:a(de,{height:460,width:\`max((min(max(\${m?.width||\`100vw\`} - 40px, 1px), 1080px) - 32px) / 3, 50px)\`,y:(m?.y||0)+160+0+0+180+0+268+0+0,children:a(M,{animate:V,className:\`framer-khup2v-container\`,\"data-framer-appear-id\":\`khup2v-\${s}\`,initial:H,nodeId:\`PHWVHsDcy\`,optimized:!0,rendersWithMotion:!0,scopeId:\`HpHbG8OLS\`,children:a(y,{breakpoint:x,overrides:{InUaW9Rvc:{u3qjlDHSa:n[2]},roKBWzAFp:{u3qjlDHSa:n[1]}},children:a(O,{bDLUU4atH:e,eq1bfUtHV:t,hDvLDnBDz:i,height:\`100%\`,id:\`PHWVHsDcy\`,layoutId:\`PHWVHsDcy\`,lImbmi2X8:U(r),style:{width:\`100%\`},u3qjlDHSa:n[0],width:\`100%\`})})})})})})})}))})})})})})}`;

// Replace the section between framer-bv39vk children and endMarker
code = code.slice(0, startIdx + startMarker.length) + innerCardsCode + code.slice(endIdx);

// 4. Replace Q.loader to avoid querying external collection
const oldLoaderPattern = /Q\.loader=\{load:\(e,t\)=>\{[\s\S]*?\}\}\},/;
code = code.replace(oldLoaderPattern, 'Q.loader={load:()=>Promise.resolve([])},');

// 5. Change background color if desired, or keep as is
// In original: a(X,{value:`html body { background: rgb(255, 255, 255); }`})
// We can use #faf7f3 to match the entire site aesthetic!
code = code.replace(/background: rgb\(255, 255, 255\);/g, 'background: #faf7f3;');

fs.writeFileSync('public/chunks/blog_chunk.mjs', code, 'utf8');
console.log('Saved public/chunks/blog_chunk.mjs successfully!');
