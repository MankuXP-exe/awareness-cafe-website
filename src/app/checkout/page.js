"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { ArrowLeft, CreditCard, Truck, Phone } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const subtotal = items.reduce((sum, i) => sum + i.numericPrice * i.qty, 0);
  const total = subtotal;
  const [form, setForm] = useState({ name: "", phone: "", address: "", pincode: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Valid 10-digit phone required";
    if (form.address.trim().length < 5) e.address = "Full address required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || items.length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name, customer_phone: form.phone,
          customer_address: form.address, customer_pincode: form.pincode,
          items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.numericPrice, customizations: i.variant || "" })),
          subtotal, delivery_fee: 0, total, notes: form.notes, is_custom_order: false,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        clearCart();
        toast.success("Order placed successfully!");
        router.push(`/order-confirmation/${data.order_number}`);
      } else {
        toast.error(data.error || "Failed to place order");
      }
    } catch { toast.error("Something went wrong. Please try again."); }
    finally { setSubmitting(false); }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Cart is empty</h1>
            <p className="text-gray-400 mb-6">Add items to your cart before checkout.</p>
            <Link href="/menu" className="neon-btn">Browse Menu</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-24 md:pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/menu" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#C6FF00] text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-heading)" }}>
          Checkout
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
            <div className="glass-card p-6">
              <h2 className="text-white font-bold text-lg mb-5" style={{ fontFamily: "var(--font-heading)" }}>📦 Delivery Details</h2>
              {[
                { id: "name", label: "Full Name", placeholder: "Enter your full name", type: "text", icon: "👤" },
                { id: "phone", label: "Phone Number", placeholder: "10-digit phone number", type: "tel", icon: "📱" },
                { id: "address", label: "Full Address", placeholder: "House no, street, area, landmark", type: "text", icon: "📍" },
                { id: "pincode", label: "Pincode (optional)", placeholder: "e.g. 122505", type: "text", icon: "📮" },
              ].map((f) => (
                <div key={f.id} className="mb-4">
                  <label htmlFor={f.id} className="text-white text-sm font-medium mb-2 block">{f.icon} {f.label}</label>
                  <input id={f.id} type={f.type} value={form[f.id]} onChange={(e) => setForm((p) => ({ ...p, [f.id]: e.target.value }))}
                    placeholder={f.placeholder} maxLength={f.id === "phone" ? 10 : 200}
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#C6FF00]/50 transition-all" />
                  {errors[f.id] && <p className="text-red-400 text-xs mt-1">{errors[f.id]}</p>}
                </div>
              ))}
              <div>
                <label htmlFor="notes" className="text-white text-sm font-medium mb-2 block">📝 Order Notes (optional)</label>
                <textarea id="notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Any special instructions..." rows={3} maxLength={500}
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#C6FF00]/50 transition-all resize-none" />
              </div>
            </div>
            {/* Payment */}
            <div className="glass-card p-6">
              <h2 className="text-white font-bold text-lg mb-4" style={{ fontFamily: "var(--font-heading)" }}>💳 Payment Method</h2>
              <div className="flex items-center gap-4 bg-[#1a1a1a] border-2 border-[#C6FF00]/30 rounded-xl p-4">
                <div className="w-12 h-12 rounded-xl bg-[#C6FF00]/10 flex items-center justify-center"><Truck className="w-6 h-6 text-[#C6FF00]" /></div>
                <div><p className="text-white font-bold text-sm">Cash on Delivery (COD)</p><p className="text-gray-400 text-xs">Pay when you receive your order</p></div>
                <div className="ml-auto w-5 h-5 rounded-full border-2 border-[#C6FF00] flex items-center justify-center"><div className="w-2.5 h-2.5 rounded-full bg-[#C6FF00]" /></div>
              </div>
            </div>
            <button type="submit" disabled={submitting} className="neon-btn w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? "Placing Order..." : `Place Order • ₹${total}`}
            </button>
          </form>
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 sticky top-24">
              <h2 className="text-white font-bold text-lg mb-4" style={{ fontFamily: "var(--font-heading)" }}>🛒 Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.name}-${item.variant || ""}`} className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.name} × {item.qty}</span>
                    <span className="text-white font-medium">₹{item.numericPrice * item.qty}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#2a2a2a] pt-3 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Subtotal</span><span className="text-white">₹{subtotal}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Delivery</span><span className="text-[#C6FF00]">FREE</span></div>
                <div className="h-px bg-[#2a2a2a]" />
                <div className="flex justify-between"><span className="text-white font-bold">Total</span><span className="text-[#C6FF00] font-bold text-lg">₹{total}</span></div>
              </div>
              <div className="mt-4 bg-[#C6FF00]/5 border border-[#C6FF00]/20 rounded-xl p-3 text-center">
                <p className="text-[#C6FF00] text-xs font-medium">🚚 Estimated delivery: 30-45 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
