import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import RollingText from './RollingText';
import { portfolioData } from '../data/portfolioData';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, navigation } = portfolioData;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 sm:px-8 ${
          isScrolled
            ? 'bg-paper/85 backdrop-blur-md border-b border-obsidian/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero-section"
            className="font-display text-xl sm:text-2xl font-bold tracking-tight text-obsidian flex items-center gap-2 group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-obsidian group-hover:bg-coral transition-colors duration-200" />
            <RollingText text={profile.logoText} className="font-bold tracking-wider" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-obsidian/10 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-1.5 text-sm font-sans text-obsidian/80 hover:text-obsidian transition-colors font-medium rounded-full hover:bg-obsidian/5"
              >
                <RollingText text={item.label} />
              </a>
            ))}
          </nav>

          {/* Status badge / Direct Action CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-obsidian/10 text-xs font-sans text-obsidian/80 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for projects</span>
            </div>

            <a
              href="#contact"
              className="group flex items-center gap-1.5 px-4 py-2 rounded-full bg-obsidian text-paper text-xs font-medium tracking-wide hover:bg-obsidian/90 transition-all duration-200 shadow-sm"
            >
              <RollingText text="Let's Talk" />
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full border border-obsidian/15 bg-white/80 text-obsidian hover:bg-obsidian/5 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-4 top-20 z-40 p-6 rounded-3xl bg-paper-light border border-obsidian/15 shadow-2xl md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-sans font-semibold text-obsidian hover:text-coral transition-colors py-2 border-b border-obsidian/5"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 text-center py-3 rounded-full bg-obsidian text-paper text-sm font-semibold hover:bg-obsidian/90 transition-colors"
              >
                Let's Talk
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
