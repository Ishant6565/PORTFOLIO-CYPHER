const fs = require('fs');

const chunk = fs.readFileSync('public/chunks/avatar_chunk.mjs', 'utf8');

['Awcs6rmjA', 'LPDDziUSt', 'w2ZKyzhGF', 'r7HDjo09x'].forEach(id => {
  const p = chunk.indexOf(id);
  console.log('ID:', id, 'at', p);
  if (p !== -1) {
    console.log(chunk.slice(p - 100, p + 250));
  }
});
