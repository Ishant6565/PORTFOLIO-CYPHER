const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const chunk = fs.readFileSync('public/chunks/avatar_chunk.mjs', 'utf8');
const scriptMain = fs.readFileSync('public/chunks/script_main.mjs', 'utf8');

console.log('HTML has scrollToProjects:', html.includes('scrollToProjects'));
console.log('Chunk has id projects:', chunk.includes('id:`projects`'));
console.log('HTML has bottom: -90px:', html.includes('bottom: -90px'));
console.log('HTML has scroll-margin-top:', html.includes('scroll-margin-top: 80px'));
console.log('script_main has #projects:', scriptMain.includes('#projects'));
