const fs = require('fs');

const chunk = fs.readFileSync('public/chunks/avatar_chunk.mjs', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

console.log('--- CERTIFICATE CARDS CHECK ---');
console.log('Google Data Analytics at top:', chunk.includes('FEOSCD2pf:`Google Data Analytics`'));
console.log('Google IT Automation at top:', chunk.includes('FEOSCD2pf:`Google IT Automation with Python`'));
console.log('Google Advanced Data Analytics at top:', chunk.includes('FEOSCD2pf:`Google Advanced Data Analytics`'));
console.log('Google Cybersecurity at top:', chunk.includes('FEOSCD2pf:`Google Cybersecurity`'));
console.log('Coursera at bottom count:', (chunk.match(/imIplavjR:`Coursera`/g) || []).length);
console.log('Any person photos remaining:', chunk.includes('kAftu') || chunk.includes('HqoHk') || chunk.includes('Y9KmJAQ4w53hsc4jJojfokLZ7D8') || chunk.includes('HH8KrojyxZx6X20z1r13CSwiiWE'));

console.log('\n--- FOOTER CSS CHECK ---');
console.log('Has Exact Screenshot 2 Footer Layout:', html.includes('Exact Screenshot 2 Footer Layout'));
console.log('Footer padding 140px 0 280px 0:', html.includes('140px 0 280px 0'));
console.log('Watermark bottom -30px:', html.includes('bottom: -30px'));
