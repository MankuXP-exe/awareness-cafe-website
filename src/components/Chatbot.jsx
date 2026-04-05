"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import toast from "react-hot-toast";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm AwaBot 🍵 — your personal café assistant at The Awareness Cafe!\n\nTell me what you'd like to order, and I'll help you build the perfect meal. You can also ask for combo suggestions! 😊" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 300); }, [isOpen]);
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    const userMsg = { role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })) }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 429 && data.message) {
          setMessages((p) => [...p, { role: "assistant", content: data.message }]);
          return;
        }
        throw new Error("Chat failed");
      }
      
      const reply = data.message || "Sorry, something went wrong. Please try again!";
      const jsonMatch = reply.match(/```json\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        try {
          const od = JSON.parse(jsonMatch[1]);
          if (od.action === "place_order") {
            const orderRes = await fetch("/api/orders", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ customer_name: od.customer_name, customer_phone: od.customer_phone, customer_address: od.customer_address, customer_pincode: "", items: od.items, subtotal: od.total, delivery_fee: 0, total: od.total, notes: "Ordered via AwaBot AI Chat", is_custom_order: true }),
            });
            const or2 = await orderRes.json();
            if (orderRes.ok) {
              setMessages((p) => [...p, { role: "assistant", content: `🎉 Order placed!\n\n📋 Order ID: **${or2.order_number}**\n💰 Total: ₹${od.total}\n🚚 Estimated: 30-45 min\n\nYour food is being prepared with love ❤️` }]);
              setIsLoading(false);
              return;
            }
          }
        } catch { /* ignore */ }
      }
      setMessages((p) => [...p, { role: "assistant", content: reply.replace(/```json[\s\S]*?```/g, "").trim() || reply }]);
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "Oops! Something went wrong 😅 Please try again or call +91 87501 55505!" }]);
      toast.error("Chat error.");
    } finally { setIsLoading(false); }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            transition={{ type: "spring", damping: 15 }} onClick={() => setIsOpen(true)}
            className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[55] w-14 h-14 rounded-full bg-[#C6FF00] text-black flex items-center justify-center shadow-lg shadow-[#C6FF00]/20 hover:shadow-[#C6FF00]/40 hover:scale-110 transition-all"
            aria-label="Open AI Chat">
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-[70] sm:w-[400px] sm:h-[600px] sm:rounded-2xl bg-[#0b0b0b] border-0 sm:border sm:border-[#2a2a2a] flex flex-col sm:shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[#111] border-b border-[#2a2a2a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C6FF00] flex items-center justify-center"><Bot className="w-5 h-5 text-black" /></div>
                <div><h3 className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>AwaBot</h3><p className="text-[#C6FF00] text-xs">Online • Ready to help</p></div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 hover:text-[#C6FF00] transition-all" aria-label="Close chat"><X className="w-4 h-4" /></button>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && <div className="w-7 h-7 rounded-full bg-[#C6FF00]/20 flex items-center justify-center flex-shrink-0 mt-1"><Bot className="w-3.5 h-3.5 text-[#C6FF00]" /></div>}
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "bg-[#C6FF00] text-black rounded-br-md" : "bg-[#1a1a1a] text-gray-200 border border-[#2a2a2a] rounded-bl-md"}`}>{msg.content}</div>
                  {msg.role === "user" && <div className="w-7 h-7 rounded-full bg-[#2a2a2a] flex items-center justify-center flex-shrink-0 mt-1"><User className="w-3.5 h-3.5 text-gray-400" /></div>}
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#C6FF00]/20 flex items-center justify-center flex-shrink-0"><Bot className="w-3.5 h-3.5 text-[#C6FF00]" /></div>
                  <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-[#C6FF00]/50 animate-bounce" /><div className="w-2 h-2 rounded-full bg-[#C6FF00]/50 animate-bounce" style={{ animationDelay: "0.15s" }} /><div className="w-2 h-2 rounded-full bg-[#C6FF00]/50 animate-bounce" style={{ animationDelay: "0.3s" }} /></div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
            {/* Input */}
            <div className="p-4 border-t border-[#2a2a2a] bg-[#111]">
              <div className="flex gap-2">
                <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Type your order..." className="flex-1 px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#C6FF00]/50 transition-all" disabled={isLoading} />
                <button onClick={handleSend} disabled={isLoading || !input.trim()} className="w-12 h-12 rounded-xl bg-[#C6FF00] text-black flex items-center justify-center hover:bg-[#d4ff33] disabled:opacity-40 disabled:cursor-not-allowed transition-all" aria-label="Send"><Send className="w-4 h-4" /></button>
              </div>
              <p className="text-gray-600 text-[10px] text-center mt-2">Powered by AI • The Awareness Cafe</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
