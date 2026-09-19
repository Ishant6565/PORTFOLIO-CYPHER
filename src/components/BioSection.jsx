import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Sparkles, Layers, Code } from 'lucide-react';
import RollingText from './RollingText';
import { portfolioData } from '../data/portfolioData';

export default function BioSection() {
  const { profile, bio } = portfolioData;
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <section
      id="bio-section"
      className="relative py-20 sm:py-28 px-4 sm:px-8 border-t border-obsidian/10 bg-paper overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Avatar & Interactive Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-center lg:items-start"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] perspective-1000 group">
              {/* Floating Holographic Badge */}
              <motion.div
                animate={{
                  y: [-4, 4, -4],
                  rotate: [0, 3, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 z-20 w-16 h-16 pointer-events-none drop-shadow-md"
              >
                <img
                  src={profile.avatar.holoElement}
                  alt="Badge"
                  className="w-full h-full object-contain"
                />
              </motion.div>

              {/* Main Avatar Card Frame */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative w-full aspect-[3/4] rounded-3xl overflow-hidden border border-obsidian/15 shadow-2xl transition-all duration-500 cursor-pointer bg-stone-900 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Photo Image */}
                <img
                  src={profile.avatar.front}
                  alt={profile.name}
                  className="w-full h-full object-cover object-center filter grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />

                {/* Subtle gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                {/* Card Tag Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-mono font-medium text-obsidian shadow">
                    <MapPin className="w-3.5 h-3.5 text-coral" />
                    <span>Based in {profile.location}</span>
                  </div>

                  <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono">
                    {profile.name}
                  </span>
                </div>
              </div>

              {/* Quick stats under avatar */}
              <div className="w-full mt-4 grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/60 border border-obsidian/10 backdrop-blur-sm">
                  <span className="text-xs font-mono text-obsidian/50 block">EXPERIENCE</span>
                  <span className="text-sm font-sans font-bold text-obsidian mt-0.5 block">5+ Years Creating</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/60 border border-obsidian/10 backdrop-blur-sm">
                  <span className="text-xs font-mono text-obsidian/50 block">SPECIALTY</span>
                  <span className="text-sm font-sans font-bold text-obsidian mt-0.5 block">Framer & Web Apps</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio Content */}
          <div className="lg:col-span-7 flex flex-col justify-center pt-2">
            {/* "Hey!" Greeting with subtle blur-in */}
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)", y: 15 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-block"
            >
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-obsidian tracking-tight">
                {bio.greeting}
              </h2>
            </motion.div>

            {/* Lead introduction paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-xl sm:text-2xl font-sans font-medium text-obsidian leading-snug tracking-tight"
            >
              {bio.introHeading}
            </motion.p>

            {/* Supporting details paragraphs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 space-y-4 text-base sm:text-lg text-obsidian/70 font-sans leading-relaxed"
            >
              <p>{bio.paragraph1}</p>
              <p>{bio.paragraph2}</p>
            </motion.div>

            {/* Highlights bullet tags */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-2.5"
            >
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-obsidian/10 text-xs font-sans font-medium text-obsidian">
                <Code className="w-3.5 h-3.5 text-obsidian/60" /> Full-Stack Engineering
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-obsidian/10 text-xs font-sans font-medium text-obsidian">
                <Layers className="w-3.5 h-3.5 text-obsidian/60" /> Framer Expert
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-obsidian/10 text-xs font-sans font-medium text-obsidian">
                <Sparkles className="w-3.5 h-3.5 text-coral" /> Conversion Focused
              </span>
            </motion.div>

            {/* CTA Arrow Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10"
            >
              <a
                href={bio.ctaLink}
                className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-obsidian text-paper font-sans text-sm font-semibold tracking-wide hover:bg-obsidian/90 transition-all duration-200 shadow-md hover:shadow-xl hover:gap-4"
              >
                <RollingText text={bio.ctaText} className="text-paper font-semibold" />
                <ArrowRight className="w-4 h-4 text-paper transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
