import React from 'react';
import { ArrowUp, Heart } from 'lucide-react';
import RollingText from './RollingText';
import { portfolioData } from '../data/portfolioData';

export default function Footer() {
  const { profile, navigation, footer, contact } = portfolioData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="pt-20 pb-12 px-4 sm:px-8 border-t border-obsidian/10 bg-paper overflow-hidden relative">
      <div className="max-w-6xl mx-auto">
        {/* Upper Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-obsidian/10">
          
          {/* Col 1: Big Tagline */}
          <div className="md:col-span-6">
            <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-obsidian tracking-tight leading-tight mb-4">
              {footer.tagline}
            </h3>
            <p className="text-sm sm:text-base text-obsidian/60 max-w-md font-sans">
              Building modern, scalable, and conversion-driven web experiences for global teams.
            </p>
          </div>

          {/* Col 2: Quick Links with signature rolling text */}
          <div className="md:col-span-3">
            <span className="text-xs font-mono text-obsidian/40 uppercase tracking-widest block mb-4">
              / Quick Links
            </span>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-base font-sans font-medium text-obsidian/80 hover:text-obsidian transition-colors"
                  >
                    <RollingText text={item.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Direct Contact & Back to Top */}
          <div className="md:col-span-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-obsidian/40 uppercase tracking-widest block mb-4">
                / Contact
              </span>
              <a
                href={`mailto:${contact.email}`}
                className="text-base font-sans font-semibold text-obsidian hover:text-coral transition-colors block mb-4"
              >
                <RollingText text={contact.email} />
              </a>
              <span className="text-xs font-mono text-obsidian/50 block">
                Open to full-time roles & high-impact projects.
              </span>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-8 self-start group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-obsidian/15 hover:border-obsidian text-xs font-mono text-obsidian bg-white/60 hover:bg-obsidian hover:text-paper transition-all"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
            </button>
          </div>

        </div>

        {/* Lower Footer: Copyright */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-obsidian/50 gap-4">
          <p>{footer.copyright}</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-coral fill-coral" />
            <span>in React & Framer Motion</span>
          </div>
        </div>

        {/* Giant Bottom Brand Watermark */}
        <div className="pt-6 text-center select-none pointer-events-none opacity-10">
          <span className="font-display font-black text-6xl sm:text-9xl md:text-[14rem] lg:text-[18rem] uppercase tracking-tighter text-obsidian leading-none block">
            {profile.logoText}
          </span>
        </div>
      </div>
    </footer>
  );
}
