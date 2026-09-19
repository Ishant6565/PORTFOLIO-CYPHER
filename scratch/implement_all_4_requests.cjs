const fs = require('fs');

console.log('=== IMPLEMENTING ALL 4 USER REQUIREMENTS ===');

let chunk = fs.readFileSync('public/chunks/avatar_chunk.mjs', 'utf8');
let scriptMain = fs.readFileSync('public/chunks/script_main.mjs', 'utf8');
let html = fs.readFileSync('index.html', 'utf8');

// =========================================================================
// 1. GITHUB PROJECTS IN WORKS SECTION
// =========================================================================
console.log('1. Setting GitHub repository links for all projects...');

const githubProjects = [
  {
    "id": "proj-1",
    "pTZO_oSbE": "AI Career Copilot",
    "d2tWDYLdk": "AUTONOMOUS CAREER COCKPIT • Next.js 15",
    "vXM6wNGWb": {
      "src": "/projects/ai-career-copilot.png",
      "srcSet": "/projects/ai-career-copilot.png 1160w",
      "pixelWidth": 1160,
      "pixelHeight": 800
    },
    "iOAqXTIM4": "https://github.com/Ishant6565/AI-Career-Copilot"
  },
  {
    "id": "proj-2",
    "pTZO_oSbE": "GenAI DevAgent",
    "d2tWDYLdk": "MULTI-AGENT LANGGRAPH DAG • Docker",
    "vXM6wNGWb": {
      "src": "/projects/genai-devagent.png",
      "srcSet": "/projects/genai-devagent.png 1160w",
      "pixelWidth": 1160,
      "pixelHeight": 800
    },
    "iOAqXTIM4": "https://github.com/Ishant6565/GenAI-Developer-Agent"
  },
  {
    "id": "proj-3",
    "pTZO_oSbE": "The Daily Grandmaster",
    "d2tWDYLdk": "MINIMAX ALPHA-BETA CHESS ENGINE",
    "vXM6wNGWb": {
      "src": "/projects/chess-ai.png",
      "srcSet": "/projects/chess-ai.png 1160w",
      "pixelWidth": 1160,
      "pixelHeight": 800
    },
    "iOAqXTIM4": "https://github.com/Ishant6565/Chess-AI-Engine"
  },
  {
    "id": "proj-4",
    "pTZO_oSbE": "Mindloop (Mental Health AI)",
    "d2tWDYLdk": "PREDICTIVE ML PROTOTYPE • Random Forest",
    "vXM6wNGWb": {
      "src": "/projects/mental-health-ml.png",
      "srcSet": "/projects/mental-health-ml.png 1160w",
      "pixelWidth": 1160,
      "pixelHeight": 800
    },
    "iOAqXTIM4": "https://github.com/Ishant6565/Mental-Health-Score-ML"
  },
  {
    "id": "proj-5",
    "pTZO_oSbE": "Spotify Cloud DevOps",
    "d2tWDYLdk": "TERRAFORM IAC & AWS AUTOMATION",
    "vXM6wNGWb": {
      "src": "/projects/spotify-devops.png",
      "srcSet": "/projects/spotify-devops.png 1160w",
      "pixelWidth": 1160,
      "pixelHeight": 800
    },
    "iOAqXTIM4": "https://github.com/Ishant6565/Spotify-Terraform-DevOps"
  },
  {
    "id": "proj-6",
    "pTZO_oSbE": "Stock Analysis Web App",
    "d2tWDYLdk": "FINANCIAL API ENGINE • JavaScript",
    "vXM6wNGWb": {
      "src": "/projects/gamehub.png",
      "srcSet": "/projects/gamehub.png 1160w",
      "pixelWidth": 1160,
      "pixelHeight": 800
    },
    "iOAqXTIM4": "https://github.com/Ishant6565/Stock-Market-Analysis"
  }
];

const projDef = `const ISHANT_CYPHER_PROJECTS = ${JSON.stringify(githubProjects, null, 2)};`;
chunk = chunk.replace(/const ISHANT_CYPHER_PROJECTS = [\s\S]*?\];/g, projDef);

// =========================================================================
// 2. GOOGLE LOGO IN CERTIFICATES SECTION
// =========================================================================
console.log('2. Updating Certificates to use /images/google-cert-logo.png...');

chunk = chunk.replaceAll('/images/google-logo.svg', '/images/google-cert-logo.png');

// Ensure all 4 cards reference /images/google-cert-logo.png
['Awcs6rmjA', 'LPDDziUSt', 'w2ZKyzhGF', 'r7HDjo09x'].forEach(id => {
  const p = chunk.indexOf('nodeId:`' + id + '`');
  if (p !== -1) {
    const end = chunk.indexOf('})})})})', p);
    if (end !== -1) {
      let cardStr = chunk.slice(p, end);
      cardStr = cardStr.replaceAll('/images/google-logo.svg', '/images/google-cert-logo.png');
      chunk = chunk.slice(0, p) + cardStr + chunk.slice(end);
    }
  }
});

// =========================================================================
// 3. CYPHER WATERMARK: BOTTOM TOUCHING FLOOR
// =========================================================================
console.log('3. Sticking CYPHER to the absolute bottom floor...');

// In index.html SVG:
const cypherBottomSvg = `
<svg class="framer-3vb2n7" data-framer-component-type="RichTextContainer" viewBox="0 0 1000 135" preserveAspectRatio="none" style="--extracted-r6o4lv:var(--token-57f08e2a-01d8-4ce0-89a5-f6d5488003ee, rgba(250, 247, 243, 0.1));--framer-link-text-color:rgb(0, 153, 255);--framer-link-text-decoration:underline;width:100vw;max-width:100vw;height:auto;display:block;overflow:hidden;position:absolute;left:50%;transform:translateX(-50%);bottom:0px;pointer-events:none;margin:0;padding:0">
  <text x="0" y="130" textLength="1000" lengthAdjust="spacing" font-family="'Archivo', 'Archivo Placeholder', sans-serif" font-weight="900" font-size="160" fill="var(--token-57f08e2a-01d8-4ce0-89a5-f6d5488003ee, rgba(250, 247, 243, 0.1))" letter-spacing="-0.02em">CYPHER</text>
</svg>
`.trim();

html = html.replace(/<svg class="framer-3vb2n7"[^>]*>[\s\S]*?<\/svg>/g, cypherBottomSvg);

// In script_main.mjs:
scriptMain = scriptMain.replaceAll('bottom: -90px;', 'bottom: 0px;');
scriptMain = scriptMain.replaceAll('bottom: -40px;', 'bottom: 0px;');
scriptMain = scriptMain.replaceAll('bottom: -30px;', 'bottom: 0px;');

// =========================================================================
// 4. GRAPHIC DESIGN LIGHTBOX MODAL POPUP
// =========================================================================
console.log('4. Adding Lightbox Modal for Graphic Design posters...');

// Lightbox HTML & Script to be injected into index.html before </body>
const lightboxModalHtml = `
<!-- Fullscreen Poster Lightbox Modal -->
<div id="poster-lightbox" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.92);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);z-index:999999;align-items:center;justify-content:center;flex-direction:column;opacity:0;transition:opacity 0.25s ease;box-sizing:border-box;padding:20px;">
  <button id="lightbox-close" style="position:absolute;top:24px;right:28px;background:rgba(255,255,255,0.15);border:none;color:#fff;width:44px;height:44px;border-radius:50%;font-size:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s ease;z-index:1000000;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">✕</button>
  <div style="max-width:90vw;max-height:85vh;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;">
    <img id="lightbox-img" src="" alt="Poster" style="max-width:100%;max-height:78vh;object-fit:contain;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.8);display:block;border:1px solid rgba(255,255,255,0.1);">
    <div style="margin-top:16px;text-align:center;">
      <h3 id="lightbox-title" style="margin:0;font-family:'Archivo',sans-serif;font-size:20px;font-weight:600;color:#faf7f3;line-height:1.3;"></h3>
      <p id="lightbox-desc" style="margin:6px 0 0 0;font-family:'Inter',sans-serif;font-size:14px;color:rgba(250,247,243,0.7);max-width:600px;"></p>
    </div>
  </div>
</div>

<script>
  (function() {
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

    // Delegate clicks on thoughts/posters
    document.addEventListener('click', function(e) {
      var posterCard = e.target.closest('a[href="#thoughts"], [data-framer-name="Thoughts Section"] a, .framer-1leqxa3 a, a[href*="/thoughts/"]');
      if (posterCard) {
        e.preventDefault();
        e.stopPropagation();
        var img = posterCard.querySelector('img');
        var titleEl = posterCard.querySelector('h3, .framer-mup09r p');
        var descEl = posterCard.querySelector('.framer-1m6g45b p');
        
        var src = img ? (img.getAttribute('src') || img.currentSrc) : '';
        var title = titleEl ? titleEl.textContent : (img ? img.getAttribute('alt') : '');
        var desc = descEl ? descEl.textContent : '';

        if (src) {
          openLightbox(src, title, desc);
        }
      }
    }, true);
  })();
</script>
`;

if (!html.includes('id="poster-lightbox"')) {
  html = html.replace('</body>', lightboxModalHtml + '\n</body>');
}

// =========================================================================
// 5. CSS OVERRIDES FOR PERFECT CIRCULAR GOOGLE LOGO & FLUSH WATERMARK
// =========================================================================
console.log('5. Injecting CSS overrides for circular Google logo and flush bottom watermark...');

const masterCss = `
  /* === Perfect Circular Google Logo in Certificates === */
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

  /* === CYPHER Watermark Touching Absolute Bottom Floor === */
  .framer-soKIl .framer-3vb2n7,
  .framer-3vb2n7 {
    display: block !important;
    position: absolute !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    right: auto !important;
    bottom: 0px !important;
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    pointer-events: none !important;
    user-select: none !important;
    z-index: 1 !important;
    line-height: 0 !important;
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

  /* Footer container generous bottom room */
  .framer-soKIl.framer-788ly6,
  footer.framer-788ly6 {
    padding-bottom: 220px !important;
  }
`;

html = html.replace('</style>', masterCss + '\n</style>');

fs.writeFileSync('public/chunks/avatar_chunk.mjs', chunk, 'utf8');
fs.writeFileSync('public/chunks/script_main.mjs', scriptMain, 'utf8');
fs.writeFileSync('index.html', html, 'utf8');

console.log('=== ALL 4 TASKS COMPLETED & SAVED CLEANLY ===');
