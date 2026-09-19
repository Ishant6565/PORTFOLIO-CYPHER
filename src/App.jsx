import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BioSection from './components/BioSection';
import QuoteSection from './components/QuoteSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import TestimonialsSection from './components/TestimonialsSection';
import ThoughtsSection from './components/ThoughtsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-obsidian flex flex-col selection:bg-obsidian selection:text-paper">
      {/* Floating Header */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Bio Section (#bio-section) */}
        <BioSection />

        {/* 3. Philosophy / Kinetic Quote Section */}
        <QuoteSection />

        {/* 4. Services Section */}
        <ServicesSection />

        {/* 5. Featured Projects Section */}
        <ProjectsSection />

        {/* 6. Client Testimonials */}
        <TestimonialsSection />

        {/* 7. Thoughts / Perspectives */}
        <ThoughtsSection />

        {/* 8. Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
