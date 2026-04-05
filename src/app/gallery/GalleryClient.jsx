"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { galleryImages } from "@/lib/data";

const filters = [
  { key: "all", label: "All" },
  { key: "food", label: "🍕 Food" },
  { key: "interior", label: "🪑 Interior" },
  { key: "exterior", label: "🏠 Exterior" },
  { key: "team", label: "👥 Team" },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [allImages, setAllImages] = useState(galleryImages);

  // Try loading from Supabase, fallback to static
  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        if (data.images?.length > 0) {
          setAllImages([...data.images, ...galleryImages]);
        }
      })
      .catch(() => {});
  }, []);

  const filteredImages =
    filter === "all"
      ? allImages
      : allImages.filter((img) => img.category === filter);

  return (
    <>
      <Navbar />
      <main className="w-full overflow-x-hidden pt-16 md:pt-20">
        {/* Header */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#080808] text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#C6FF00] text-sm font-semibold tracking-[0.2em] uppercase mb-2 block"
              style={{ fontFamily: "var(--font-heading)" }}>Our Gallery</span>
            <h1 className="section-title">
              Peek Inside <span className="neon-text">Our World</span>
            </h1>
            <div className="neon-line" />
            <p className="section-subtitle">
              Explore our cozy interiors, delicious food, and the vibrant atmosphere 
              that makes us special.
            </p>
          </motion.div>

          {/* Filter */}
          <div className="flex gap-2 justify-center mb-10 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`menu-filter-btn ${filter === f.key ? "active" : ""}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-20 bg-[#080808]">
          <div className="max-w-7xl mx-auto">
            <div className="masonry-grid">
              <AnimatePresence>
                {filteredImages.map((image, i) => (
                  <motion.div
                    key={image.src || image.image_url}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: i * 0.03 }}
                    className="masonry-item cursor-pointer group"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="relative overflow-hidden rounded-2xl">
                      <div className={`relative ${i % 3 === 0 ? "h-64 sm:h-80" : i % 3 === 1 ? "h-48 sm:h-56" : "h-56 sm:h-72"}`}>
                        <Image
                          src={image.src || image.image_url}
                          alt={image.alt || image.title || "Gallery image"}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 
                          transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                          <p className="text-white font-medium text-sm">{image.alt || image.title}</p>
                          <span className="text-[#C6FF00] text-xs capitalize">{image.category}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredImages.length === 0 && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">📷</div>
                <p className="text-gray-400">No images in this category yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[70] flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="relative max-w-4xl w-full max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full h-[60vh] sm:h-[75vh] rounded-2xl overflow-hidden">
                  <Image
                    src={selectedImage.src || selectedImage.image_url}
                    alt={selectedImage.alt || selectedImage.title || "Gallery"}
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                </div>
                <div className="text-center mt-4">
                  <p className="text-white font-medium">{selectedImage.alt || selectedImage.title}</p>
                  <p className="text-[#C6FF00] text-sm capitalize">{selectedImage.category}</p>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] 
                    text-white hover:text-[#C6FF00] hover:border-[#C6FF00]/30 transition-all flex items-center justify-center"
                >
                  ✕
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
