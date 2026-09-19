const fs = require('fs');

const chunk = fs.readFileSync('public/chunks/avatar_chunk.mjs', 'utf8');

['LPDDziUSt', 'w2ZKyzhGF', 'r7HDjo09x'].forEach(id => {
  const p = chunk.indexOf('nodeId:`' + id + '`');
  if (p !== -1) {
    console.log('=== CARD', id, '===');
    console.log(chunk.slice(p, p + 700));
  }
});
