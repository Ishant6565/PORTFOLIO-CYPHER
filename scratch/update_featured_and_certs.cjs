const fs = require('fs');

console.log('--- Applying User Requests ---');

// =========================================================================
// 1. Remove "View All Posters" button next to "Featured Projects"
// =========================================================================
let avatar = fs.readFileSync('public/chunks/avatar_chunk.mjs', 'utf8');

// Look for Title & Button children around Featured Projects
// In avatar_chunk:
// children:[l(R,{__fromCanvasComponent:!0,children:l(o,{children:l(`h2`,{className:`framer-styles-preset-izeex`,"data-styles-preset":`DBxp0bzr3`,dir:`auto`,children:`Featured Projects`})}),className:`framer-16hn49o`,effect:J,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0}),l(`div`,{className:`framer-1ptmnz5`,"data-framer-name":`Button Wrap`,children:...})]

const btnWrapMarker = 'l(`div`,{className:`framer-1ptmnz5`,"data-framer-name":`Button Wrap`';
const idxBtn = avatar.indexOf(btnWrapMarker);

if (idxBtn !== -1) {
  console.log('Found Button Wrap next to Featured Projects');
  // Find the closing of this l(`div`, {...})
  // It is the second element of children: [...]
  const commaBefore = avatar.lastIndexOf(',', idxBtn);
  // Find matching closing for l(`div`, ...)
  let depth = 0;
  let endPos = idxBtn;
  let started = false;
  for (let i = idxBtn; i < avatar.length; i++) {
    if (avatar[i] === '(') {
      depth++;
      started = true;
    } else if (avatar[i] === ')') {
      depth--;
      if (started && depth === 0) {
        endPos = i + 1;
        break;
      }
    }
  }
  
  if (commaBefore !== -1 && endPos > idxBtn) {
    console.log('Slicing out Button Wrap between', commaBefore, 'and', endPos);
    avatar = avatar.slice(0, commaBefore) + avatar.slice(endPos);
    fs.writeFileSync('public/chunks/avatar_chunk.mjs', avatar, 'utf8');
    console.log('Successfully removed Button Wrap from Featured Projects header!');
  }
} else {
  console.log('Note: Button Wrap marker not found, checking alternative');
}

// =========================================================================
// 2. Update heading in public/chunks/blog_chunk.mjs
// Change "My Brightest Thoughts" -> "Graphics"
// =========================================================================
let blogChunk = fs.readFileSync('public/chunks/blog_chunk.mjs', 'utf8');

if (blogChunk.includes('children:`My Brightest Thoughts`') || blogChunk.includes('children:"My Brightest Thoughts"')) {
  blogChunk = blogChunk.replace('children:`My Brightest Thoughts`', 'children:`Graphics`');
  blogChunk = blogChunk.replace('children:"My Brightest Thoughts"', 'children:"Graphics"');
  console.log('Replaced My Brightest Thoughts with Graphics in blog_chunk.mjs');
} else {
  console.log('Checking alternative for My Brightest Thoughts');
  blogChunk = blogChunk.replace(/My Brightest Thoughts/g, 'Graphics');
}

// Update description subtitle on blog page
blogChunk = blogChunk.replace(
  /A curated collection of 15 graphic design posters[^\`]*/,
  'A curated collection of 15 graphic design posters, manga ink compositions, and brutalist visual artworks.'
);

fs.writeFileSync('public/chunks/blog_chunk.mjs', blogChunk, 'utf8');
console.log('Updated blog_chunk.mjs successfully!');

// =========================================================================
// 3. Update index.html:
// - Add CSS .framer-1ptmnz5 { display: none !important; }
// - Add Coursera click handler for the 4 certificates
// - Add hover effect and cursor pointer for certificate cards
// =========================================================================
let html = fs.readFileSync('index.html', 'utf8');

// Ensure button wrap is hidden in CSS
if (!html.includes('.framer-1ptmnz5')) {
  html = html.replace(
    '</style>',
    '  .framer-1ptmnz5 { display: none !important; }\n  .framer-e41vzk-container { cursor: pointer !important; transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease !important; }\n  .framer-e41vzk-container:hover { transform: translateY(-4px) scale(1.01) !important; }\n</style>'
  );
}

// Add Coursera certificate click listener to index.html
const certScriptMarker = '// -----------------------------------------------------------------------';
const certClickHandler = `
    // -----------------------------------------------------------------------
    // Coursera Certificate Verification Click Handler
    // -----------------------------------------------------------------------
    var courseraLinks = {
      'data analytics': 'https://www.coursera.org/professional-certificates/google-data-analytics',
      'python': 'https://www.coursera.org/professional-certificates/google-it-automation-python',
      'advanced data': 'https://www.coursera.org/professional-certificates/google-advanced-data-analytics',
      'cybersecurity': 'https://www.coursera.org/professional-certificates/google-cybersecurity'
    };

    document.addEventListener('click', function(e) {
      var certCard = e.target.closest('.framer-e41vzk-container');
      if (certCard) {
        var text = certCard.textContent.toLowerCase();
        var targetUrl = null;
        for (var key in courseraLinks) {
          if (text.indexOf(key) !== -1) {
            targetUrl = courseraLinks[key];
            break;
          }
        }
        if (targetUrl) {
          e.preventDefault();
          e.stopPropagation();
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
      }
    }, true);
`;

if (!html.includes('courseraLinks')) {
  const insertPos = html.indexOf(certScriptMarker);
  if (insertPos !== -1) {
    html = html.slice(0, insertPos) + certClickHandler + '\n    ' + html.slice(insertPos);
    console.log('Added Coursera click delegation to index.html');
  }
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Saved index.html successfully!');
