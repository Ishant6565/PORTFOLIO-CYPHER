const { spawnSync } = require('child_process');

const res = spawnSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--virtual-time-budget=5000',
  '--dump-dom',
  'http://localhost:3000/'
], { encoding: 'utf8', maxBuffer: 25 * 1024 * 1024 });

const dom = res.stdout || '';

// Find where google-cert-logo is used
const matches = [];
let idx = 0;
while ((idx = dom.indexOf('google-cert-logo.png', idx)) !== -1) {
  const start = Math.max(0, idx - 250);
  const end = Math.min(dom.length, idx + 250);
  matches.push(dom.slice(start, end));
  idx += 20;
}

console.log(`Found ${matches.length} occurrences of google-cert-logo.png:`);
matches.slice(0, 3).forEach((m, i) => console.log(`\n--- Match ${i+1} ---\n`, m));
