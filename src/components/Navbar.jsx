"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "About", href: "/about" },
  { name: "Gallery", href: "/gallery" },
  { name: "Reviews", href: "/reviews" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0));

  // Hide navbar on admin pages
  if (pathname?.startsWith("/admin")) return null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const isHomepage = pathname === "/";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-xl shadow-lg shadow-[#C6FF00]/5 border-b border-[#C6FF00]/10"
          : "bg-transparent"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-1 min-w-0 mr-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="The Awareness Cafe Logo"
              className="w-auto max-w-full h-11 md:h-12 object-contain object-left"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] 
                    transition-colors duration-300 relative group tracking-wider ${
                    isActive ? "text-[#C6FF00]" : "text-white hover:text-[#C6FF00]"
                  }`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#C6FF00] 
                    transition-all duration-300 rounded-full ${isActive ? "w-3/4" : "w-0 group-hover:w-3/4"}`} />
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA + Cart */}
          <div className="hidden md:flex items-center gap-3 ml-4">
            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] 
                text-gray-300 hover:text-[#C6FF00] hover:border-[#C6FF00]/30 transition-all"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-[#C6FF00] text-black text-[10px] font-bold 
                    w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-[#C6FF00]/30"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </motion.span>
              )}
            </button>

            <Link href="/menu" className="neon-btn !py-2 !px-5 !text-xs">
              🛒 Order Online
            </Link>
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Cart */}
            <button
              onClick={openCart}
              className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]
                text-gray-300 hover:text-[#C6FF00] transition-all"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C6FF00] text-black text-[10px] font-bold 
                  w-4 h-4 flex items-center justify-center rounded-full">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center w-10 h-10 flex-shrink-0 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] relative z-50 hover:border-[#C6FF00]/30 transition-all"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col items-center justify-center">
                <div className={`w-6 h-0.5 bg-[#C6FF00] mb-1 transition-all origin-center ${isOpen ? "rotate-45 translate-y-[6px]" : ""}`}></div>
                <div className={`w-6 h-0.5 bg-[#C6FF00] mb-1 transition-all ${isOpen ? "opacity-0 scale-0" : ""}`}></div>
                <div className={`w-6 h-0.5 bg-[#C6FF00] transition-all origin-center ${isOpen ? "-rotate-45 -translate-y-[6px]" : ""}`}></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay & drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed right-0 top-0 bottom-0 w-[280px] sm:w-[320px] bg-[#0b0b0b] border-l border-[#2a2a2a] z-50 flex flex-col shadow-2xl md:hidden"
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 hover:text-[#C6FF00] hover:border-[#C6FF00]/50 transition-all"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-2 flex flex-col gap-4">
                {navLinks.map((link, i) => (
                  <motion.div key={link.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-xl font-bold transition-colors py-2 border-b border-[#2a2a2a]/50 block ${
                        pathname === link.href ? "text-[#C6FF00]" : "text-white hover:text-[#C6FF00]"
                      }`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="p-6 flex flex-col gap-3 border-t border-[#2a2a2a]/50 bg-[#111]"
              >
                <Link href="/menu" onClick={() => setIsOpen(false)} className="neon-btn text-center !rounded-xl">
                  🛒 Order Online
                </Link>
                <a href="tel:+918750155505" className="neon-btn-outline text-center !rounded-xl">
                  📞 Call Now
                </a>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
