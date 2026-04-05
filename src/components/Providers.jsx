"use client";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import CartDrawer from "./CartDrawer";
import Chatbot from "./Chatbot";
import MobileNav from "./MobileNav";

/**
 * Client-side providers wrapper.
 * Includes toast, cart drawer, AI chatbot, and mobile nav.
 * Chatbot + MobileNav hidden on admin routes.
 */
export default function Providers({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {children}
      <CartDrawer />
      {!isAdmin && <Chatbot />}
      {!isAdmin && <MobileNav />}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#141414",
            color: "#e0e0e0",
            border: "1px solid #2a2a2a",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#C6FF00", secondary: "#000" },
          },
        }}
      />
    </>
  );
}
