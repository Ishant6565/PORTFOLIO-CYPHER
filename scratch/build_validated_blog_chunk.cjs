const fs = require('fs');
const esbuild = require('esbuild');

console.log('Building and validating blog_chunk.mjs...');

let orig = fs.readFileSync('scratch/blog_chunk_original.mjs', 'utf8');

// 1. Prefix relative imports with Framer CDN
const cdnBase = 'https://framerusercontent.com/sites/5OdC8fFdfIksjC0PHuA6WH/';
orig = orig.replace(/from"\.\//g, 'from"' + cdnBase);
orig = orig.replace(/from '\.\//g, "from '" + cdnBase);
orig = orig.replace(/import\("\.\//g, 'import("' + cdnBase);
orig = orig.replace(/import\('\.\//g, "import('" + cdnBase);

// 2. Posters array (all 15 posters)
const postersData = [
  {
    id: 'poster-1',
    title: 'Itachi Uchiha: Tsukuyomi & The Crimson Moon',
    desc: 'Manga ink linework, Akatsuki cloud iconography, and the tragic silhouette of the Uchiha prodigy under the moon.',
    date: 'Sep 18, 2026',
    link: 'javascript:void(0)',
    img: {
      src: '/thoughts/itachi-moon.jpg',
      srcSet: '/thoughts/itachi-moon.jpg 723w',
      pixelWidth: 723,
      pixelHeight: 1024
    }
  },
  {
    id: 'poster-2',
    title: 'Vi (Arcane): Hextech Brute Force & Zaun Resolve',
    desc: 'High-octane red and black brutalist dossier, kinetic boxing stance, and industrial steampunk typography.',
    date: 'Sep 18, 2026',
    link: 'javascript:void(0)',
    img: {
      src: '/thoughts/vi-strength-arcane.jpg',
      srcSet: '/thoughts/vi-strength-arcane.jpg 736w',
      pixelWidth: 736,
      pixelHeight: 981
    }
  },
  {
    id: 'poster-3',
    title: 'Resident Evil 4: Biohazard Noir & Rural Gothic Horror',
    desc: 'Vintage manga paneling, halftone grit, Las Plagas occult insignia, and cinematic survival-action framing.',
    date: 'Sep 18, 2026',
    link: 'javascript:void(0)',
    img: {
      src: '/thoughts/resident-evil-4.jpg',
      srcSet: '/thoughts/resident-evil-4.jpg 723w',
      pixelWidth: 723,
      pixelHeight: 1024
    }
  },
  {
    id: 'poster-4',
    title: 'Arcane: Jinx vs Vi — Two Legends Torn Apart',
    desc: 'Split duo-tone comic composition, electric blue graffiti streaks, and visceral Zaun underworld grit.',
    date: 'Sep 18, 2026',
    link: 'javascript:void(0)',
    img: {
      src: '/thoughts/arcane-jinx-vi.jpg',
      srcSet: '/thoughts/arcane-jinx-vi.jpg 735w',
      pixelWidth: 735,
      pixelHeight: 919
    }
  },
  {
    id: 'poster-5',
    title: 'Cyberwave: Neon Cybernetics & Dystopian Fiction',
    desc: 'Retro-futuristic anime raster portrait, Japanese Kanji grid typography, and cyberpunk terminal aesthetics.',
    date: 'Sep 18, 2026',
    link: 'javascript:void(0)',
    img: {
      src: '/thoughts/cyberwave-dystopia.jpg',
      srcSet: '/thoughts/cyberwave-dystopia.jpg 736w',
      pixelWidth: 736,
      pixelHeight: 920
    }
  },
  {
    id: 'poster-6',
    title: 'Gengar: Shadow Pokémon & Retro Cyber Grid',
    desc: 'Shadow Pokémon #0094 grinning against a retro wireframe horizon and moonlit cityscape in high-contrast monochrome.',
    date: 'Sep 19, 2026',
    link: 'javascript:void(0)',
    img: {
      src: '/thoughts/gengar-shadow.jpg',
      srcSet: '/thoughts/gengar-shadow.jpg 576w',
      pixelWidth: 576,
      pixelHeight: 1024
    }
  },
  {
    id: 'poster-7',
    title: 'Choso: A Pintura Da Morte (Jujutsu Kaisen)',
    desc: 'Brutalist red-on-black composition, Death Painting Womb blood manipulation, and protective older brother resolve.',
    date: 'Sep 19, 2026',
    link: 'javascript:void(0)',
    img: {
      src: '/thoughts/choso-death-painting.jpg',
      srcSet: '/thoughts/choso-death-painting.jpg 724w',
      pixelWidth: 724,
      pixelHeight: 1024
    }
  },
  {
    id: 'poster-8',
    title: 'Maomao & Jinshi: The Apothecary Diaries',
    desc: 'Deep magenta and noir elegance, imperial palace intrigue, medical deduction, and subtle character chemistry.',
    date: 'Sep 19, 2026',
    link: 'javascript:void(0)',
    img: {
      src: '/thoughts/maomao-jinshi-apothecary.jpg',
      srcSet: '/thoughts/maomao-jinshi-apothecary.jpg 681w',
      pixelWidth: 681,
      pixelHeight: 1024
    }
  },
  {
    id: 'poster-9',
    title: 'Uchiha Madara: The Ghost of the Uchiha',
    desc: 'Manga panel collage of Edo Tensei Madara, Rinnegan awakening, and the sheer overwhelming power of the legendary shinobi.',
    date: 'Sep 19, 2026',
    link: 'javascript:void(0)',
    img: {
      src: '/thoughts/madara-legendary-shinobi.jpg',
      srcSet: '/thoughts/madara-legendary-shinobi.jpg 736w',
      pixelWidth: 736,
      pixelHeight: 993
    }
  },
  {
    id: 'poster-10',
    title: 'Darkrai: Nightmare of the Void (Sumi-e)',
    desc: 'Dynamic traditional Japanese sumi-e ink wash calligraphy, swirling dark shadows, and luminous violet nightmare flames.',
    date: 'Sep 19, 2026',
    link: 'javascript:void(0)',
    img: {
      src: '/thoughts/darkrai-nightmare-sumie.jpg',
      srcSet: '/thoughts/darkrai-nightmare-sumie.jpg 640w',
      pixelWidth: 640,
      pixelHeight: 1024
    }
  },
  {
    id: 'poster-11',
    title: 'Itachi Uchiha: The Weight of Sacrifice',
    desc: 'Striking crimson Japanese calligraphy, close-up Sharingan gaze, and timeless wisdom: "Those who cannot acknowledge themselves will eventually fail."',
    date: 'Sep 19, 2026',
    link: 'javascript:void(0)',
    img: {
      src: '/thoughts/itachi-red-typography.jpg',
      srcSet: '/thoughts/itachi-red-typography.jpg 646w',
      pixelWidth: 646,
      pixelHeight: 1024
    }
  },
  {
    id: 'poster-12',
    title: 'The Akatsuki: S-Rank Rogue Ninja Syndicate',
    desc: 'The complete 9-member rogue shinobi roster: Obito, Itachi, Pain, Konan, Kisame, Deidara, Kakuzu, Hidan, and Sasori in iconic crimson cloud badges.',
    date: 'Sep 19, 2026',
    link: 'javascript:void(0)',
    img: {
      src: '/thoughts/akatsuki-roster-grid.jpg',
      srcSet: '/thoughts/akatsuki-roster-grid.jpg 736w',
      pixelWidth: 736,
      pixelHeight: 920
    }
  },
  {
    id: 'poster-13',
    title: "Demon Slayer: Don't Lose Hope (Tanjiro, Tengen, Rengoku)",
    desc: 'Cinematic mint-green duotone panels featuring Kamado Tanjiro, Sound Hashira Tengen Uzui, and Flame Hashira Kyojuro Rengoku fighting through pain.',
    date: 'Sep 19, 2026',
    link: 'javascript:void(0)',
    img: {
      src: '/thoughts/demon-slayer-dont-lose-hope.jpg',
      srcSet: '/thoughts/demon-slayer-dont-lose-hope.jpg 736w',
      pixelWidth: 736,
      pixelHeight: 920
    }
  },
  {
    id: 'poster-14',
    title: 'The Big Three: Naruto, Bleach & One Piece',
    desc: 'Weekly Shonen Jump vintage manga tribute celebrating Luffy (Gear 5), Naruto (Sage Mode), and Ichigo Kurosaki (Bankai).',
    date: 'Sep 19, 2026',
    link: 'javascript:void(0)',
    img: {
      src: '/thoughts/the-big-three-shonen-jump.jpg',
      srcSet: '/thoughts/the-big-three-shonen-jump.jpg 723w',
      pixelWidth: 723,
      pixelHeight: 1024
    }
  },
  {
    id: 'poster-15',
    title: 'Eren Yeager: Freedom Is Worth Any Cost',
    desc: 'Attack on Titan finale aesthetic with Eren Yeager, Mikasa, and Armin: "I will keep moving forward until all my enemies are destroyed."',
    date: 'Sep 19, 2026',
    link: 'javascript:void(0)',
    img: {
      src: '/thoughts/eren-yeager-moving-forward.jpg',
      srcSet: '/thoughts/eren-yeager-moving-forward.jpg 723w',
      pixelWidth: 723,
      pixelHeight: 1024
    }
  }
];

const postersJson = JSON.stringify(postersData);
let code = 'const ISHANT_BLOG_POSTERS = ' + postersJson + ';\n' + orig;

// 3. Keep My Brightest Thoughts and update subtitle
code = code.replace(
  'Discover ideas, perspectives, and creative thinking shaped by our work in brand identity and art direction. Each article explores how thoughtful design helps brands with clarity and intention.',
  'A curated collection of 15 graphic design posters, manga ink compositions, brutalist typography, and high-contrast digital artworks.'
);

// 4. Find exact slice to replace inside framer-bv39vk
const targetStart = 'a(pe,{children:a(J,{query:q(),children:(e,t,n)=>a(te,{children:e?.map(';
const targetEnd = '},n)))})})})})';

const sPos = code.indexOf(targetStart);
const ePos = code.indexOf(targetEnd, sPos);

if (sPos === -1 || ePos === -1) {
  console.error('ERROR: Target markers for inner cards not found!', { sPos, ePos });
  process.exit(1);
}

const replacementCode = 'a(te,{children:ISHANT_BLOG_POSTERS.map(({date:e,title:t,id:n,img:r,desc:i,link:o},s)=>(t??=``,i??=``,o??=``,a(l,{id:`Fn20Ri3K1-${n}`,children:a(ge.Provider,{value:{V1MRCV9ui:o},children:a(ie,{links:[{href:`javascript:void(0)`},{href:`javascript:void(0)`},{href:`javascript:void(0)`}],children:n=>a(y,{breakpoint:x,overrides:{InUaW9Rvc:{width:`max(min(max(${m?.width||`100vw`} - 40px, 1px), 1080px) - 40px, 50px)`,y:(m?.y||0)+160+0+0+140+0+248+0+0},roKBWzAFp:{width:`max((min(max(${m?.width||`100vw`} - 40px, 1px), 900px) - 76px) / 2, 50px)`,y:(m?.y||0)+160+0+0+160+0+268+0+0}},children:a(de,{height:460,width:`max((min(max(${m?.width||`100vw`} - 40px, 1px), 1080px) - 32px) / 3, 50px)`,y:(m?.y||0)+160+0+0+180+0+268+0+0,children:a(M,{animate:V,className:`framer-khup2v-container`,"data-framer-appear-id":`khup2v-${s}`,initial:H,nodeId:`PHWVHsDcy`,optimized:!0,rendersWithMotion:!0,scopeId:`HpHbG8OLS`,children:a(y,{breakpoint:x,overrides:{InUaW9Rvc:{u3qjlDHSa:n[2]},roKBWzAFp:{u3qjlDHSa:n[1]}},children:a(O,{bDLUU4atH:e,eq1bfUtHV:t,hDvLDnBDz:i,height:`100%`,id:`PHWVHsDcy`,layoutId:`PHWVHsDcy`,lImbmi2X8:U(r),style:{width:`100%`},u3qjlDHSa:n[0],width:`100%`})})})})})})})))})';

code = code.slice(0, sPos) + replacementCode + code.slice(ePos + targetEnd.length);

// 5. Replace Q.loader safely
const oldLoader = 'Q.loader={load:(e,t)=>{let n=t.locale,r=_.get(q(),n);return Promise.allSettled([r.preload(),(async()=>{let e=await r.readMaybeAsync()??[];return Promise.allSettled(e.flatMap(e=>m(O,{},t)))})()])}}';
const newLoader = 'Q.loader={load:()=>Promise.resolve([])}';

if (code.includes(oldLoader)) {
  code = code.replace(oldLoader, newLoader);
  console.log('Replaced Q.loader cleanly');
} else {
  console.log('Note: exact oldLoader string not found, searching with regex');
  code = code.replace(/Q\.loader=\{load:\(e,t\)=>\{[\s\S]*?readMaybeAsync[\s\S]*?\}\}\}/, newLoader);
}

// 6. Set background color to #faf7f3
code = code.replace(/background: rgb\(255, 255, 255\);/g, 'background: #faf7f3;');
code = code.replace(/background-color: #ffffff;/g, 'background-color: #faf7f3;');

// 7. Validate with esbuild BEFORE saving!
try {
  esbuild.transformSync(code, { loader: 'js' });
  console.log('SUCCESS: Generated code is 100% syntactically valid according to esbuild!');
  fs.writeFileSync('public/chunks/blog_chunk.mjs', code, 'utf8');
  console.log('Saved to public/chunks/blog_chunk.mjs');
} catch (err) {
  if (err.errors && err.errors[0]) {
    const loc = err.errors[0].location;
    console.error('Loc:', loc);
    const lines = code.split('\n');
    if (lines[loc.line - 1]) {
      console.error('Snippet:', lines[loc.line - 1].slice(Math.max(0, loc.column - 60), loc.column + 60));
    }
  }
  console.error('Validation failed!', err.message);
  process.exit(1);
}
