const { spawnSync } = require('child_process');

const res = spawnSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--virtual-time-budget=5000',
  '--dump-dom',
  'http://localhost:3000/'
], { encoding: 'utf8', maxBuffer: 25 * 1024 * 1024 });

const html = res.stdout || '';
const p = html.indexOf('Thoughts & Creative Art');
console.log('p:', p);
if (p !== -1) {
  console.log(html.slice(p - 100, p + 2500));
}
