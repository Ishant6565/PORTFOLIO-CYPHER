import React from 'react';

/**
 * RollingText Component
 * Signature Framer interaction: Dual text layers that roll smoothly on hover.
 */
export default function RollingText({ text, className = "", charDelay = 0.015 }) {
  // If text has spaces, preserve them
  const chars = text.split("");

  return (
    <span className={`inline-flex overflow-hidden relative group cursor-pointer select-none leading-tight ${className}`}>
      {/* Primary Layer */}
      <span className="inline-flex transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
        {chars.map((char, index) => (
          <span
            key={`front-${index}`}
            style={{ transitionDelay: `${index * charDelay}s` }}
            className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      {/* Duplicate Rolling Layer coming from below */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 inline-flex transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full group-hover:translate-y-0"
      >
        {chars.map((char, index) => (
          <span
            key={`back-${index}`}
            style={{ transitionDelay: `${index * charDelay}s` }}
            className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </span>
  );
}
