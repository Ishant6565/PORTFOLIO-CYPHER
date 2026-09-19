const { spawnSync } = require('child_process');
const fs = require('fs');

console.log('--- Running Chrome to dump hydrated DOM ---');
const res = spawnSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless',
  '--disable-gpu',
  '--virtual-time-budget=5000',
  '--dump-dom',
  'http://localhost:3000/'
], { encoding: 'utf8', maxBuffer: 25 * 1024 * 1024 });

const dom = res.stdout || '';
console.log('Total DOM length:', dom.length);

console.log('\n=== CHECK 1: CERTIFICATES & GOOGLE LOGO ===');
const certLogos = dom.match(/\/images\/google-cert-logo\.png/g);
console.log('/images/google-cert-logo.png occurrences in DOM:', certLogos ? certLogos.length : 0);

const courseraMatches = dom.match(/Coursera/g);
console.log('Coursera occurrences in DOM:', courseraMatches ? courseraMatches.length : 0);

const titles = [
  'Google Data Analytics',
  'Google IT Automation with Python',
  'Google Advanced Data Analytics',
  'Google Cybersecurity'
];
titles.forEach(t => {
  console.log(`Title "${t}" in DOM:`, dom.includes(t));
});

// Check if any old avatar image remains in certificates
const oldAvatars = dom.match(/media_1789731192039|media_1789731200116|media_1789731208194|media_1789731815050|media_1789745123403|media_1789745138241/g);
console.log('Old photo occurrences in DOM:', oldAvatars ? oldAvatars.length : 0);

console.log('\n=== CHECK 2: GITHUB PROJECTS IN WORKS ===');
const githubMatches = dom.match(/https:\/\/github\.com\/Ishant6565\/[a-zA-Z0-9_-]+/g);
console.log('GitHub project links in DOM:');
const uniqueGh = [...new Set(githubMatches || [])];
console.log(uniqueGh);

// Check if any old LemonSqueezy / Framer template links remain
const oldLinks = dom.match(/https?:\/\/[^"'<>\s]*(?:lemonsqueezy|framer\.website|templyo)[^"'<>\s]*/gi);
console.log('Old template / store links in DOM:', oldLinks);

console.log('\n=== CHECK 3: POSTER LIGHTBOX MODAL ===');
console.log('poster-lightbox in DOM:', dom.includes('id="poster-lightbox"'));
console.log('lightbox-img in DOM:', dom.includes('id="lightbox-img"'));

console.log('\n=== CHECK 4: CYPHER FOOTER WATERMARK ===');
const cypherMatches = dom.match(/CYPHER/g);
console.log('CYPHER occurrences in DOM:', cypherMatches ? cypherMatches.length : 0);

// Inspect the footer structure in hydrated DOM
const footerIdx = dom.lastIndexOf('framer-3vb2n7');
if (footerIdx !== -1) {
  console.log('Hydrated framer-3vb2n7 element:\n', dom.slice(footerIdx - 20, footerIdx + 1200));
}
