const fs = require('fs');

let code = fs.readFileSync('public/chunks/script_main.mjs', 'utf8');

const target = 'let e=document.getElementById(`main`);`framerHydrateV2`in e.dataset?nr(!0,e):nr(!1,e)';
const replacement = 'let e=document.getElementById(`main`);let _isSub=location.pathname.startsWith(`/blog`);if(_isSub&&e){delete e.dataset.framerHydrateV2;e.innerHTML=``;nr(!1,e)}else{`framerHydrateV2`in e.dataset?nr(!0,e):nr(!1,e)}';

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('public/chunks/script_main.mjs', code, 'utf8');
  console.log('Successfully patched script_main.mjs for /blog routing!');
} else {
  console.error('Target still not found!');
}
