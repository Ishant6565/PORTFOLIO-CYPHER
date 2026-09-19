const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const oldMapStart = 'var posterMap = {';
const oldMapEnd = '};\n\n    function openLightbox';

const newPosterMap = `var posterMap = {
      // 15 Blog / Thoughts Graphic Design Posters:
      'itachi-moon': {
        title: 'Itachi Uchiha: Tsukuyomi & The Crimson Moon',
        desc: 'Manga ink linework, Akatsuki cloud iconography, and the tragic silhouette of the Uchiha prodigy under the moon.'
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
      'gengar-shadow': {
        title: 'Gengar: Shadow Pokémon & Retro Cyber Grid',
        desc: 'Shadow Pokémon #0094 grinning against a retro wireframe horizon and moonlit cityscape in high-contrast monochrome.'
      },
      'choso-death-painting': {
        title: 'Choso: A Pintura Da Morte (Jujutsu Kaisen)',
        desc: 'Brutalist red-on-black composition, Death Painting Womb blood manipulation, and protective older brother resolve.'
      },
      'maomao-jinshi-apothecary': {
        title: 'Maomao & Jinshi: The Apothecary Diaries',
        desc: 'Deep magenta and noir elegance, imperial palace intrigue, medical deduction, and subtle character chemistry.'
      },
      'madara-legendary-shinobi': {
        title: 'Uchiha Madara: The Ghost of the Uchiha',
        desc: 'Manga panel collage of Edo Tensei Madara, Rinnegan awakening, and the sheer overwhelming power of the legendary shinobi.'
      },
      'darkrai-nightmare-sumie': {
        title: 'Darkrai: Nightmare of the Void (Sumi-e)',
        desc: 'Dynamic traditional Japanese sumi-e ink wash calligraphy, swirling dark shadows, and luminous violet nightmare flames.'
      },
      'itachi-red-typography': {
        title: 'Itachi Uchiha: The Weight of Sacrifice',
        desc: 'Striking crimson Japanese calligraphy, close-up Sharingan gaze, and timeless wisdom: "Those who cannot acknowledge themselves will eventually fail."'
      },
      'akatsuki-roster-grid': {
        title: 'The Akatsuki: S-Rank Rogue Ninja Syndicate',
        desc: 'The complete 9-member rogue shinobi roster: Obito, Itachi, Pain, Konan, Kisame, Deidara, Kakuzu, Hidan, and Sasori in iconic crimson cloud badges.'
      },
      'demon-slayer-dont-lose-hope': {
        title: "Demon Slayer: Don't Lose Hope (Tanjiro, Tengen, Rengoku)",
        desc: 'Cinematic mint-green duotone panels featuring Kamado Tanjiro, Sound Hashira Tengen Uzui, and Flame Hashira Kyojuro Rengoku fighting through pain.'
      },
      'the-big-three-shonen-jump': {
        title: 'The Big Three: Naruto, Bleach & One Piece',
        desc: 'Weekly Shonen Jump vintage manga tribute celebrating Luffy (Gear 5), Naruto (Sage Mode), and Ichigo Kurosaki (Bankai).'
      },
      'eren-yeager-moving-forward': {
        title: 'Eren Yeager: Freedom Is Worth Any Cost',
        desc: 'Attack on Titan finale aesthetic with Eren Yeager, Mikasa, and Armin: "I will keep moving forward until all my enemies are destroyed."'
      },

      // Home Page Graphic Design Posters:
      'batman-rainy': {
        title: 'The Batman: Shadows of Gotham',
        desc: 'Atmospheric noir composition capturing the dark detective under Gotham torrential rainfall.'
      },
      'dark-knight-collage': {
        title: 'The Dark Knight: Chaos & Order',
        desc: 'Dynamic manga-style comic framing highlighting the psychological tension of Gotham vigilantism.'
      },
      'jinx-arcane': {
        title: 'Arcane: Jinx — Loose Cannon of Zaun',
        desc: 'Electric high-contrast pop artwork celebrating the chaotic genius and kinetic energy of Jinx.'
      },
      'solo-leveling-jinwoo': {
        title: 'Solo Leveling: Sung Jin-woo Shadow Monarch',
        desc: 'Luminescent violet aura and shadow sovereign awakening in an intense graphic composition.'
      },
      'miles-morales-graffiti': {
        title: 'Spider-Man: Miles Morales — What\\'s Up Danger',
        desc: 'Vibrant urban graffiti styling, halftone textures, and kinetic leap-of-faith perspective.'
      },
      'naruto-team-7': {
        title: 'Naruto: Team 7 Legacy',
        desc: 'Nostalgic retro manga collage honoring the bonds, trials, and journey of Naruto, Sasuke, and Sakura.'
      },
      'spider-man-collage': {
        title: 'Spider-Man: Multiverse Chronicles',
        desc: 'Intricate multi-panel comic tribute showcasing iconic web-slinging battles and heroic resolve.'
      },
      'lana-del-rey': {
        title: 'Lana Del Rey: Vintage Cinematic Noir',
        desc: 'Retro aesthetic editorial graphic blending vintage typography with moody nostalgic vibes.'
      }
    };

    function openLightbox`;

const startIdx = html.indexOf(oldMapStart);
const endIdx = html.indexOf(oldMapEnd);

if (startIdx !== -1 && endIdx !== -1) {
  html = html.slice(0, startIdx) + newPosterMap + html.slice(endIdx + 2); // after };
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Successfully updated index.html with all 15 posters in posterMap!');
} else {
  console.error('Could not find posterMap markers in index.html', { startIdx, endIdx });
}
