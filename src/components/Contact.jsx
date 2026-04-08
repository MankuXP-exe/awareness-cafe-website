"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    // Basic validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setStatus({ type: "error", message: "Please fill in all fields." });
      setSubmitting(false);
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ""))) {
      setStatus({ type: "error", message: "Please enter a valid 10-digit phone number." });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "Thank you! We'll get back to you soon. ☕" });
        setFormData({ name: "", phone: "", message: "" });
      } else {
        setStatus({ type: "error", message: data.error || "Something went wrong." });
      }
    } catch {
      setStatus({ type: "error", message: "Failed to send. Please try calling us directly." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#080808] overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C6FF00]/3 rounded-full blur-[150px]" />

      <div className="w-full lg:max-w-7xl lg:mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-[#C6FF00] text-sm font-semibold tracking-[0.2em] uppercase mb-2 block"
            style={{ fontFamily: "var(--font-heading)" }}>
            Get In Touch
          </span>
          <h2 className="section-title">
            Book a <span className="neon-text">Table</span>
          </h2>
          <div className="neon-line" />
          <p className="section-subtitle">
            Reserve your spot or reach out to us. We'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8">
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="text-white text-sm font-medium mb-2 block"
                    style={{ fontFamily: "var(--font-heading)" }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    maxLength={100}
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-white 
                      placeholder-gray-500 text-sm focus:outline-none focus:border-[#C6FF00]/50 
                      focus:shadow-[0_0_15px_rgba(198,255,0,0.1)] transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="text-white text-sm font-medium mb-2 block"
                    style={{ fontFamily: "var(--font-heading)" }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    maxLength={15}
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-white 
                      placeholder-gray-500 text-sm focus:outline-none focus:border-[#C6FF00]/50 
                      focus:shadow-[0_0_15px_rgba(198,255,0,0.1)] transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="text-white text-sm font-medium mb-2 block"
                    style={{ fontFamily: "var(--font-heading)" }}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your booking or query..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-white 
                      placeholder-gray-500 text-sm focus:outline-none focus:border-[#C6FF00]/50 
                      focus:shadow-[0_0_15px_rgba(198,255,0,0.1)] transition-all resize-none"
                  />
                </div>

                {/* Status */}
                {status.message && (
                  <div
                    className={`p-4 rounded-xl text-sm font-medium ${
                      status.type === "success"
                        ? "bg-[#C6FF00]/10 text-[#C6FF00] border border-[#C6FF00]/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="neon-btn w-full text-center py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* Info Cards */}
            {[
              {
                icon: "📍",
                title: "Visit Us",
                content: "Garhi-Buredha Road, Sadharana Ki Dhani, Sadharana Village, Gurugram, Haryana 122505",
              },
              {
                icon: "📞",
                title: "Call Us",
                content: "+91 87501 55505 / +91 78384 85551",
                link: "tel:+918750155505",
              },
              {
                icon: "✉️",
                title: "Email Us",
                content: "info@theawarenesscafe.in",
                link: "mailto:info@theawarenesscafe.in",
              },
              {
                icon: "🕐",
                title: "Opening Hours",
                content: "Mon–Sat: 8 AM – 10 PM | Sun: 9 AM – 10 PM",
              },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C6FF00]/10 flex items-center justify-center text-2xl shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                    {item.title}
                  </h4>
                  {item.link ? (
                    <a href={item.link} className="text-[#C6FF00] hover:underline text-sm">
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-gray-400 text-sm leading-relaxed">{item.content}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div className="glass-card p-6">
              <h4 className="text-white font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <a href="tel:+918750155505" className="neon-btn-outline text-center !text-xs !py-3">
                  📞 Call Now
                </a>
                <a href="https://maps.google.com/?q=The+Awareness+Cafe+Sadharana+Gurugram+Haryana" target="_blank" rel="noopener noreferrer"
                  className="neon-btn-outline text-center !text-xs !py-3">
                  📍 Directions
                </a>
                <a href="https://wa.me/918750155505" target="_blank" rel="noopener noreferrer"
                  className="neon-btn text-center !text-xs !py-3 col-span-2">
                  💬 WhatsApp Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
