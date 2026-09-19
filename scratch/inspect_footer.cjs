const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const p = html.indexOf('framer-soKIl');
console.log('framer-soKIl position:', p);
if (p !== -1) {
  console.log(html.slice(p, p + 2500));
}
