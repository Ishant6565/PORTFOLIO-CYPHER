const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

['Thoughts', 'thoughts', 'Skills', 'Education', 'framer-1leqxa3'].forEach(k => {
  let p = 0;
  while ((p = html.indexOf(k, p)) !== -1) {
    console.log('Found', k, 'at', p, html.slice(p - 30, p + 70));
    p += k.length;
  }
});
