import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowDown } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function HeroSection() {
  const { profile } = portfolioData;

  return (
    <section
      id="hero-section"
      className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center items-center text-center pt-28 pb-16 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background radial accent glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-amber-100/40 via-rose-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Year & Creation Since Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="px-3.5 py-1 rounded-full bg-obsidian text-paper text-xs font-mono font-medium tracking-wider shadow-sm">
            {profile.yearBadge}
          </span>
          <span className="text-xs sm:text-sm font-mono font-semibold tracking-widest text-obsidian/70 uppercase">
            {profile.status}
          </span>
        </motion.div>

        {/* Massive Display Title */}
        <div className="relative my-2 select-none">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tight text-obsidian uppercase leading-[0.9]"
          >
            SOFTWARE
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tight text-obsidian/90 uppercase leading-[0.9] mt-2 sm:mt-4"
          >
            ENGINEER
          </motion.h1>

          {/* 3D Holographic decorative element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:block absolute -right-6 -bottom-6 lg:-right-14 lg:-bottom-10 w-24 h-24 lg:w-32 lg:h-32 pointer-events-none"
          >
            <motion.img
              animate={{
                y: [-6, 6, -6],
                rotate: [0, 4, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              src={profile.avatar.holoElement}
              alt="Holographic Decorative"
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </motion.div>
        </div>

        {/* Subtitle & Role Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-8 max-w-xl text-base sm:text-lg text-obsidian/60 font-sans leading-relaxed"
        >
          {profile.subRole} crafting digital products that combine intentional design with engineering precision.
        </motion.p>

        {/* Scroll down prompt */}
        <motion.a
          href="#bio-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-col items-center gap-2 text-xs font-mono text-obsidian/40 hover:text-obsidian transition-colors group"
        >
          <span>EXPLORE BIO</span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="p-2 rounded-full border border-obsidian/10 group-hover:border-obsidian/30 transition-colors"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </motion.div>
        </motion.a>
      </div>
    </section>
  );
}
