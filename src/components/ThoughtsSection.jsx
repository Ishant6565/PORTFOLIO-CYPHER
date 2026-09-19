import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function ThoughtsSection() {
  const { thoughts } = portfolioData;

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 border-t border-obsidian/10 bg-paper">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-obsidian/50 uppercase block mb-3">
              / WRITINGS & PERSPECTIVES
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-obsidian tracking-tight">
              Thoughts
            </h2>
          </div>
          <p className="max-w-sm text-sm sm:text-base text-obsidian/60 font-sans">
            Reflections on digital aesthetics, design systems, and software engineering craftsmanship.
          </p>
        </div>

        {/* Thoughts List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {thoughts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col justify-between p-5 rounded-3xl bg-white/60 border border-obsidian/10 hover:border-obsidian/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                {/* Thumbnail Image */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-stone-200">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono">
                    {post.readTime}
                  </div>
                </div>

                <div className="px-2">
                  <span className="text-xs font-mono text-obsidian/45 block mb-2 font-medium">
                    {post.date}
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-obsidian tracking-tight group-hover:text-coral transition-colors duration-200 mb-3 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-obsidian/65 font-sans leading-relaxed">
                    {post.description}
                  </p>
                </div>
              </div>

              {/* Read link */}
              <div className="px-2 pt-6 mt-4 border-t border-obsidian/5 flex items-center justify-between text-xs font-mono font-medium text-obsidian group-hover:text-coral transition-colors">
                <span>Read Perspective</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
