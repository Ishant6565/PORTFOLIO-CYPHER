const fs = require('fs');

let orig = fs.readFileSync('scratch/blog_chunk_original.mjs', 'utf8');

const sIdx = orig.indexOf('framer-bv39vk');
const eIdx = orig.indexOf('overlay');

console.log('sIdx (bv39vk):', sIdx);
console.log('eIdx (overlay):', eIdx);

// Let's print from 30 chars before sIdx to 10 chars after eIdx
console.log('--- EXACT SLICE ---');
console.log(orig.slice(sIdx - 30, eIdx + 30));
