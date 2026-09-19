import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function TestimonialsSection() {
  const { testimonials } = portfolioData;

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 border-t border-obsidian/10 bg-paper">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-xs font-mono tracking-widest text-obsidian/50 uppercase block mb-3">
            / CLIENT WORDS
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-obsidian tracking-tight">
            Testimonials
          </h2>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 rounded-3xl bg-white/60 border border-obsidian/10 hover:border-obsidian/25 transition-all duration-300 flex flex-col justify-between hover:shadow-lg relative group"
            >
              <div>
                <Quote className="w-8 h-8 text-obsidian/15 mb-6 group-hover:text-coral transition-colors duration-200" />
                <p className="text-base sm:text-lg text-obsidian/85 font-sans leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author info */}
              <div className="mt-8 pt-6 border-t border-obsidian/5 flex items-center gap-3.5">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover border border-obsidian/10 bg-paper"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-sans font-bold text-sm text-obsidian">
                    {item.name}
                  </h4>
                  <p className="text-xs font-mono text-obsidian/55">
                    {item.role} • {item.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
