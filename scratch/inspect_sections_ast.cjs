const fs = require('fs');
const code = fs.readFileSync('scratch/original_avatar_chunk.mjs', 'utf8');

const regex = /data-framer-name\":\`([^`]+)\`/g;
let m;
const names = new Set();
while ((m = regex.exec(code)) !== null) {
  names.add(m[1]);
}
console.log('Framer names:', Array.from(names));
