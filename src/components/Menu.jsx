"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, Plus, Check } from "lucide-react";
import { useCartStore, parsePrice } from "@/stores/cartStore";
import toast from "react-hot-toast";

export default function Menu({ menuData = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...menuData.map((c) => c.category)];

  const filteredMenu =
    activeCategory === "All"
      ? menuData
      : menuData.filter((c) => c.category === activeCategory);

  return (
    <section id="menu" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#080808] overflow-hidden">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            Order online or call us at{" "}
            <a href="tel:+917838485551" className="text-[#C6FF00] hover:underline">
              +91 78384 85551
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function MenuCard({ item, index, categoryEmoji }) {
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  // Check if item has multiple price variants (e.g., "₹59 / ₹119 / ₹199")
  const priceStr = item.price;
  const hasVariants = priceStr.includes("/") && !priceStr.startsWith("+");
  const isAddon = priceStr.startsWith("+");

  const handleAddToCart = (variant) => {
    const numericPrice = variant
      ? parseInt(variant.match(/\d+/)?.[0] || "0", 10)
      : parsePrice(priceStr);

    if (numericPrice === 0) return;

    addItem({
      name: item.name,
      variant: variant || null,
      numericPrice,
      image: item.image,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);

    toast.success(`${item.name} added to cart!`, {
      icon: "🛒",
      style: { fontFamily: "var(--font-heading)" },
    });
  };

  // Parse variants for multi-price items (e.g. "Half: ₹50 / Full: ₹90")
  const variants = hasVariants
    ? priceStr.split("/").map((p, i) => {
        const price = p.trim();
        if (price.includes(":")) {
          const [label, val] = price.split(":");
          return { label: label.trim(), price: val.trim() };
        }
        const sizes = ["Small", "Medium", "Large"];
        return { label: sizes[i] || `Option ${i + 1}`, price };
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass-card overflow-hidden group"
    >
      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden bg-[#1a1a1a]">
        {!imgError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
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
        <p className="text-gray-400 text-xs leading-relaxed mb-3">{item.desc}</p>

        {/* Add to Cart */}
        {isAddon ? (
          <p className="text-[#C6FF00]/60 text-xs italic">Add-on — select with any pizza</p>
        ) : variants ? (
          /* Multi-variant selector (pizza sizes, sandwich sizes) */
          <div className="flex flex-wrap gap-1.5">
            {variants.map((v) => (
              <button
                key={v.label}
                onClick={() => handleAddToCart(`${v.label} — ${v.price}`)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] 
                  text-xs text-gray-300 hover:border-[#C6FF00]/50 hover:text-[#C6FF00] transition-all
                  active:scale-95 min-h-[36px]"
              >
                <Plus className="w-3 h-3" />
                <span>{v.label}</span>
                <span className="text-[#C6FF00] font-bold">{v.price.includes("₹") ? v.price.trim() : `₹${v.price.trim()}`}</span>
              </button>
            ))}
          </div>
        ) : (
          /* Single-price add to cart */
          <button
            onClick={() => handleAddToCart()}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold 
              transition-all duration-300 active:scale-95 min-h-[44px] ${
              justAdded
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-[#C6FF00]/10 text-[#C6FF00] border border-[#C6FF00]/20 hover:bg-[#C6FF00] hover:text-black"
            }`}
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}
