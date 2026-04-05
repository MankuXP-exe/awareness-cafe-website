"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const values = [
  { icon: "🌿", title: "Fresh Ingredients", desc: "Locally sourced, quality-first ingredients for every dish." },
  { icon: "❤️", title: "Made with Love", desc: "Every item is handcrafted with care and attention." },
  { icon: "🌍", title: "Community First", desc: "Supporting local farmers and our community." },
  { icon: "✨", title: "Awareness", desc: "Mindful eating, mindful living." },
];

const milestones = [
  { year: "2022", title: "Founded", desc: "The Awareness Cafe opens near Vaishno Devi Mandir." },
  { year: "2023", title: "100+ Customers", desc: "Reached 100 loyal regulars. Google rating hits 4.6⭐." },
  { year: "2024", title: "Menu Expansion", desc: "Expanded to 40+ items — pizzas, burgers, shakes." },
  { year: "2025", title: "Community Favorite", desc: "Became the go-to café for food lovers." },
  { year: "2026", title: "Going Digital", desc: "Launched AI-powered online ordering." },
];

export default function AboutContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image src="/images/cafe front view.webp" alt="The Awareness Cafe" fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/70 to-[#0a0a0a]" />
        </div>
        <div className="relative z-10 text-center px-4 py-20">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            More Than Just a <span className="text-[#C6FF00]">Cafe</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-300 text-lg max-w-2xl mx-auto">
            To serve every customer with love, quality, and awareness in every bite and sip.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#080808]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-56 rounded-2xl overflow-hidden"><Image src="/images/siting area.webp" alt="Sitting area" fill className="object-cover" sizes="25vw" /></div>
              <div className="relative h-56 rounded-2xl overflow-hidden mt-8"><Image src="/images/main entry.webp" alt="Entry" fill className="object-cover" sizes="25vw" /></div>
              <div className="relative h-48 rounded-2xl overflow-hidden col-span-2"><Image src="/images/view.webp" alt="View" fill className="object-cover" sizes="50vw" /></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>From a <span className="text-[#C6FF00]">Dream</span> to Your Favorite Café</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>Nestled on Gadi Budhera Road, near Vaishno Devi Mandir in Haryana, The Awareness Cafe was born from a powerful idea — creating a space where people connect over delicious food.</p>
              <p>Founded in 2022, what started as a small café serving breakfast and chai has evolved into a destination offering handcrafted pizzas, gourmet burgers, premium shakes, and artisanal coffees.</p>
              <p>Our name reflects our philosophy — <span className="text-[#C6FF00] font-medium">awareness in every bite</span>. Food should be prepared mindfully, served with love, and enjoyed fully.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="section-title">Our <span className="neon-text">Values</span></h2>
          <div className="neon-line" />
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-8 text-center">
              <div className="text-5xl mb-4">{v.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "var(--font-heading)" }}>{v.title}</h3>
              <p className="text-gray-400 text-sm">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#080808]">
        <div className="max-w-4xl mx-auto text-center mb-14">
          <h2 className="section-title">The <span className="neon-text">Timeline</span></h2>
          <div className="neon-line" />
        </div>
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-6 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C6FF00]/50 via-[#C6FF00]/20 to-transparent" />
          {milestones.map((ms, i) => (
            <motion.div key={ms.year} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative mb-12 pl-16 sm:pl-0">
              <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 w-5 h-5 rounded-full bg-[#C6FF00] border-4 border-[#080808] z-10" />
              <div className={`sm:w-1/2 ${i % 2 === 0 ? "sm:ml-auto sm:pl-12" : "sm:pr-12 sm:text-right"}`}>
                <div className="glass-card p-6">
                  <span className="text-[#C6FF00] font-bold text-2xl" style={{ fontFamily: "var(--font-heading)" }}>{ms.year}</span>
                  <h3 className="text-white font-bold mt-1">{ms.title}</h3>
                  <p className="text-gray-400 text-sm mt-2">{ms.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Goals */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="section-title">Goals & <span className="neon-text">Vision</span></h2>
          <div className="neon-line" />
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-8">
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>🎯 Short-Term</h3>
            <ul className="space-y-3">{["Expand menu with seasonal specials", "Launch table reservations", "Loyalty rewards program", "Partner with food bloggers"].map(g => <li key={g} className="flex items-start gap-3"><span className="w-2 h-2 mt-2 rounded-full bg-[#C6FF00]" /><span className="text-gray-300 text-sm">{g}</span></li>)}</ul>
          </div>
          <div className="glass-card p-8">
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>🚀 Long-Term</h3>
            <ul className="space-y-3">{["Open 3 more outlets in Haryana", "Build a franchise model", "Cloud kitchen operations", "Community welfare foundation"].map(g => <li key={g} className="flex items-start gap-3"><span className="w-2 h-2 mt-2 rounded-full bg-[#C6FF00]" /><span className="text-gray-300 text-sm">{g}</span></li>)}</ul>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#080808]">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="section-title">Meet the <span className="neon-text">Team</span></h2>
          <div className="neon-line" />
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { emoji: "👨‍🍳", title: "Owner & Founder", sub: "Visionary", desc: "Passionate about quality food and welcoming atmosphere." },
            { emoji: "👨‍🍳", title: "Our Chefs", sub: "Kitchen Masters", desc: "Crafting every dish with precision and passion." },
            { img: "/images/staff.webp", title: "Our Staff", sub: "Heart of Service", desc: "Always smiling — your comfort is our priority." },
          ].map((t, i) => (
            <motion.div key={t.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-8 text-center">
              {t.img ? <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4"><Image src={t.img} alt={t.title} fill className="object-cover" sizes="96px" /></div>
                : <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C6FF00]/20 to-[#C6FF00]/5 flex items-center justify-center mx-auto mb-4 text-5xl">{t.emoji}</div>}
              <h3 className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>{t.title}</h3>
              <p className="text-[#C6FF00] text-sm mb-3">{t.sub}</p>
              <p className="text-gray-400 text-sm">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto text-center glass-card p-10 sm:p-14">
          <div className="text-5xl mb-4">☕</div>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>Come Visit <span className="text-[#C6FF00]">Us</span></h2>
          <p className="text-gray-400 text-lg mb-8">Grab your friends and let us make your day brighter.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/menu" className="neon-btn text-center py-4 px-8">🛒 Order Online</a>
            <a href="tel:+918750155505" className="neon-btn-outline text-center py-4 px-8">📞 Call Now</a>
          </div>
        </div>
      </section>
    </>
  );
}
