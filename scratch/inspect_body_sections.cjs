const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const bodyStart = html.indexOf('<body');
const bodyEnd = html.indexOf('</body>');
const body = html.slice(bodyStart, bodyEnd);
const p = body.indexOf('Projects Section');
console.log('Projects Section in body index:', p);
if (p !== -1) {
  console.log(body.slice(p - 100, p + 600));
}
