import React from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';

export default function QuoteSection() {
  const { quote } = portfolioData;
  const words = quote.main.split(" ");

  return (
    <section className="py-24 sm:py-36 px-4 sm:px-8 bg-paper border-t border-obsidian/10">
      <div className="max-w-5xl mx-auto text-center">
        {/* Preamble badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-obsidian/10 text-xs font-mono text-obsidian/70 mb-8 uppercase tracking-widest shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
          <span>{quote.preamble}</span>
        </motion.div>

        {/* Scroll-revealing Philosophy Typography */}
        <h3 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-obsidian leading-[1.25] tracking-tight">
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0.15, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.02,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="inline-block mr-[0.28em] transition-colors duration-200 hover:text-coral"
            >
              {word}
            </motion.span>
          ))}
        </h3>
      </div>
    </section>
  );
}
