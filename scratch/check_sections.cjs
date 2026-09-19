const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
console.log('HTML length:', html.length);
console.log('Does HTML contain Licenses?', html.includes('Licenses'));
console.log('Does HTML contain Thoughts?', html.includes('Thoughts'));
console.log('Does HTML contain Projects Section?', html.includes('Projects Section'));
console.log('Does HTML contain Services?', html.includes('Services'));
console.log('Does HTML contain Testimonials?', html.includes('Testimonials'));
