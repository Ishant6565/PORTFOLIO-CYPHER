const fs = require('fs');

// Let's create an HTML file that renders the 4 footer buttons with different Pinterest options
const html = `
<!DOCTYPE html>
<html>
<head>
<style>
  body { background: #faf7f3; font-family: sans-serif; padding: 40px; }
  .row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
  .label { width: 140px; font-weight: bold; font-size: 14px; }
  .btn {
    width: 40px; height: 40px; border-radius: 8px; background: rgba(0,0,0,0.08);
    display: flex; align-items: center; justify-content: center;
  }
  svg { width: 20px; height: 20px; }
</style>
</head>
<body>
  <h2>Social Icons Alignment Test</h2>
  
  <!-- Current X, IG, LinkedIn -->
  <div class="row">
    <div class="label">Reference (X, IG, LI):</div>
    <!-- X -->
    <div class="btn">
      <svg viewBox="0 0 24 24"><path d="M 7.111 10 L 0 18 M 16 0 L 10.09 6.649 M 0 0 L 13 18 L 18 18 L 5 0 Z" fill="transparent" stroke-width="2" stroke="#111" stroke-linecap="round" stroke-linejoin="round" transform="translate(3 3)"/></svg>
    </div>
    <!-- IG -->
    <div class="btn">
      <svg viewBox="0 0 24 24"><path d="M 16 4.022 L 16 4 M 4 20 L 16 20 C 18.209 20 20 18.209 20 16 L 20 4 C 20 1.791 18.209 0 16 0 L 4 0 C 1.791 0 0 1.791 0 4 L 0 16 C 0 18.209 1.791 20 4 20 Z M 14.444 10 C 14.444 12.455 12.455 14.444 10 14.444 C 7.545 14.444 5.556 12.455 5.556 10 C 5.556 7.545 7.545 5.556 10 5.556 C 12.455 5.556 14.444 7.545 14.444 10 Z" fill="transparent" stroke-width="2" stroke="#111" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 2)"/></svg>
    </div>
    <!-- LI -->
    <div class="btn">
      <svg viewBox="0 0 24 24"><path d="M 4 2 C 4 3.105 3.105 4 2 4 C 0.895 4 0 3.105 0 2 C 0 0.895 0.895 0 2 0 C 3.105 0 4 0.895 4 2 Z" fill="transparent" stroke-width="2" stroke="#111" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 2)"/><path d="M 0 0 L 4 0 L 4 13 L 0 13 Z" fill="transparent" stroke-width="2" stroke="#111" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 9)"/><path d="M 0 13 L 4 13 L 4 6 C 4 4.895 4.895 4 6 4 C 7.105 4 8 4.895 8 6 L 8 13 L 12 13 L 12 6 C 12 2.686 9.314 0 6 0 C 2.686 0 0 2.686 0 6 Z" fill="transparent" stroke-width="2" stroke="#111" stroke-linecap="round" stroke-linejoin="round" transform="translate(10 9)"/></svg>
    </div>
  </div>

  <!-- Option 1: Tabler Outline -->
  <div class="row">
    <div class="label">Option 1 (Tabler Outline):</div>
    <div class="btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 20l4 -9" />
        <path d="M10.7 14c.437 1.263 1.43 2 2.55 2c2.071 0 3.75 -1.554 3.75 -4a5 5 0 1 0 -9.7 1.7" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    </div>
  </div>

  <!-- Option 2: Sleek Red Badge Pinterest (like official Pinterest) -->
  <div class="row">
    <div class="label">Option 2 (Official Red Badge):</div>
    <div class="btn" style="background:#E60023;">
      <svg viewBox="0 0 24 24" fill="#ffffff">
        <path d="M12 0a12 12 0 0 0-4.37 23.18c-.05-.95-.1-2.42.02-3.46l1.32-5.6s-.34-.67-.34-1.66c0-1.56.9-2.72 2.03-2.72.96 0 1.42.72 1.42 1.58 0 .96-.61 2.4-1 3.73-.26 1.12.56 2.03 1.66 2.03 2 0 3.53-2.1 3.53-5.14 0-2.69-1.93-4.57-4.69-4.57-3.2 0-5.07 2.4-5.07 4.88 0 .96.37 2 1.03 2.56.09.11.1.2.08.35l-.31 1.28c-.05.2-.16.25-.38.15-1.4-.65-2.28-2.7-2.28-4.34 0-3.54 2.57-6.79 7.41-6.79 3.89 0 6.92 2.77 6.92 6.48 0 3.86-2.44 6.97-5.82 6.97-1.14 0-2.2-.6-2.57-1.3l-.7 2.66c-.25.98-.93 2.2-1.39 2.95A12 12 0 1 0 12 0z"/>
      </svg>
    </div>
  </div>

  <!-- Option 3: Seamless Outline Monoline Pinterest -->
  <div class="row">
    <div class="label">Option 3 (Monoline Pure 'P'):</div>
    <div class="btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 20c.5-3 1.5-6.5 2.5-10" />
        <path d="M10.5 10c1.5-2 3.5-2.5 5.5-1.5 2 1 2.5 3.5 1.5 6-1 2.5-3.5 3.5-5.5 2.5-.8-.4-1.3-1-1.5-1.8" />
        <rect x="2" y="2" width="20" height="20" rx="6" />
      </svg>
    </div>
  </div>

  <!-- Option 4: Circle Badge with White P in dark theme matching other buttons -->
  <div class="row">
    <div class="label">Option 4 (Outline Circle with authentic Pinterest P curve):</div>
    <div class="btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M9 20l3-8.5" />
        <path d="M10.8 13.8c.6 1.4 1.8 1.8 3 1.4 1.8-.6 2.7-2.5 2.4-4.5-.4-2.4-2.5-3.5-4.8-2.9-2 .5-3.2 2.3-2.6 4.3" />
      </svg>
    </div>
  </div>
</body>
</html>
`;

fs.writeFileSync('scratch/pinterest_preview.html', html);
console.log('Saved scratch/pinterest_preview.html');
