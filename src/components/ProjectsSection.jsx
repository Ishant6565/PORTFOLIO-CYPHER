import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import RollingText from './RollingText';
import { portfolioData } from '../data/portfolioData';

export default function ProjectsSection() {
  const { projects } = portfolioData;

  return (
    <section id="work" className="py-24 sm:py-32 px-4 sm:px-8 border-t border-obsidian/10 bg-paper">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-obsidian/50 uppercase block mb-3">
              / SELECTED WORK
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-obsidian tracking-tight">
              Featured Projects
            </h2>
          </div>

          <a
            href="https://framer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-obsidian/15 hover:border-obsidian bg-white/60 hover:bg-obsidian hover:text-paper text-xs font-mono font-medium tracking-wide transition-all duration-200"
          >
            <RollingText text="View All Work" />
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Projects 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {projects.map((project, index) => (
            <motion.a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group block rounded-3xl p-4 sm:p-5 bg-white/70 border border-obsidian/10 hover:border-obsidian/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5"
            >
              {/* Card Image Container with browser mockup frame */}
              <div className="relative aspect-[16/10] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-stone-100 border border-obsidian/5 mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  loading="lazy"
                />

                {/* Corner Quick Action Button */}
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-obsidian/10 flex items-center justify-center text-obsidian group-hover:bg-obsidian group-hover:text-paper transition-all duration-200 shadow-sm opacity-90 group-hover:opacity-100">
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                {/* Bottom Category Pill */}
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono font-medium">
                  {project.category}
                </div>
              </div>

              {/* Card Content & Metadata */}
              <div className="px-2 pb-2">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-obsidian tracking-tight group-hover:text-coral transition-colors duration-200">
                    {project.title}
                  </h3>
                  <span className="font-mono text-xs text-obsidian/40 font-semibold px-2.5 py-1 rounded-full bg-paper border border-obsidian/10">
                    {project.year}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-obsidian/65 font-sans leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-paper text-[11px] font-mono text-obsidian/70 border border-obsidian/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
