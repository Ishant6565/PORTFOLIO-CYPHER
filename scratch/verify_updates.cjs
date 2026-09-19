const fs = require('fs');

const chunk = fs.readFileSync('public/chunks/avatar_chunk.mjs', 'utf8');
const scriptMain = fs.readFileSync('public/chunks/script_main.mjs', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

console.log('--- VERIFICATION RESULTS ---');
console.log('1. Coursera Certificates:');
console.log('   Google Data Analytics in chunk:', chunk.includes('Google Data Analytics'));
console.log('   Google IT Automation in chunk:', chunk.includes('Google IT Automation'));
console.log('   Google Advanced Data Analytics in chunk:', chunk.includes('Google Advanced Data Analytics'));
console.log('   Google Cybersecurity in chunk:', chunk.includes('Google Cybersecurity'));
console.log('   Section title "Licenses & Certifications":', chunk.includes('Licenses & Certifications'));
console.log('   google-logo.svg in chunk:', chunk.includes('/images/google-logo.svg'));

console.log('2. Pinterest Link:');
console.log('   Pinterest URL in chunk:', chunk.includes('https://in.pinterest.com/ishantgupta6094/'));
console.log('   Pinterest URL in HTML:', html.includes('https://in.pinterest.com/ishantgupta6094/'));

console.log('3. Thoughts & Art (8 Items):');
const thoughtImages = [
  'batman-rainy.jpg',
  'jinx-arcane.jpg',
  'dark-knight-collage.jpg',
  'solo-leveling-jinwoo.jpg',
  'naruto-team-7.jpg',
  'miles-morales-graffiti.jpg',
  'spider-man-collage.jpg',
  'lana-del-rey.jpg'
];
thoughtImages.forEach(img => {
  console.log(`   ${img}: chunk=${chunk.includes(img)}, html=${html.includes(img)}, fileExists=${fs.existsSync('public/thoughts/' + img)}`);
});

console.log('4. CYPHER Watermark Edge-to-Edge:');
console.log('   textLength in HTML:', html.includes('textLength="1000"'));
console.log('   viewBox in HTML:', html.includes('viewBox="0 0 1000 165"'));
console.log('   zero bottom padding in script_main:', scriptMain.includes('padding: 80px 0px 0px 0px;'));
console.log('   zero bottom padding in HTML:', html.includes('padding-bottom: 0px !important;'));
