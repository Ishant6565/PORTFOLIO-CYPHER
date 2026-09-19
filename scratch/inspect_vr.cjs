const fs = require('fs');
const code = fs.readFileSync('scratch/original_avatar_chunk.mjs', 'utf8');

const idx = code.indexOf('function vr(');
if (idx !== -1) {
  console.log(code.substring(idx, idx + 400));
} else {
  const p = code.indexOf('vr=');
  console.log('vr= at:', p);
  if (p !== -1) console.log(code.substring(p - 20, p + 300));
}
