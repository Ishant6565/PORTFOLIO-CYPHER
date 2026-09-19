const fs = require('fs');
const code = fs.readFileSync('scratch/original_avatar_chunk.mjs', 'utf8');

const idx = code.indexOf('"data-framer-name":`Projects Section`');
console.log(code.substring(idx, idx + 2500));
