const fs = require('fs');

let chunk = fs.readFileSync('public/chunks/avatar_chunk.mjs', 'utf8');

// Ensure Card 1 has QlYM9XEjG explicitly passed
const card1Old = `FEOSCD2pf:\`Google Data Analytics\`,height:\`100%\`,id:\`Awcs6rmjA\`,imIplavjR:\`Coursera\`,layoutId:\`Awcs6rmjA\`,R9CRr7fB5:\`Professional Certificate\``;
const card1New = `FEOSCD2pf:\`Google Data Analytics\`,height:\`100%\`,id:\`Awcs6rmjA\`,imIplavjR:\`Coursera\`,layoutId:\`Awcs6rmjA\`,QlYM9XEjG:Q({pixelHeight:160,pixelWidth:160,src:\`/images/google-logo.svg\`,srcSet:\`/images/google-logo.svg\`},\`Google\`),R9CRr7fB5:\`Professional Certificate\``;

if (chunk.includes(card1Old)) {
  chunk = chunk.replace(card1Old, card1New);
  console.log('Explicitly added QlYM9XEjG to Card 1');
  fs.writeFileSync('public/chunks/avatar_chunk.mjs', chunk, 'utf8');
} else {
  console.log('Card 1 pattern not found, checking current snippet...');
}
