"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, Send, X } from "lucide-react";
import toast from "react-hot-toast";

function StarRating({ rating, interactive, onRate }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => interactive && onRate?.(i + 1)}
          className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
        >
          <Star
            className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", rating: 5, text: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "4.6";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.text.length < 20) {
      toast.error("Review must be at least 20 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          rating: formData.rating,
          review_text: formData.text,
        }),
      });
      if (res.ok) {
        toast.success("Thank you! Your review will appear after approval. 🎉");
        setShowForm(false);
        setFormData({ name: "", phone: "", rating: 5, text: "" });
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit review.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="w-full overflow-x-hidden pt-16 md:pt-20">
        {/* Header */}
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#080808] text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-[#C6FF00] text-sm font-semibold tracking-[0.2em] uppercase mb-2 block"
              style={{ fontFamily: "var(--font-heading)" }}>Customer Love</span>
            <h1 className="section-title">What People <span className="neon-text">Say</span></h1>
            <div className="neon-line" />
          </motion.div>

          {/* Rating Summary */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-8 max-w-md mx-auto mb-8"
          >
            <div className="text-5xl font-black text-[#C6FF00] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              {avgRating}
            </div>
            <StarRating rating={Math.round(parseFloat(avgRating))} />
            <p className="text-gray-400 text-sm mt-2">Based on {reviews.length || "111+"}  reviews</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-gray-300 text-sm font-medium">Google Reviews</span>
            </div>
          </motion.div>

          <button onClick={() => setShowForm(true)} className="neon-btn !py-3 !px-8">
            ⭐ Leave a Review
          </button>
        </section>

        {/* Reviews Grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-20 bg-[#080808]">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card p-6 h-48 shimmer" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review, i) => (
                  <motion.div
                    key={review.id || i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="glass-card p-6"
                  >
                    <div className="text-[#C6FF00]/20 text-4xl mb-3 leading-none">&quot;</div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-5">{review.text || review.review_text}</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-[#2a2a2a]">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C6FF00] to-[#9ECC00] 
                        flex items-center justify-center text-black font-bold text-sm shrink-0"
                        style={{ fontFamily: "var(--font-heading)" }}>
                        {review.avatar || review.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                          {review.name || review.customer_name}
                        </h4>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Review Form Modal */}
        <AnimatePresence>
          {showForm && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]" onClick={() => setShowForm(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-[#0b0b0b] border border-[#2a2a2a] rounded-2xl p-6 sm:p-8 z-[61] max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-bold text-xl" style={{ fontFamily: "var(--font-heading)" }}>
                    ⭐ Leave a Review
                  </h2>
                  <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-gray-300 hover:text-[#C6FF00] transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Your Name *</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                      placeholder="Enter your name" maxLength={100}
                      className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#C6FF00]/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Phone (optional)</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                      placeholder="Not shown publicly" maxLength={10}
                      className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#C6FF00]/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Rating *</label>
                    <StarRating rating={formData.rating} interactive onRate={(r) => setFormData(p => ({ ...p, rating: r }))} />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Your Review * (min 20 chars)</label>
                    <textarea required value={formData.text} onChange={(e) => setFormData(p => ({ ...p, text: e.target.value }))}
                      placeholder="Share your experience with us..." rows={4} minLength={20} maxLength={1000}
                      className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#C6FF00]/50 transition-all resize-none" />
                    <p className="text-gray-500 text-xs mt-1">{formData.text.length}/1000</p>
                  </div>
                  <button type="submit" disabled={submitting} className="neon-btn w-full py-4 disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting ? "Submitting..." : <><Send className="w-4 h-4" /> Submit Review</>}
                  </button>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
