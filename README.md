# PORTFOLIO-CYPHER

Personal portfolio of Ishant Gupta featuring IT Engineering, Generative AI projects, Licenses & Certifications, and a curated gallery of 15 high-contrast Graphic Design & Manga posters. Built with Framer Motion, React, and Vite.

---

## 🌟 Key Features

1. **Exact Design & Aesthetics**:
   - Palette: Editorial warm cream (`#faf7f3`), deep obsidian black (`#111111`), and vibrant coral accent (`#eb4d6d`).
   - Webfonts: **Archivo**, **Clash Grotesk**, and **Inter**.
   - Subtle glassmorphic cards with frosted backdrop blurs and hairline borders.

2. **Signature Framer Interactions**:
   - **Rolling Text Hover**: Menu buttons, project links, and navigation items smoothly roll characters up on hover.
   - **Sticky Avatar & Bio Transition**: Pinned creator avatar alongside the Hero and `#bio-section` with interactive 3D tilt.
   - **Kinetic Quote Scroll Reveal**: Progressive word-by-word reveal as you scroll down the page.
   - **Interactive Bento & Services Cards**: Hover elevation and category badges.
   - **Contact Inquiry Form**: Interactive form with live validation and confetti celebratory animation upon submission.

3. **100% Modular & Customizable**:
   - All website text, headings, avatar, images, services, projects, client testimonials, articles, and social links are managed in a single file:  
     `src/data/portfolioData.js`
   - You can replace Majd's information with your own in seconds!

---

## 🚀 Getting Started

### 1. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 2. Build for Production
```bash
npm run build
```
Generates an optimized static bundle in the `dist/` directory ready for deployment on **Vercel**, **Netlify**, or **GitHub Pages**.

---

## 📂 Project Architecture

```text
├── src/
│   ├── components/
│   │   ├── BioSection.jsx          # Exact #bio-section with greeting, story & avatar
│   │   ├── ContactSection.jsx      # "Let's talk" project inquiry form & socials
│   │   ├── Footer.jsx              # Tagline, quick links & giant watermark logo
│   │   ├── HeroSection.jsx         # Big display typography & holographic badge
│   │   ├── Navbar.jsx              # Floating pill header with rolling text & mobile drawer
│   │   ├── ProjectsSection.jsx     # Featured work grid (Damas, Najm, Kavi, Sham)
│   │   ├── QuoteSection.jsx        # Kinetic typography scroll-reveal section
│   │   ├── RollingText.jsx         # Framer signature dual-layer rolling text animation
│   │   ├── ServicesSection.jsx     # 4 interactive service bento cards
│   │   ├── TestimonialsSection.jsx # Client reviews & verified badges
│   │   └── ThoughtsSection.jsx     # Editorial perspective articles
│   ├── data/
│   │   └── portfolioData.js        # Centralized config for ALL text, images & links
│   ├── App.jsx                     # Root application shell
│   ├── index.css                   # Global styles & custom scrollbars
│   └── main.jsx                    # React entrypoint
├── index.html                      # HTML with webfonts & SEO metadata
├── tailwind.config.js              # Custom tokens & typography config
├── vite.config.js                  # Vite bundler configuration
└── package.json                    # Project dependencies
```

---

## 🎨 How to Customize With Your Own Info

Open [`src/data/portfolioData.js`](src/data/portfolioData.js) and update:
- `profile.name` & `profile.logoText`
- `profile.avatar.front` (your own photo URL)
- `bio.introHeading`, `bio.paragraph1`, `bio.paragraph2`
- `services` (your own offerings)
- `projects` (your own case studies and links)
- `contact.email` & `contact.socials`
>>>>>>> 06058b2 (feat: complete portfolio cypher with 15 posters gallery, coursera certification links, and responsive lightbox)
