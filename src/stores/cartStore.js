"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Cart Store — Zustand store with localStorage persistence.
 * Manages the shopping cart for The Awareness Cafe.
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // Open/close the cart drawer
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      // Add item to cart (or increment qty if already exists)
      addItem: (item) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.name === item.name && i.variant === item.variant
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.name === item.name && i.variant === item.variant
                ? { ...i, qty: i.qty + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, qty: 1 }] });
        }
      },

      // Remove item entirely
      removeItem: (name, variant) => {
        set({
          items: get().items.filter(
            (i) => !(i.name === name && i.variant === variant)
          ),
        });
      },

      // Update quantity (remove if qty reaches 0)
      updateQuantity: (name, variant, qty) => {
        if (qty <= 0) {
          get().removeItem(name, variant);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.name === name && i.variant === variant ? { ...i, qty } : i
          ),
        });
      },

      // Clear entire cart
      clearCart: () => set({ items: [] }),

      // Computed values
      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.qty, 0);
      },

      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.numericPrice * i.qty, 0);
      },

      get deliveryFee() {
        const sub = get().subtotal;
        return sub > 0 ? 0 : 0; // Free delivery within 5km
      },

      get total() {
        return get().subtotal + get().deliveryFee;
      },
    }),
    {
      name: "awareness-cafe-cart",
    }
  )
);

/**
 * Helper to parse price strings like "₹49", "₹45 / ₹90", "+₹49 extra"
 * Returns the lowest numeric price for cart purposes.
 */
export function parsePrice(priceStr) {
  if (!priceStr) return 0;
  const matches = priceStr.match(/(\d+)/g);
  if (!matches) return 0;
  return parseInt(matches[0], 10);
}
