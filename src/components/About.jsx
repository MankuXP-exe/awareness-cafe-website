"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  { icon: "☕", title: "Premium Coffee", desc: "Handcrafted coffee blends from the finest beans" },
  { icon: "🍽️", title: "Delicious Food", desc: "From breakfast treats to gourmet burgers & pizza" },
  { icon: "🎵", title: "Great Ambience", desc: "Modern interiors with cozy vibes & great music" },
  { icon: "👥", title: "Perfect Hangout", desc: "Ideal spot for friends, dates, or solo coffee" },
];

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C6FF00]/3 rounded-full blur-[150px]" />

      <div className="w-full lg:max-w-7xl lg:mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#C6FF00] text-sm font-semibold tracking-[0.2em] uppercase mb-2 block"
            style={{ fontFamily: "var(--font-heading)" }}>
            Our Story
          </span>
          <h2 className="section-title">
            More Than Just a <span className="neon-text">Cafe</span>
          </h2>
          <div className="neon-line" />
          <p className="section-subtitle">
            The Awareness Cafe is where modern aesthetics meet traditional flavors. 
            A place to unwind, connect, and indulge in an experience that feeds 
            both body and soul.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/siting area.webp"
                    alt="Cozy sitting area"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="relative h-32 sm:h-40 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/staff.webp"
                    alt="Our team"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-32 sm:h-40 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/view.webp"
                    alt="Cafe view"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/main entry.webp"
                    alt="Main entry"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass-card !rounded-2xl px-6 py-4 text-center z-10"
            >
              <div className="text-3xl font-black text-[#C6FF00]" style={{ fontFamily: "var(--font-heading)" }}>
                4.6★
              </div>
              <div className="text-xs text-gray-400 mt-1">111+ Happy Customers</div>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-3xl sm:text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              A <span className="neon-text">cozy corner</span> for every mood
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6 text-base sm:text-lg">
              Nestled near Vaishno Devi Mandir in Haryana, The Awareness Cafe brings you a unique 
              blend of modern café culture and heartwarming Indian flavors. Whether you are looking 
              for the perfect morning chai, a crispy kachori, or a loaded burger with friends — 
              we have got you covered.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8 text-base sm:text-lg">
              Our Instagram-worthy interiors, friendly staff, and carefully curated menu make 
              every visit an experience worth sharing.
            </p>

            <div className="flex flex-wrap gap-3">
              {["☕ Great Coffee", "🍔 Amazing Food", "🎵 Chill Vibes", "📸 Insta-Worthy"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h4 className="text-white font-bold text-sm sm:text-base mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                {feature.title}
              </h4>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
