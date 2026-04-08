"use client";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function MapSection() {
  return (
    <section id="location" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="w-full lg:max-w-7xl lg:mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[#C6FF00] text-sm font-semibold tracking-[0.2em] uppercase mb-2 block"
            style={{ fontFamily: "var(--font-heading)" }}>
            Visit Us
          </span>
          <h2 className="section-title">
            Find Us <span className="neon-text">Here</span>
          </h2>
          <div className="neon-line" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 rounded-2xl overflow-hidden border border-[#2a2a2a] h-[300px] sm:h-[400px] lg:h-[450px]"
          >
            <iframe
              src="https://maps.google.com/maps?width=100%25&height=100%25&hl=en&q=The%20Awareness%20Cafe,%20Garhi-Buredha%20Road,%20Sadharana%20Village,%20Gurugram,%20Haryana+(The%20Awareness%20Cafe)&t=&z=15&ie=UTF8&iwloc=B&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.9)" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="The Awareness Cafe Location"
            />
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            {/* Address */}
            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C6FF00]/10 flex items-center justify-center text-2xl shrink-0">
                  📍
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1" style={{ fontFamily: "var(--font-heading)" }}>Address</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Garhi-Buredha Road, Sadharana Ki Dhani, Sadharana Village, Gurugram, Haryana 122505
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C6FF00]/10 flex items-center justify-center text-2xl shrink-0">
                  📞
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1" style={{ fontFamily: "var(--font-heading)" }}>Phone</h4>
                  <a href="tel:+918750155505" className="text-[#C6FF00] hover:underline text-sm">
                    +91 87501 55505
                  </a>
                  <br />
                  <a href="tel:+917838485551" className="text-[#C6FF00] hover:underline text-sm">
                    +91 78384 85551
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C6FF00]/10 flex items-center justify-center text-2xl shrink-0">
                  🕐
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1" style={{ fontFamily: "var(--font-heading)" }}>Hours</h4>
                  <p className="text-gray-400 text-sm">Mon – Sat: 8 AM – 10 PM</p>
                  <p className="text-gray-400 text-sm">Sunday: 9 AM – 10 PM</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=The+Awareness+Cafe+Sadharana+Gurugram+Haryana"
                target="_blank"
                rel="noopener noreferrer"
                className="neon-btn-outline w-full flex items-center justify-center gap-2 group"
              >
                <MapPin className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
                <span className="uppercase tracking-wider text-sm font-bold">GET DIRECTIONS</span>
              </a>
              <a href="tel:+918750155505" className="neon-btn-outline text-center w-full">
                📞 Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
