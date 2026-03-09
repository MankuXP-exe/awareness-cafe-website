"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const footerLinks = {
  navigation: [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Menu", href: "#menu" },
    { name: "Gallery", href: "#gallery" },
    { name: "Reviews", href: "#reviews" },
    { name: "Contact", href: "#contact" },
  ],
  hours: [
    { day: "Monday – Saturday", time: "8:00 AM – 10:00 PM" },
    { day: "Sunday", time: "9:00 AM – 10:00 PM" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-[#1a1a1a]">
      <div className="w-full lg:max-w-7xl lg:mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="relative h-12 w-56">
                <Image
                  src="/logo.svg"
                  alt="The Awareness Cafe Logo"
                  fill
                  className="object-contain object-left drop-shadow-[0_0_15px_rgba(198,255,0,0.1)]"
                />
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Where every sip tells a story. Experience premium coffee, delicious food, and a cozy atmosphere.
            </p>
            <div className="flex gap-3">
              {["instagram", "facebook", "twitter"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center 
                    justify-center text-gray-400 hover:text-[#C6FF00] hover:border-[#C6FF00]/30 transition-all"
                  aria-label={social}
                >
                  {social === "instagram" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  )}
                  {social === "facebook" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z"/>
                    </svg>
                  )}
                  {social === "twitter" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-white font-bold text-lg mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#C6FF00] transition-colors text-sm flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00]/30" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Opening Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-white font-bold text-lg mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Opening Hours
            </h3>
            <ul className="space-y-3">
              {footerLinks.hours.map((item) => (
                <li key={item.day} className="text-sm">
                  <span className="text-gray-300 block">{item.day}</span>
                  <span className="text-[#C6FF00] font-medium">{item.time}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-white font-bold text-lg mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Find Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-[#C6FF00] mt-0.5 text-lg">📍</span>
                <span className="text-gray-400 text-sm leading-relaxed">
                  Gadi Budhera Road, Near Vaishno Devi Mandir, Haryana 122505, India
                </span>
              </li>
              <li>
                <a href="tel:+918750155505" className="flex items-center gap-3 text-gray-400 hover:text-[#C6FF00] transition-colors">
                  <span className="text-lg">📞</span>
                  <span className="text-sm">+91 87501 55505</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@theawarenesscafe.in" className="flex items-center gap-3 text-gray-400 hover:text-[#C6FF00] transition-colors">
                  <span className="text-lg">✉️</span>
                  <span className="text-sm">info@theawarenesscafe.in</span>
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1a1a1a] mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} The Awareness Cafe. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Made with <span className="text-[#C6FF00]">♥</span> for great food lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
