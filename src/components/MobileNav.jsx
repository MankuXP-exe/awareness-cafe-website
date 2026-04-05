"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, UtensilsCrossed, ShoppingCart, Info, Menu } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileNav() {
  const pathname = usePathname();
  const { openCart } = useCartStore();
  const [showMore, setShowMore] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0));

  if (pathname?.startsWith("/admin")) return null;

  const moreLinks = [
    { href: "/gallery", label: "📸 Gallery" },
    { href: "/reviews", label: "⭐ Reviews" },
    { href: "/checkout", label: "🛒 Checkout" },
    { href: "tel:+918750155505", label: "📞 Call Us" },
    { href: "https://wa.me/918750155505", label: "💬 WhatsApp", external: true },
  ];

  return (
    <>
      <AnimatePresence>
        {showMore && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-[49] md:hidden" onClick={() => setShowMore(false)} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-[72px] right-4 z-[50] bg-[#141414] border border-[#2a2a2a] rounded-2xl p-3 min-w-[180px] md:hidden">
              {moreLinks.map((link) => (
                <Link key={link.label} href={link.href} target={link.external ? "_blank" : undefined} onClick={() => setShowMore(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-[#C6FF00] hover:bg-[#1a1a1a] transition-all text-sm">{link.label}</Link>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <nav className="fixed bottom-0 left-0 right-0 z-[48] bg-[#0b0b0b]/95 backdrop-blur-xl border-t border-[#2a2a2a] md:hidden">
        <div className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)]">
          {[
            { href: "/", icon: Home, label: "Home" },
            { href: "/menu", icon: UtensilsCrossed, label: "Menu" },
            { action: "cart", icon: ShoppingCart, label: "Cart" },
            { href: "/about", icon: Info, label: "About" },
            { action: "more", icon: Menu, label: "More" },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = item.href === pathname;
            if (item.action === "cart") return (
              <button key="cart" onClick={openCart} className="flex flex-col items-center gap-1 py-1 px-3 relative min-w-[44px] min-h-[44px] justify-center">
                <div className="relative"><Icon className={`w-5 h-5 ${itemCount > 0 ? "text-[#C6FF00]" : "text-gray-400"}`} />{itemCount > 0 && <span className="absolute -top-1.5 -right-2 bg-[#C6FF00] text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{itemCount}</span>}</div>
                <span className={`text-[10px] ${itemCount > 0 ? "text-[#C6FF00]" : "text-gray-500"}`}>{item.label}</span>
              </button>
            );
            if (item.action === "more") return (
              <button key="more" onClick={() => setShowMore(!showMore)} className="flex flex-col items-center gap-1 py-1 px-3 min-w-[44px] min-h-[44px] justify-center">
                <Icon className={`w-5 h-5 ${showMore ? "text-[#C6FF00]" : "text-gray-400"}`} />
                <span className={`text-[10px] ${showMore ? "text-[#C6FF00]" : "text-gray-500"}`}>{item.label}</span>
              </button>
            );
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 py-1 px-3 min-w-[44px] min-h-[44px] justify-center">
                <Icon className={`w-5 h-5 ${isActive ? "text-[#C6FF00]" : "text-gray-400"}`} />
                <span className={`text-[10px] ${isActive ? "text-[#C6FF00]" : "text-gray-500"}`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
