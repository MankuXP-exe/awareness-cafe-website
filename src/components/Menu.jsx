"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { menuData } from "@/lib/data";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...menuData.map((c) => c.category)];

  const filteredMenu =
    activeCategory === "All"
      ? menuData
      : menuData.filter((c) => c.category === activeCategory);

  return (
    <section id="menu" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#080808]">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C6FF00]/3 rounded-full blur-[150px]" />

      <div className="w-full lg:max-w-7xl lg:mx-auto relative">
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
            Our Menu
          </span>
          <h2 className="section-title">
            Taste the <span className="neon-text">Difference</span>
          </h2>
          <div className="neon-line" />
          <p className="section-subtitle">
            From traditional Indian breakfast to gourmet burgers & pizzas — 
            something delicious for everyone.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-2 overflow-x-auto pb-4 mb-10 scrollbar-hide justify-start lg:justify-center"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`menu-filter-btn ${activeCategory === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Menu Categories */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {filteredMenu.map((category) => (
              <div key={category.category} className="mb-12 last:mb-0">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{category.emoji}</span>
                  <h3
                    className="text-2xl sm:text-3xl font-bold text-white"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {category.category}
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#C6FF00]/20 to-transparent" />
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {category.items.map((item, idx) => (
                    <MenuCard key={item.name} item={item} index={idx} categoryEmoji={category.emoji} />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Free delivery banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 glass-card p-6 sm:p-8 text-center"
        >
          <div className="text-3xl mb-3">🚚</div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Free Home Delivery within <span className="neon-text">5 km</span>
          </h3>
          <p className="text-gray-400 text-sm">
            Call us at{" "}
            <a href="tel:+918750155505" className="text-[#C6FF00] hover:underline">
              +91 87501 55505
            </a>{" "}
            to place your order
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function MenuCard({ item, index, categoryEmoji }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass-card overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-40 sm:h-44 overflow-hidden bg-[#1a1a1a]">
        {!imgError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#111]">
            <span className="text-5xl opacity-60">{categoryEmoji}</span>
          </div>
        )}
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-[#C6FF00] text-black px-3 py-1 rounded-full 
          text-xs font-bold shadow-lg shadow-[#C6FF00]/20">
          {item.price}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="text-white font-bold text-sm sm:text-base mb-1" style={{ fontFamily: "var(--font-heading)" }}>
          {item.name}
        </h4>
        <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
      </div>
    </motion.div>
  );
}
