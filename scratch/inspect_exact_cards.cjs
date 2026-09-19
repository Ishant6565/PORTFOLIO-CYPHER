const fs = require('fs');
const code = fs.readFileSync('scratch/original_avatar_chunk.mjs', 'utf8');

['LPDDziUSt', 'w2ZKyzhGF', 'r7HDjo09x'].forEach(id => {
  const idx = code.indexOf(id);
  const end = code.indexOf('})})})})', idx);
  console.log('=== ' + id + ' ===');
  console.log(code.substring(idx, end));
});
