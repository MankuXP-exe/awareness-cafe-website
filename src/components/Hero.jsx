"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cafe front view.webp"
          alt="The Awareness Cafe"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/60 to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/50 to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#C6FF00]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#C6FF00]/3 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-center">
        {/* Rating Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 glass-card !rounded-full px-5 py-2.5 mb-8"
        >
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < 4 ? "text-yellow-400" : "text-yellow-400/60"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-white font-semibold text-sm">4.6</span>
          <span className="text-gray-400 text-sm">•</span>
          <span className="text-gray-300 text-sm">111+ Reviews</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 leading-[0.95] tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="text-white">THE</span>
          <br />
          <span className="text-[#C6FF00] drop-shadow-[0_0_40px_rgba(198,255,0,0.3)]">AWARENESS</span>
          <br />
          <span className="text-white">CAFE</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-gray-300 text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Where every sip tells a story.
          <br className="hidden sm:block" />
          <span className="text-[#C6FF00]/80">Premium coffee, food & vibes.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center w-full max-w-md sm:max-w-none mx-auto"
        >
          <a href="#menu" className="neon-btn text-base px-8 py-4 w-full sm:w-auto text-center">
            View Menu
          </a>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=The+Awareness+Cafe+Haryana"
            target="_blank"
            rel="noopener noreferrer"
            className="neon-btn-outline text-base px-8 py-4 w-full sm:w-auto text-center flex items-center justify-center gap-2 group"
          >
            <MapPin className="w-5 h-5 group-hover:-translate-y-1 group-hover:text-[#C6FF00] transition-transform duration-300" />
            <span>Get Directions</span>
          </a>
          <a href="#contact" className="neon-btn-outline text-base px-8 py-4 w-full sm:w-auto text-center !border-white/20 !text-white hover:!bg-white/10 hover:!text-white">
            Book a Table
          </a>
        </motion.div>
      </div>
    </section>
  );
}
