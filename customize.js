/**
 * Customize Your Framer Portfolio
 * Run: node customize.js
 * 
 * Edit the fields below with your own information, then run:
 * `node customize.js`
 * and your site will update instantly while keeping all exact animations!
 */

const fs = require('fs');

const myConfig = {
  // Your Name & Brand
  name: "Majd", // Change to your name e.g. "Ishan"
  logoText: "MAJD", // Change to e.g. "ISHAN"
  
  // Your Role & Headline
  role: "SOFTWARE ENGINEER",
  sinceYear: "/CREATING SINCE 2020",
  currentYear: "©2026",
  
  // Bio Section
  greeting: "Hey!",
  bioIntro: "I’m Majd, a builder based in Syria, currently working on Templyo, a platform for high-quality Framer templates.",
  bioParagraph1: "I’m a software engineer and Framer creator with a strong focus on building modern, scalable, and conversion-driven web experiences.",
  bioParagraph2: "Over the years, I’ve created and shipped multiple SaaS products and Framer templates used by global customers, helping them launch faster.",
  
  // Contact
  email: "mejed@templyo.io",
  
  // Avatar Photo URL (Leave as-is or put your own image URL)
  avatarUrl: "https://framerusercontent.com/images/haSjyjpt7FyCjJUBvXtmzCMSEQg.png?width=800&height=1072"
};

// Update index.html
let html = fs.readFileSync('index.html', 'utf8');

// Replace name & logo
html = html.replaceAll('Majd', myConfig.name);
html = html.replaceAll('MAJD', myConfig.logoText);

// Replace email
html = html.replaceAll('mejed@templyo.io', myConfig.email);
html = html.replaceAll('Mejed@Templyo.io', myConfig.email);

fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ Portfolio successfully updated with your details!');
