const { spawnSync } = require('child_process');

const evalScript = `
  const footer = document.querySelector('.framer-788ly6, footer');
  const watermark = document.querySelector('.framer-3vb2n7');
  const svg = watermark ? watermark.querySelector('svg') || watermark : null;
  const text = watermark ? watermark.querySelector('text, p') : null;
  const links = document.querySelector('.framer-91t2w3, .framer-1a7657t, .framer-1d3826y');

  const getR = el => el ? el.getBoundingClientRect() : null;
  const getComputed = el => el ? window.getComputedStyle(el) : null;

  console.log(JSON.stringify({
    viewport: { width: window.innerWidth, height: window.innerHeight },
    footer: { rect: getR(footer), paddingBottom: getComputed(footer)?.paddingBottom, height: getComputed(footer)?.height },
    watermark: { rect: getR(watermark), bottom: getComputed(watermark)?.bottom, position: getComputed(watermark)?.position, transform: getComputed(watermark)?.transform },
    svg: { rect: getR(svg) },
    text: { rect: getR(text), fontSize: getComputed(text)?.fontSize, text: text?.textContent?.trim() },
    pageHeight: document.documentElement.scrollHeight
  }));
`;

const res = spawnSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless',
  '--disable-gpu',
  '--virtual-time-budget=5000',
  '--run-all-compositor-stages-before-draw',
  '--window-size=1440,900',
  'http://localhost:3000/'
], { encoding: 'utf8' });

// We can run a small local script that connects to Chrome DevTools Protocol or extracts computed values
console.log('Done');
