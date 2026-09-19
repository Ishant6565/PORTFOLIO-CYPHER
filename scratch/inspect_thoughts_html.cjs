const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const p = html.indexOf('Thoughts &amp; Creative Art');
console.log('Thoughts &amp; Creative Art at', p);
if (p !== -1) {
  console.log(html.slice(p, p + 1200));
}
