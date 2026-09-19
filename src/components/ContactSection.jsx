import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import RollingText from './RollingText';
import { portfolioData } from '../data/portfolioData';

export default function ContactSection() {
  const { contact } = portfolioData;
  const [formData, setFormData] = useState({ name: '', email: '', project: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    // Trigger confetti celebratory effect
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#eb4d6d', '#111111', '#faf7f3']
    });

    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 sm:py-36 px-4 sm:px-8 border-t border-obsidian/10 bg-paper relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Heading & Social Handles */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono tracking-widest text-obsidian/50 uppercase block mb-3">
                / GET IN TOUCH
              </span>
              <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-obsidian tracking-tight mb-6">
                {contact.heading}
              </h2>
              <p className="text-base sm:text-lg text-obsidian/65 font-sans leading-relaxed mb-8">
                {contact.subheading}
              </p>

              {/* Direct Mail Link */}
              <div className="mb-10">
                <span className="text-xs font-mono text-obsidian/50 uppercase block mb-2">Direct Inquiry</span>
                <a
                  href={`mailto:${contact.email}`}
                  className="group inline-flex items-center gap-2 font-display text-xl sm:text-2xl font-bold text-obsidian hover:text-coral transition-colors"
                >
                  <Mail className="w-5 h-5 text-coral" />
                  <RollingText text={contact.email} />
                  <ArrowUpRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>

            {/* Social media connections */}
            <div>
              <span className="text-xs font-mono text-obsidian/50 uppercase block mb-3">Follow Along</span>
              <div className="flex flex-wrap gap-2.5">
                {contact.socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group px-4 py-2 rounded-full bg-white/70 border border-obsidian/10 hover:border-obsidian/30 text-xs font-mono text-obsidian hover:bg-obsidian hover:text-paper transition-all duration-200 flex items-center gap-1.5"
                  >
                    <span>{social.name}</span>
                    <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-12 rounded-4xl bg-white/75 backdrop-blur-md border border-obsidian/10 shadow-xl">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-obsidian mb-2">
                    Message received!
                  </h3>
                  <p className="text-sm sm:text-base text-obsidian/60 max-w-sm">
                    Thank you, {formData.name || 'friend'}. We will review your project details and get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', project: '' });
                    }}
                    className="mt-6 px-6 py-2.5 rounded-full border border-obsidian/20 text-xs font-mono font-medium hover:bg-obsidian hover:text-paper transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-obsidian uppercase tracking-wider mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-5 py-3.5 rounded-2xl bg-paper/60 border border-obsidian/10 text-obsidian placeholder:text-obsidian/30 font-sans text-sm focus:outline-none focus:border-obsidian focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-obsidian uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-5 py-3.5 rounded-2xl bg-paper/60 border border-obsidian/10 text-obsidian placeholder:text-obsidian/30 font-sans text-sm focus:outline-none focus:border-obsidian focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-obsidian uppercase tracking-wider mb-2">
                      Your Project
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      placeholder="Tell me about your goals, timeline, and deliverables..."
                      className="w-full px-5 py-3.5 rounded-2xl bg-paper/60 border border-obsidian/10 text-obsidian placeholder:text-obsidian/30 font-sans text-sm focus:outline-none focus:border-obsidian focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full group py-4 px-8 rounded-2xl bg-obsidian text-paper font-sans font-semibold text-sm tracking-wide hover:bg-obsidian/90 transition-all duration-200 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <RollingText text="Submit Project Inquiry" className="text-paper font-semibold" />
                    <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
