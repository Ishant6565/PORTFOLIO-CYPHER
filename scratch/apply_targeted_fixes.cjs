const fs = require('fs');

console.log('Applying targeted fixes...');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf8');

// A. Pinterest SVG in index.html
const pinterestOutlineSvg = '<svg id="832930135" display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="transparent" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--1ww558a, 2)" stroke="var(--4rxgx6, black)"/><path d="M 8 20 L 12 11" fill="transparent" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--1ww558a, 2)" stroke="var(--4rxgx6, black)"/><path d="M 10.7 14 C 11.137 15.263 12.13 16 13.25 16 C 15.321 16 17 14.446 17 12 C 17 9.239 14.761 7 12 7 C 9.239 7 7 9.239 7 12 C 7 13.06 7.33 14.04 7.9 14.85" fill="transparent" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--1ww558a, 2)" stroke="var(--4rxgx6, black)"/></svg>';

html = html.replace(/<svg id="832930135"[\s\S]*?<\/svg>/, pinterestOutlineSvg);

// B. Project GitHub Icon CSS
const oldGithubCss = /\.project-github-icon-link\s*\{[\s\S]*?\}\s*\.project-github-icon-link:hover\s*\{[\s\S]*?\}/;
const newGithubCss = `.project-github-icon-link {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: #111111 !important;
    opacity: 0.75 !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    vertical-align: middle !important;
    margin-left: 10px !important;
    padding: 4px !important;
    border-radius: 6px !important;
    background: rgba(0, 0, 0, 0.05) !important;
    border: 1px solid rgba(0, 0, 0, 0.08) !important;
    text-decoration: none !important;
    cursor: pointer !important;
  }
  .project-github-icon-link:hover {
    opacity: 1 !important;
    color: #000000 !important;
    background: rgba(0, 0, 0, 0.12) !important;
    border-color: rgba(0, 0, 0, 0.2) !important;
    transform: scale(1.12) !important;
  }`;

if (oldGithubCss.test(html)) {
  html = html.replace(oldGithubCss, newGithubCss);
} else {
  console.log('Warning: oldGithubCss regex did not match, adding to head style');
  html = html.replace('</style>', newGithubCss + '\n</style>');
}

// C. Update attachGithubLogos and poster click handler in index.html
const oldScriptBlockRegex = /\/\/ 1\. Poster Lightbox Modal[\s\S]*?\/\/ 2\. Project Card GitHub Icon Next to Titles[\s\S]*?observer\.observe\(document\.body, \{ childList: true, subtree: true \}\);/;

const newScriptBlock = `// 1. Poster Lightbox Modal (ZERO SCROLL JUMP)
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
      requestAnimationFrame(function() {
        lightbox.style.opacity = '1';
      });
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
      // Prevent clicks inside the lightbox dialog from closing it
      var lbDialog = lightbox.querySelector('div');
      if (lbDialog) {
        lbDialog.addEventListener('click', function(e) {
          e.stopPropagation();
        });
      }
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeLightbox();
    });

    // Capture clicks on ANY poster or its caption (ZERO SCROLL JUMP)
    document.addEventListener('click', function(e) {
      var card = e.target.closest('.framer-1leqxa3 > *') || e.target.closest('.framer-1gwykho-container');
      if (card && !card.closest('#poster-lightbox')) {
        var img = card.querySelector('img');
        if (img) {
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
            var titleEl = card.querySelector('h3, [data-styles-preset="sJTxBXgD6"] p, [data-styles-preset="rnettFmGc"] p');
            var descEl = card.querySelector('.framer-4wbxei p, [data-styles-preset="e4lWfIAXv"] p');
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
    var githubSvgIcon = '<svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor" style="display:block;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';

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
      var titleHeaders = document.querySelectorAll('.framer-1a1g2uv h3, .framer-v4eg3f h3, [data-framer-name="Title & Description"] h3, [data-framer-name="Project Card"] h3');
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
          ghLink.title = 'View Source Code on GitHub (' + text + ')';
          ghLink.setAttribute('aria-label', 'View Source Code on GitHub (' + text + ')');
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
    observer.observe(document.body, { childList: true, subtree: true });`;

if (oldScriptBlockRegex.test(html)) {
  html = html.replace(oldScriptBlockRegex, newScriptBlock);
  console.log('Replaced script block in index.html');
} else {
  console.log('Warning: oldScriptBlockRegex did not match directly!');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated index.html successfully!');

// 2. Also update ht in avatar_chunk.mjs
let chunk = fs.readFileSync('public/chunks/avatar_chunk.mjs', 'utf8');
chunk = chunk.replace(/ht=`[\s\S]*?`/, 'ht=`' + pinterestOutlineSvg + '`');
fs.writeFileSync('public/chunks/avatar_chunk.mjs', chunk, 'utf8');
console.log('Updated public/chunks/avatar_chunk.mjs successfully!');
