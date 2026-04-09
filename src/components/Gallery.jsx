"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Gallery({ galleryImages = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [filter, setFilter] = useState("all");
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const filters = [
    { key: "all", label: "All" },
    { key: "food", label: "Food" },
    { key: "interior", label: "Interior" },
    { key: "exterior", label: "Exterior" },
    { key: "team", label: "Team" },
  ];

  const filteredImages =
    filter === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);

  const selectedImage = selectedIndex !== null ? filteredImages[selectedIndex] : null;

  const goNext = useCallback(() => {
    if (selectedIndex === null || filteredImages.length === 0) return;
    setDirection(1);
    setSelectedIndex((prev) => (prev + 1) % filteredImages.length);
  }, [selectedIndex, filteredImages.length]);

  const goPrev = useCallback(() => {
    if (selectedIndex === null || filteredImages.length === 0) return;
    setDirection(-1);
    setSelectedIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [selectedIndex, filteredImages.length]);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    setDirection(0);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      else if (e.key === "Escape") { closeLightbox(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, goNext, goPrev, closeLightbox]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedIndex]);

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    // Only register horizontal swipes (not vertical scrolls)
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <section id="gallery" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C6FF00]/3 rounded-full blur-[150px]" />

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
            Gallery
          </span>
          <h2 className="section-title">
            Peek Inside <span className="neon-text">Our World</span>
          </h2>
          <div className="neon-line" />
          <p className="section-subtitle">
            Explore our cozy interiors, delicious food, and the vibrant 
            atmosphere that makes us special.
          </p>
        </motion.div>

        {/* Filter */}
        <div className="flex gap-2 justify-center mb-10 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setSelectedIndex(null); }}
              className={`menu-filter-btn ${filter === f.key ? "active" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="masonry-grid">
          <AnimatePresence>
            {filteredImages.map((image, i) => (
              <motion.div
                key={image.src}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="masonry-item cursor-pointer group"
                onClick={() => { setDirection(0); setSelectedIndex(i); }}
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <div className={`relative ${i % 3 === 0 ? "h-64 sm:h-80" : i % 3 === 1 ? "h-48 sm:h-56" : "h-56 sm:h-72"}`}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 
                      transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      <p className="text-white font-medium text-sm">{image.alt}</p>
                      <span className="text-[#C6FF00] text-xs capitalize">{image.category}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Previous Button */}
            {filteredImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-[60] w-11 h-11 sm:w-14 sm:h-14 
                  rounded-full bg-[#1a1a1a]/80 border border-[#333] backdrop-blur-md
                  text-white hover:text-[#C6FF00] hover:border-[#C6FF00]/40 hover:bg-[#1a1a1a] 
                  transition-all duration-300 flex items-center justify-center
                  active:scale-90 shadow-lg shadow-black/30"
                aria-label="Previous image"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}

            {/* Next Button */}
            {filteredImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-[60] w-11 h-11 sm:w-14 sm:h-14 
                  rounded-full bg-[#1a1a1a]/80 border border-[#333] backdrop-blur-md
                  text-white hover:text-[#C6FF00] hover:border-[#C6FF00]/40 hover:bg-[#1a1a1a] 
                  transition-all duration-300 flex items-center justify-center
                  active:scale-90 shadow-lg shadow-black/30"
                aria-label="Next image"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-4xl w-full max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[60vh] sm:h-[75vh] rounded-2xl overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={selectedImage.src}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={selectedImage.src}
                      alt={selectedImage.alt}
                      fill
                      className="object-contain"
                      sizes="90vw"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="text-center mt-4">
                <p className="text-white font-medium">{selectedImage.alt}</p>
                <div className="flex items-center justify-center gap-3 mt-1">
                  <p className="text-[#C6FF00] text-sm capitalize">{selectedImage.category}</p>
                  {filteredImages.length > 1 && (
                    <span className="text-gray-500 text-xs">{selectedIndex + 1} / {filteredImages.length}</span>
                  )}
                </div>
              </div>
              <button
                onClick={closeLightbox}
                className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] 
                  text-white hover:text-[#C6FF00] hover:border-[#C6FF00]/30 transition-all flex items-center justify-center"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

