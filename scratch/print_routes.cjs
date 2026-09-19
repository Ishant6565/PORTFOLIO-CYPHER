const fs = require('fs');
const c = fs.readFileSync('public/chunks/script_main.mjs', 'utf8');
const p = c.indexOf('CcTy8bqan:');
console.log('Routes in script_main:');
console.log(c.slice(p - 200, p + 600));
