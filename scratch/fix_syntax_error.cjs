const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace any multiline unescaped string in mailto body
html = html.replace(
  /'From: '\s*\+\s*name\s*\+\s*'\s*\('\s*\+\s*email\s*\+\s*'\)[\s\S]*?'\s*\+\s*message/g,
  "'From: ' + name + ' (' + email + ') - ' + message"
);

fs.writeFileSync('index.html', html, 'utf8');

// Now test syntax!
const scriptStart = html.lastIndexOf('<script>');
const scriptEnd = html.lastIndexOf('</script>');
const scriptContent = html.slice(scriptStart + 8, scriptEnd);

try {
  new Function(scriptContent);
  console.log('SUCCESS: Script is 100% valid JavaScript!');
} catch (e) {
  console.error('JS Syntax Error still:', e.message);
  // Find where
  const lines = scriptContent.split('\n');
  for (let i = 0; i < lines.length; i++) {
    try {
      new Function(lines.slice(0, i + 1).join('\n') + '\n})();');
    } catch (err) {
      if (err.message.includes('Unexpected end of input') || err.message.includes('missing ) after argument list')) {
        // expected when code is incomplete
      } else {
        console.log(`Potential issue around line ${i + 1}: ${err.message}`);
        console.log(lines[i]);
      }
    }
  }
}
