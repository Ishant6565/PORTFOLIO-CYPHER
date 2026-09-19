const fs = require('fs');
let c = fs.readFileSync('public/chunks/script_main.mjs', 'utf8');
const badStr = '"--framer-line-height:`0.75em`,';
const goodStr = '"--framer-line-height":`0.75em`,';

if (c.includes(badStr)) {
  c = c.replace(badStr, goodStr);
  fs.writeFileSync('public/chunks/script_main.mjs', c, 'utf8');
  console.log('Successfully fixed syntax error in script_main.mjs!');
} else {
  console.log('badStr not found, checking context:');
  const p = c.indexOf('--framer-line-height');
  console.log(c.slice(p - 30, p + 60));
}
