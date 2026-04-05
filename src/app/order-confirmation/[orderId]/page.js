import Link from "next/link";
import { CheckCircle, Phone, Home as HomeIcon } from "lucide-react";

export const metadata = {
  title: "Order Confirmed | The Awareness Cafe",
  description: "Your order has been placed successfully!",
};

export default async function OrderConfirmationPage({ params }) {
  const { orderId } = await params;

  // Build WhatsApp message
  const waMsg = encodeURIComponent(
    `🎉 New Order Received!\n\nOrder ID: ${orderId}\n\nPlease check your admin dashboard for full details.\n\n— The Awareness Cafe`
  );
  const waLink = `https://wa.me/918750155505?text=${waMsg}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        {/* Success Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-[#C6FF00]/10 flex items-center justify-center mx-auto animate-pulse">
            <CheckCircle className="w-12 h-12 text-[#C6FF00]" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
          Order <span className="text-[#C6FF00]">Confirmed!</span>
        </h1>

        <div className="glass-card p-6 mb-6">
          <p className="text-gray-400 text-sm mb-2">Your Order ID</p>
          <p className="text-[#C6FF00] text-2xl font-bold tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
            {orderId}
          </p>
        </div>

        <div className="glass-card p-6 mb-6 text-left space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚚</span>
            <div>
              <p className="text-white font-medium text-sm">Estimated Delivery</p>
              <p className="text-[#C6FF00] font-bold">30 – 45 minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <p className="text-white font-medium text-sm">Payment</p>
              <p className="text-gray-400 text-sm">Cash on Delivery (COD)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📞</span>
            <div>
              <p className="text-white font-medium text-sm">Need help?</p>
              <a href="tel:+918750155505" className="text-[#C6FF00] text-sm hover:underline">+91 87501 55505</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="neon-btn flex-1 text-center py-3 flex items-center justify-center gap-2">
            💬 Notify on WhatsApp
          </a>
          <Link href="/" className="neon-btn-outline flex-1 text-center py-3 flex items-center justify-center gap-2">
            <HomeIcon className="w-4 h-4" /> Back Home
          </Link>
        </div>

        <p className="text-gray-500 text-xs mt-6">
          Thank you for choosing The Awareness Cafe ☕ Your food is being prepared with love ❤️
        </p>
      </div>
    </div>
  );
}
