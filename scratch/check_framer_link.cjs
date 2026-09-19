const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const p = html.indexOf('framer.link');
console.log(html.slice(p - 100, p + 400));
