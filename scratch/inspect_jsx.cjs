const fs = require('fs');
const code = fs.readFileSync('public/chunks/script_main.mjs', 'utf8');
const regex = /f\([`'"]svg[`'"]/g;
let m = regex.exec(code);
if (m) {
  console.log('Found f(svg):', code.slice(m.index, m.index + 200));
} else {
  console.log('No direct f(svg) found');
}
