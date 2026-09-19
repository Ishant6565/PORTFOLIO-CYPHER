const fs = require('fs');
const esbuild = require('esbuild');

console.log('--- Building blog_chunk.mjs using elegant in-place data replacement ---');

let code = fs.readFileSync('scratch/blog_chunk_original.mjs', 'utf8');

// 1. Prefix relative imports with Framer CDN base
const cdnBase = 'https://framerusercontent.com/sites/5OdC8fFdfIksjC0PHuA6WH/';
code = code.replace(/from"\.\//g, 'from"' + cdnBase);
code = code.replace(/from '\.\//g, "from '" + cdnBase);
code = code.replace(/import\("\.\//g, 'import("' + cdnBase);
code = code.replace(/import\('\.\//g, "import('" + cdnBase);

// 2. All 15 posters in Framer CMS data schema format
const postersData = [
  {
    id: 'poster-1',
    createdAt: 'Sep 18, 2026',
    FLXjmg39N: 'Itachi Uchiha: Tsukuyomi & The Crimson Moon',
    uHTfXP8yq: 'Manga ink linework, Akatsuki cloud iconography, and the tragic silhouette of the Uchiha prodigy under the moon.',
    omkZUzufP: { src: '/thoughts/itachi-moon.jpg', srcSet: '/thoughts/itachi-moon.jpg 723w', pixelWidth: 723, pixelHeight: 1024 },
    V1MRCV9ui: 'itachi-moon'
  },
  {
    id: 'poster-2',
    createdAt: 'Sep 18, 2026',
    FLXjmg39N: 'Vi (Arcane): Hextech Brute Force & Zaun Resolve',
    uHTfXP8yq: 'High-octane red and black brutalist dossier, kinetic boxing stance, and industrial steampunk typography.',
    omkZUzufP: { src: '/thoughts/vi-strength-arcane.jpg', srcSet: '/thoughts/vi-strength-arcane.jpg 736w', pixelWidth: 736, pixelHeight: 981 },
    V1MRCV9ui: 'vi-strength-arcane'
  },
  {
    id: 'poster-3',
    createdAt: 'Sep 18, 2026',
    FLXjmg39N: 'Resident Evil 4: Biohazard Noir & Rural Gothic Horror',
    uHTfXP8yq: 'Vintage manga paneling, halftone grit, Las Plagas occult insignia, and cinematic survival-action framing.',
    omkZUzufP: { src: '/thoughts/resident-evil-4.jpg', srcSet: '/thoughts/resident-evil-4.jpg 723w', pixelWidth: 723, pixelHeight: 1024 },
    V1MRCV9ui: 'resident-evil-4'
  },
  {
    id: 'poster-4',
    createdAt: 'Sep 18, 2026',
    FLXjmg39N: 'Arcane: Jinx vs Vi — Two Legends Torn Apart',
    uHTfXP8yq: 'Split duo-tone comic composition, electric blue graffiti streaks, and visceral Zaun underworld grit.',
    omkZUzufP: { src: '/thoughts/arcane-jinx-vi.jpg', srcSet: '/thoughts/arcane-jinx-vi.jpg 735w', pixelWidth: 735, pixelHeight: 919 },
    V1MRCV9ui: 'arcane-jinx-vi'
  },
  {
    id: 'poster-5',
    createdAt: 'Sep 18, 2026',
    FLXjmg39N: 'Cyberwave: Neon Cybernetics & Dystopian Fiction',
    uHTfXP8yq: 'Retro-futuristic anime raster portrait, Japanese Kanji grid typography, and cyberpunk terminal aesthetics.',
    omkZUzufP: { src: '/thoughts/cyberwave-dystopia.jpg', srcSet: '/thoughts/cyberwave-dystopia.jpg 736w', pixelWidth: 736, pixelHeight: 920 },
    V1MRCV9ui: 'cyberwave-dystopia'
  },
  {
    id: 'poster-6',
    createdAt: 'Sep 19, 2026',
    FLXjmg39N: 'Gengar: Shadow Pokémon & Retro Cyber Grid',
    uHTfXP8yq: 'Shadow Pokémon #0094 grinning against a retro wireframe horizon and moonlit cityscape in high-contrast monochrome.',
    omkZUzufP: { src: '/thoughts/gengar-shadow.jpg', srcSet: '/thoughts/gengar-shadow.jpg 576w', pixelWidth: 576, pixelHeight: 1024 },
    V1MRCV9ui: 'gengar-shadow'
  },
  {
    id: 'poster-7',
    createdAt: 'Sep 19, 2026',
    FLXjmg39N: 'Choso: A Pintura Da Morte (Jujutsu Kaisen)',
    uHTfXP8yq: 'Brutalist red-on-black composition, Death Painting Womb blood manipulation, and protective older brother resolve.',
    omkZUzufP: { src: '/thoughts/choso-death-painting.jpg', srcSet: '/thoughts/choso-death-painting.jpg 724w', pixelWidth: 724, pixelHeight: 1024 },
    V1MRCV9ui: 'choso-death-painting'
  },
  {
    id: 'poster-8',
    createdAt: 'Sep 19, 2026',
    FLXjmg39N: 'Maomao & Jinshi: The Apothecary Diaries',
    uHTfXP8yq: 'Deep magenta and noir elegance, imperial palace intrigue, medical deduction, and subtle character chemistry.',
    omkZUzufP: { src: '/thoughts/maomao-jinshi-apothecary.jpg', srcSet: '/thoughts/maomao-jinshi-apothecary.jpg 681w', pixelWidth: 681, pixelHeight: 1024 },
    V1MRCV9ui: 'maomao-jinshi-apothecary'
  },
  {
    id: 'poster-9',
    createdAt: 'Sep 19, 2026',
    FLXjmg39N: 'Uchiha Madara: The Ghost of the Uchiha',
    uHTfXP8yq: 'Manga panel collage of Edo Tensei Madara, Rinnegan awakening, and the sheer overwhelming power of the legendary shinobi.',
    omkZUzufP: { src: '/thoughts/madara-legendary-shinobi.jpg', srcSet: '/thoughts/madara-legendary-shinobi.jpg 736w', pixelWidth: 736, pixelHeight: 993 },
    V1MRCV9ui: 'madara-legendary-shinobi'
  },
  {
    id: 'poster-10',
    createdAt: 'Sep 19, 2026',
    FLXjmg39N: 'Darkrai: Nightmare of the Void (Sumi-e)',
    uHTfXP8yq: 'Dynamic traditional Japanese sumi-e ink wash calligraphy, swirling dark shadows, and luminous violet nightmare flames.',
    omkZUzufP: { src: '/thoughts/darkrai-nightmare-sumie.jpg', srcSet: '/thoughts/darkrai-nightmare-sumie.jpg 640w', pixelWidth: 640, pixelHeight: 1024 },
    V1MRCV9ui: 'darkrai-nightmare-sumie'
  },
  {
    id: 'poster-11',
    createdAt: 'Sep 19, 2026',
    FLXjmg39N: 'Itachi Uchiha: The Weight of Sacrifice',
    uHTfXP8yq: 'Striking crimson Japanese calligraphy, close-up Sharingan gaze, and timeless wisdom: "Those who cannot acknowledge themselves will eventually fail."',
    omkZUzufP: { src: '/thoughts/itachi-red-typography.jpg', srcSet: '/thoughts/itachi-red-typography.jpg 646w', pixelWidth: 646, pixelHeight: 1024 },
    V1MRCV9ui: 'itachi-red-typography'
  },
  {
    id: 'poster-12',
    createdAt: 'Sep 19, 2026',
    FLXjmg39N: 'The Akatsuki: S-Rank Rogue Ninja Syndicate',
    uHTfXP8yq: 'The complete 9-member rogue shinobi roster: Obito, Itachi, Pain, Konan, Kisame, Deidara, Kakuzu, Hidan, and Sasori in iconic crimson cloud badges.',
    omkZUzufP: { src: '/thoughts/akatsuki-roster-grid.jpg', srcSet: '/thoughts/akatsuki-roster-grid.jpg 736w', pixelWidth: 736, pixelHeight: 920 },
    V1MRCV9ui: 'akatsuki-roster-grid'
  },
  {
    id: 'poster-13',
    createdAt: 'Sep 19, 2026',
    FLXjmg39N: "Demon Slayer: Don't Lose Hope (Tanjiro, Tengen, Rengoku)",
    uHTfXP8yq: 'Cinematic mint-green duotone panels featuring Kamado Tanjiro, Sound Hashira Tengen Uzui, and Flame Hashira Kyojuro Rengoku fighting through pain.',
    omkZUzufP: { src: '/thoughts/demon-slayer-dont-lose-hope.jpg', srcSet: '/thoughts/demon-slayer-dont-lose-hope.jpg 736w', pixelWidth: 736, pixelHeight: 920 },
    V1MRCV9ui: 'demon-slayer-dont-lose-hope'
  },
  {
    id: 'poster-14',
    createdAt: 'Sep 19, 2026',
    FLXjmg39N: 'The Big Three: Naruto, Bleach & One Piece',
    uHTfXP8yq: 'Weekly Shonen Jump vintage manga tribute celebrating Luffy (Gear 5), Naruto (Sage Mode), and Ichigo Kurosaki (Bankai).',
    omkZUzufP: { src: '/thoughts/the-big-three-shonen-jump.jpg', srcSet: '/thoughts/the-big-three-shonen-jump.jpg 723w', pixelWidth: 723, pixelHeight: 1024 },
    V1MRCV9ui: 'the-big-three-shonen-jump'
  },
  {
    id: 'poster-15',
    createdAt: 'Sep 19, 2026',
    FLXjmg39N: 'Eren Yeager: Freedom Is Worth Any Cost',
    uHTfXP8yq: 'Attack on Titan finale aesthetic with Eren Yeager, Mikasa, and Armin: "I will keep moving forward until all my enemies are destroyed."',
    omkZUzufP: { src: '/thoughts/eren-yeager-moving-forward.jpg', srcSet: '/thoughts/eren-yeager-moving-forward.jpg 723w', pixelWidth: 723, pixelHeight: 1024 },
    V1MRCV9ui: 'eren-yeager-moving-forward'
  }
];

const postersJson = JSON.stringify(postersData);
code = 'const ISHANT_BLOG_POSTERS = ' + postersJson + ';\n' + code;

// 3. Keep My Brightest Thoughts and update subtitle
code = code.replace(
  'Discover ideas, perspectives, and creative thinking shaped by our work in brand identity and art direction. Each article explores how thoughtful design helps brands with clarity and intention.',
  'A curated collection of 15 graphic design posters, manga ink compositions, brutalist typography, and high-contrast digital artworks.'
);

// 4. In-place data replacement for e?.map:
// In original: children:(e,t,n)=>a(te,{children:e?.map(
// We replace e?.map with ISHANT_BLOG_POSTERS.map!
const oldMapTarget = 'children:(e,t,n)=>a(te,{children:e?.map(';
const newMapTarget = 'children:(e,t,n)=>a(te,{children:ISHANT_BLOG_POSTERS.map(';

if (!code.includes(oldMapTarget)) {
  console.error('ERROR: oldMapTarget not found!');
  process.exit(1);
}
code = code.replace(oldMapTarget, newMapTarget);
console.log('Replaced e?.map with ISHANT_BLOG_POSTERS.map successfully!');

// Also neutralize links to javascript:void(0) to prevent page jumping
code = code.replace(
  /links:\[\{href:\{hash:`:SIBntN1fO`[\s\S]*?webPageId:`AyF_zYQaO`\},implicitPathVariables:void 0\}\],/g,
  'links:[{href:`javascript:void(0)`},{href:`javascript:void(0)`},{href:`javascript:void(0)`}], '
);

// 5. Replace Q.loader safely
const oldLoader = 'Q.loader={load:(e,t)=>{let n=t.locale,r=_.get(q(),n);return Promise.allSettled([r.preload(),(async()=>{let e=await r.readMaybeAsync()??[];return Promise.allSettled(e.flatMap(e=>m(O,{},t)))})()])}}';
const newLoader = 'Q.loader={load:()=>Promise.resolve([])}';

if (code.includes(oldLoader)) {
  code = code.replace(oldLoader, newLoader);
  console.log('Replaced Q.loader cleanly');
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
  console.error('Validation failed!', err.message);
  process.exit(1);
}
