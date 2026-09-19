const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

let p = 0;
while ((p = html.indexOf('href="https://', p)) !== -1) {
  console.log(html.slice(p, p + 100));
  p += 15;
}
