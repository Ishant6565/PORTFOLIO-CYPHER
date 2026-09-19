import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function ServicesSection() {
  const { services } = portfolioData;

  return (
    <section id="services" className="py-24 sm:py-32 px-4 sm:px-8 border-t border-obsidian/10 bg-paper">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-obsidian/50 uppercase block mb-3">
              / WHAT I DO
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-obsidian tracking-tight">
              Services
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-obsidian/60 font-sans leading-relaxed">
            High-impact web engineering and design systems tailored to elevate ambitious digital ventures.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group p-8 sm:p-10 rounded-3xl bg-white/60 border border-obsidian/10 hover:border-obsidian/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative flex flex-col justify-between"
            >
              {/* Card Top: Number & Arrow Icon */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-sm sm:text-base text-obsidian/40 font-semibold">
                    /{service.number}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-obsidian/5 group-hover:bg-obsidian group-hover:text-paper flex items-center justify-center transition-colors duration-200">
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Service Title */}
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-obsidian tracking-tight group-hover:text-coral transition-colors duration-200 mb-4">
                  {service.title}
                </h3>

                {/* Service Description */}
                <p className="text-sm sm:text-base text-obsidian/65 font-sans leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Service Tags */}
              <div className="mt-8 pt-6 border-t border-obsidian/5 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-paper border border-obsidian/10 text-xs font-mono text-obsidian/80 group-hover:border-obsidian/20 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
