/**
 * Portfolio Data Configuration
 * All content for the website is defined here.
 * You can easily customize any name, text, images, or links to make it your own!
 */

export const portfolioData = {
  profile: {
    name: "Ishant Gupta",
    logoText: "ISHANT",
    role: "SOFTWARE ENGINEER",
    subRole: "Framer Creator & Full-stack Builder",
    status: "/CREATING SINCE 2020",
    yearBadge: "©2026",
    location: "Kolkata, West Bengal, India",
    availableForWork: true,
    avatar: {
      front: "/images/avatar-front.jpg",
      back: "/images/avatar-back.jpg",
      holoElement: "/images/logo-spiderlily.png"
    }
  },

  navigation: [
    { label: "Home", href: "#hero-section" },
    { label: "About Me", href: "#bio-section" },
    { label: "Services", href: "#services" },
    { label: "Works", href: "#work" },
    { label: "Contact", href: "#contact" }
  ],

  bio: {
    greeting: "Hey!",
    introHeading: "I’m Ishant Gupta, a builder based in Kolkata, West Bengal, India, currently working on Templyo, a platform for high-quality Framer templates.",
    paragraph1: "I’m a software engineer and Framer creator with a strong focus on building modern, scalable, and conversion-driven web experiences.",
    paragraph2: "Over the years, I’ve created and shipped multiple SaaS products and Framer templates used by global customers, helping them launch faster.",
    ctaText: "Get Started",
    ctaLink: "#contact"
  },

  quote: {
    preamble: "From idea to launch.",
    main: "Clean, scalable digital products built to move fast, stay simple, and perform in real-world use, driven by clarity, structured systems, and intentional design."
  },

  services: [
    {
      id: "web-migration",
      number: "01",
      title: "Website Migration",
      description: "Seamlessly transition your existing website into modern, lightning-fast web frameworks or Framer without losing SEO rankings or brand equity.",
      tags: ["Web Migration", "Optimization", "Framer Rebuild"]
    },
    {
      id: "framer-templates",
      number: "02",
      title: "Framer Templates",
      description: "Crafting pixel-perfect, conversion-optimized Framer templates designed to scale with dynamic CMS, responsive layouts, and rich animations.",
      tags: ["Startup", "Agency", "SaaS"]
    },
    {
      id: "frontend-dev",
      number: "03",
      title: "Frontend Development",
      description: "Building production-ready user interfaces with high performance standards, fluid responsive design, and smooth 60fps micro-interactions.",
      tags: ["UI Dev", "Responsive Layouts", "Web Performance"]
    },
    {
      id: "product-consulting",
      number: "04",
      title: "Product Consulting",
      description: "Strategic guidance on product direction, web architecture, and design systems to position your digital brand for market growth.",
      tags: ["Product Direction", "Web Strategy", "Technical Guidance"]
    }
  ],

  projects: [
    {
      id: "damas",
      title: "Stock Pulse",
      category: "Agency Framer Template",
      year: "2025",
      description: "A refined, dark-mode agency portfolio template engineered for design studios and creative digital agencies wanting a distinct editorial presence.",
      image: "https://framerusercontent.com/images/VNXQLcPHw9VbVzy6BDpZ8pUsaU.png?width=1160&height=800",
      link: "https://framer.link/nnhGcWR",
      tags: ["Framer", "Agency", "Editorial"]
    },
    {
      id: "najm",
      title: "Sales Analytics",
      category: "SaaS Framer Template",
      year: "2025",
      description: "High-converting SaaS landing page with pre-built feature sections, pricing calculators, interactive demos, and customer testimonial carousels.",
      image: "https://framerusercontent.com/images/WgEHVRrQs62rgxlzrnXJJ8rr4.png?width=1160&height=800",
      link: "https://framer.link/nnhGcWR",
      tags: ["SaaS", "Product", "Conversion"]
    },
    {
      id: "kavi",
      title: "Breed Vision AI",
      category: "AI Framer Template",
      year: "2024",
      description: "Futuristic, glow-accented web experience tailored for artificial intelligence startups, LLM products, and intelligent developer tools.",
      image: "https://framerusercontent.com/images/I3azeVtkvdKBGl9TX38tUdXEb0.png?width=1160&height=800",
      link: "https://framer.link/nnhGcWR",
      tags: ["AI", "Tech", "3D Motion"]
    },
    {
      id: "sham",
      title: "Python Full-Stack",
      category: "Studio Framer Template",
      year: "2024",
      description: "Clean typography-driven portfolio framework highlighting case studies, client rosters, and service offerings with frictionless UX.",
      image: "https://framerusercontent.com/images/e3DxUGJWqt7CIVVQIA0VZoy09FQ.png?width=1160&height=800",
      link: "https://framer.link/nnhGcWR",
      tags: ["Studio", "Branding", "Minimal"]
    }
  ],

  testimonials: [
    {
      id: 1,
      quote: "Templyo completely changed how I approach building sites in Framer. The templates are not just beautiful, they’re actually structured in a way that makes scaling so much easier.",
      name: "Yakoub Kashmiri",
      role: "Marketing Director",
      avatar: "https://framerusercontent.com/images/MG7SSqT3AUbDDMeyGynYFWvAWI.png?width=160&height=160",
      company: "Apex Media"
    },
    {
      id: 2,
      quote: "I’ve tried dozens of Framer templates, but Templyo stands out. Everything feels intentional, from the layout to the smallest interactions.",
      name: "Daniel K.",
      role: "Indie Maker",
      avatar: "https://framerusercontent.com/images/yceQCLz3chOtgu2oZRjmfEKjY.png?width=160&height=160",
      company: "BuildCraft"
    },
    {
      id: 3,
      quote: "Templyo saved our launch timeline by 3 weeks. The attention to detail in the responsive behavior and micro-interactions is world class.",
      name: "Sarah L.",
      role: "Head of Product",
      avatar: "https://framerusercontent.com/images/gN85dqTeMmVvE57UMiHhgeL4P4.png?width=196&height=160",
      company: "Lumina Labs"
    }
  ],

  thoughts: [
    {
      id: 1,
      date: "May 5, 2025",
      title: "Building Trust Through Clear Design",
      description: "How thoughtful visual choices create a stronger sense of reliability for modern brands.",
      image: "https://framerusercontent.com/images/lxtBXj3G7Bloek83WxPY1ZUuw0Q.png?width=640&height=360",
      readTime: "4 min read"
    },
    {
      id: 2,
      date: "Jun 16, 2025",
      title: "The Role of Art Direction in Branding",
      description: "Why visual direction helps brands create emotion and a distinct point of view.",
      image: "https://framerusercontent.com/images/ic9k42rYytbJtnRUJXdcNxCHSc.png?width=640&height=359",
      readTime: "6 min read"
    },
    {
      id: 3,
      date: "Aug 22, 2025",
      title: "How Creative Teams Build Strong Brand Systems",
      description: "Developing cohesive design languages that scale gracefully across platforms.",
      image: "https://framerusercontent.com/images/MWSFsHfw8FDzKSMZllibGDMY4CU.png?width=640&height=360",
      readTime: "5 min read"
    }
  ],

  contact: {
    heading: "Let’s talk.",
    subheading: "Have a project or need help? Fill out the form, and we'll get back to you soon.",
    email: "ishantgupta6094@gmail.com",
    socials: [
      { name: "X (Twitter)", href: "https://x.com/", handle: "@cypher" },
      { name: "Instagram", href: "https://www.instagram.com/", handle: "@cypher.builds" },
      { name: "LinkedIn", href: "https://www.linkedin.com/", handle: "cypher-engineer" },
      { name: "YouTube", href: "https://www.youtube.com/", handle: "@cypher-creations" }
    ]
  },

  footer: {
    tagline: "Solving Real-World Problems with Code & Data.",
    copyright: "© 2026 Ishant Gupta. All rights reserved."
  }
};
