"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const subtotal = items.reduce((sum, i) => sum + i.numericPrice * i.qty, 0);
  const total = subtotal;
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={closeCart} />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-[#0b0b0b] border-l border-[#2a2a2a] z-[61] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#2a2a2a]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#C6FF00]" />
                <h2 className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>Your Cart</h2>
                {itemCount > 0 && (
                  <span className="bg-[#C6FF00] text-black text-xs font-bold px-2 py-0.5 rounded-full">{itemCount}</span>
                )}
              </div>
              <button onClick={closeCart} className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 hover:text-[#C6FF00] hover:border-[#C6FF00]/50 transition-all" aria-label="Close cart">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-6xl mb-4">🍕</div>
                  <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "var(--font-heading)" }}>Your cart is empty</h3>
                  <p className="text-gray-400 text-sm mb-6">Let&apos;s fix that! Browse our delicious menu.</p>
                  <Link href="/menu" onClick={closeCart} className="neon-btn !py-3 !px-6 text-sm">Browse Menu</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div key={`${item.name}-${item.variant || ""}`} layout className="glass-card p-4 flex gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-sm truncate" style={{ fontFamily: "var(--font-heading)" }}>{item.name}</h4>
                        {item.variant && <span className="text-gray-500 text-xs">{item.variant}</span>}
                        <p className="text-[#C6FF00] font-bold text-sm mt-1">₹{item.numericPrice * item.qty}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.name, item.variant, item.qty - 1)} className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-gray-300 hover:text-[#C6FF00] hover:border-[#C6FF00]/30 transition-all">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-white font-bold text-sm w-6 text-center">{item.qty}</span>
                        <button onClick={() => updateQuantity(item.name, item.variant, item.qty + 1)} className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-gray-300 hover:text-[#C6FF00] hover:border-[#C6FF00]/30 transition-all">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeItem(item.name, item.variant)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all ml-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-[#2a2a2a] bg-[#111]">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Subtotal</span><span className="text-white font-medium">₹{subtotal}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Delivery</span><span className="text-[#C6FF00] font-medium">FREE</span></div>
                  <div className="h-px bg-[#2a2a2a] my-2" />
                  <div className="flex justify-between"><span className="text-white font-bold" style={{ fontFamily: "var(--font-heading)" }}>Total</span><span className="text-[#C6FF00] font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>₹{total}</span></div>
                </div>
                <Link href="/checkout" onClick={closeCart} className="neon-btn w-full text-center block py-4">Proceed to Checkout</Link>
                <p className="text-gray-500 text-xs text-center mt-3">🚚 Free delivery within 5 km • Cash on Delivery</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
