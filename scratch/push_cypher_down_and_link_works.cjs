const fs = require('fs');

console.log('=== PUSHING CYPHER DOWN & ENABLING SMOOTH SCROLL FOR WORKS ===');

let html = fs.readFileSync('index.html', 'utf8');
let chunk = fs.readFileSync('public/chunks/avatar_chunk.mjs', 'utf8');
let scriptMain = fs.readFileSync('public/chunks/script_main.mjs', 'utf8');

// =========================================================================
// 1. PUSH CYPHER DOWN & RESTORE AMPLE VERTICAL BREATHING ROOM
// =========================================================================
console.log('1. Pushing CYPHER down to bottom: -90px with 340px bottom padding...');

// In script_main.mjs:
scriptMain = scriptMain.replaceAll(
  'padding: 140px 0px 280px 0px;',
  'padding: 120px 0px 340px 0px;'
);
scriptMain = scriptMain.replaceAll(
  'bottom: -40px;',
  'bottom: -90px;'
);
scriptMain = scriptMain.replaceAll(
  'bottom: -30px;',
  'bottom: -90px;'
);

// In index.html:
// Update CSS rules
const footerUpdatedCss = `
  /* === Exact Screenshot 2 Footer Layout: CYPHER Pushed Down === */
  .framer-soKIl.framer-788ly6,
  .framer-soKIl.framer-v-1w2xgsd.framer-788ly6,
  footer.framer-788ly6 {
    display: flex !important;
    flex-direction: row !important;
    justify-content: center !important;
    align-items: flex-start !important;
    width: 100% !important;
    max-width: 100vw !important;
    padding: 120px 0 340px 0 !important;
    position: relative !important;
    overflow: hidden !important;
    box-sizing: border-box !important;
  }

  @media (max-width: 809.98px) {
    .framer-soKIl.framer-v-1s9g854.framer-788ly6,
    footer.framer-788ly6 {
      padding: 100px 0 240px 0 !important;
    }
  }

  .framer-soKIl .framer-1got5e6,
  .framer-1got5e6 {
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: flex-start !important;
    flex-wrap: wrap !important;
    width: 90% !important;
    max-width: 1180px !important;
    gap: 40px !important;
    margin: 0 auto !important;
    padding: 0 20px !important;
    box-sizing: border-box !important;
    position: relative !important;
    z-index: 2 !important;
    flex: 1 0 auto !important;
  }

  .framer-soKIl .framer-1umwttr,
  .framer-1umwttr {
    flex: 1 1 320px !important;
    max-width: 380px !important;
    min-width: 260px !important;
    white-space: normal !important;
  }

  .framer-soKIl .framer-19u2gmr,
  .framer-19u2gmr {
    flex: 1 1 500px !important;
    max-width: 650px !important;
    min-width: 300px !important;
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: flex-start !important;
    gap: 40px !important;
    white-space: normal !important;
  }

  .framer-soKIl .framer-kularx,
  .framer-kularx {
    display: flex !important;
    flex-direction: column !important;
    gap: 16px !important;
  }

  .framer-soKIl .framer-1ac7wjl,
  .framer-1ac7wjl {
    display: flex !important;
    flex-direction: column !important;
    gap: 16px !important;
  }

  .framer-soKIl .framer-3drypv p,
  .framer-3drypv a {
    white-space: nowrap !important;
  }

  /* CYPHER Watermark Pushed Cleanly Down */
  .framer-soKIl .framer-3vb2n7,
  .framer-3vb2n7 {
    display: block !important;
    position: absolute !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    right: auto !important;
    bottom: -90px !important;
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    pointer-events: none !important;
    user-select: none !important;
    z-index: 1 !important;
  }

  .framer-3vb2n7 svg {
    width: 100vw !important;
    max-width: 100vw !important;
    height: auto !important;
    display: block !important;
    overflow: hidden !important;
  }

  /* Smooth scrolling for anchor links */
  html {
    scroll-behavior: smooth !important;
  }
`;

if (html.includes('/* === Exact Screenshot 2 Footer Layout')) {
  html = html.replace(/\/\* === Exact Screenshot 2 Footer Layout[\s\S]*?<\/style>/, footerUpdatedCss + '\n</style>');
} else {
  html = html.replace('</style>', footerUpdatedCss + '\n</style>');
}

// In index.html SVG markup: set bottom: -90px
html = html.replaceAll('bottom:-30px', 'bottom:-90px');
html = html.replaceAll('bottom: -30px', 'bottom: -90px');

// =========================================================================
// 2. MAKE "WORKS" TAB SCROLL SMOOTHLY TO PROJECTS SECTION
// =========================================================================
console.log('2. Linking Works tab to Projects Section...');

// Add id="projects" to Projects Section in avatar_chunk.mjs
chunk = chunk.replace(
  `l(\`section\`,{className:\`framer-1ut795m\`,"data-framer-name":\`Projects Section\``,
  `l(\`section\`,{className:\`framer-1ut795m\`,"data-framer-name":\`Projects Section\`,id:\`projects\`,"data-section-name":\`projects\``
);

// Add scroll-margin-top to Projects Section so it scrolls cleanly below navbar
const scrollMarginCss = `
  #projects,
  [data-framer-name="Projects Section"],
  .framer-1ut795m {
    scroll-margin-top: 80px !important;
  }
`;
html = html.replace('</style>', scrollMarginCss + '\n</style>');

// Add universal click listener in index.html to handle all "Works" clicks
const worksClickListener = `
<script>
  (function() {
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
        if (text === 'Works' || href.indexOf('TCEKPjkfm') !== -1 || href.indexOf('works') !== -1) {
          e.preventDefault();
          e.stopPropagation();
          scrollToProjects();
        }
      }
    }, true);
  })();
</script>
`;

if (!html.includes('scrollToProjects()')) {
  html = html.replace('</body>', worksClickListener + '\n</body>');
}

// In script_main.mjs: update Works links to point to #projects
scriptMain = scriptMain.replaceAll(':TCEKPjkfm', '#projects');

fs.writeFileSync('public/chunks/avatar_chunk.mjs', chunk, 'utf8');
fs.writeFileSync('public/chunks/script_main.mjs', scriptMain, 'utf8');
fs.writeFileSync('index.html', html, 'utf8');

console.log('=== CYPHER PUSHED DOWN & WORKS LINK ACTIVE! ===');
