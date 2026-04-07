"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Package, UtensilsCrossed, Image as ImageIcon, Star, LogOut, Menu, X, ChevronRight, Bell, MessageSquare, Users } from "lucide-react";

const sidebarLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard", badge: null },
  { href: "/admin/orders", icon: Package, label: "Orders", badge: "live" },
  { href: "/admin/menu", icon: UtensilsCrossed, label: "Menu Items", badge: null },
  { href: "/admin/gallery", icon: ImageIcon, label: "Gallery", badge: null },
  { href: "/admin/team", icon: Users, label: "Team", badge: null },
  { href: "/admin/reviews", icon: Star, label: "Reviews", badge: null },
  { href: "/admin/contacts", icon: MessageSquare, label: "Bookings", badge: null },
];

const sidebarCategories = [
  { label: "MAIN", links: [0, 1, 6] },
  { label: "MANAGEMENT", links: [2, 3, 4, 5] },
];

export default function AdminLayout({ children }) {
  const [token, setToken] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") return;
    const t = localStorage.getItem("admin_token");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
  }, [pathname, router]);

  if (pathname === "/admin/login") return children;

  if (!token && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen bg-[#0c0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#845adf] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Authenticating...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0c0e1a] flex">
      {/* Sidebar — Desktop */}
      <aside className={`hidden lg:flex flex-col ${collapsed ? "w-[72px]" : "w-[260px]"} bg-[#101325] border-r border-[#1e2139] fixed top-0 bottom-0 left-0 z-30 transition-all duration-300`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-[#1e2139]">
          {!collapsed ? (
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="relative h-8 w-36">
                <Image src="/logo.svg" alt="Logo" fill className="object-contain object-left" />
              </div>
            </Link>
          ) : (
            <Link href="/admin/dashboard" className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#845adf] to-[#6e3bd0] flex items-center justify-center text-white font-bold text-sm mx-auto">
              AC
            </Link>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-hide">
          {sidebarCategories.map((cat) => (
            <div key={cat.label} className="mb-4">
              {!collapsed && (
                <p className="px-5 text-[10px] font-semibold text-gray-500 tracking-[0.15em] uppercase mb-2">{cat.label}</p>
              )}
              <div className="space-y-0.5 px-3">
                {cat.links.map((idx) => {
                  const link = sidebarLinks[idx];
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link key={link.href} href={link.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all group
                        ${isActive
                          ? "bg-gradient-to-r from-[#845adf]/20 to-transparent text-[#845adf]"
                          : "text-[#8f93ac] hover:text-white hover:bg-[#1a1d35]"
                        }`}
                    >
                      <Icon className={`w-[18px] h-[18px] ${isActive ? "text-[#845adf]" : "text-[#8f93ac] group-hover:text-white"}`} />
                      {!collapsed && (
                        <>
                          <span>{link.label}</span>
                          {link.badge === "live" && (
                            <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400 animate-pulse">LIVE</span>
                          )}
                          {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[#1e2139]">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2 px-3 py-2 text-[#8f93ac] hover:text-white text-xs transition-colors mb-1 rounded-lg hover:bg-[#1a1d35]">
              ← Back to Website
            </Link>
          )}
          <button onClick={handleLogout}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all ${collapsed ? "justify-center" : ""} w-full`}>
            <LogOut className="w-[18px] h-[18px]" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#101325] border-b border-[#1e2139] px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 rounded-lg bg-[#1a1d35] flex items-center justify-center text-[#8f93ac]">
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative h-7 w-28">
            <Image src="/logo.svg" alt="Logo" fill className="object-contain object-left" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-[#1a1d35] flex items-center justify-center relative">
            <Bell className="w-4 h-4 text-[#8f93ac]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#845adf] to-[#6e3bd0] flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-[260px] bg-[#101325] border-r border-[#1e2139] z-50 lg:hidden flex flex-col">
            <div className="h-14 flex items-center justify-between px-4 border-b border-[#1e2139]">
              <div className="relative h-7 w-28">
                <Image src="/logo.svg" alt="Logo" fill className="object-contain object-left" />
              </div>
              <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-lg bg-[#1a1d35] flex items-center justify-center text-[#8f93ac]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 py-4 overflow-y-auto">
              {sidebarCategories.map((cat) => (
                <div key={cat.label} className="mb-4">
                  <p className="px-5 text-[10px] font-semibold text-gray-500 tracking-[0.15em] uppercase mb-2">{cat.label}</p>
                  <div className="space-y-0.5 px-3">
                    {cat.links.map((idx) => {
                      const link = sidebarLinks[idx];
                      const Icon = link.icon;
                      const isActive = pathname === link.href;
                      return (
                        <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all
                            ${isActive ? "bg-[#845adf]/20 text-[#845adf]" : "text-[#8f93ac] hover:text-white hover:bg-[#1a1d35]"}`}>
                          <Icon className="w-[18px] h-[18px]" />
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
            <div className="p-3 border-t border-[#1e2139]">
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] text-red-400 hover:bg-red-500/10 w-full">
                <LogOut className="w-[18px] h-[18px]" /> Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"} pt-14 lg:pt-0 min-h-screen transition-all duration-300`}>
        {/* Top Header Bar */}
        <div className="hidden lg:flex h-16 items-center justify-between px-6 border-b border-[#1e2139] bg-[#101325]/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setCollapsed(!collapsed)} className="w-8 h-8 rounded-lg bg-[#1a1d35] flex items-center justify-center text-[#8f93ac] hover:text-white transition-colors">
              <Menu className="w-4 h-4" />
            </button>
            <div className="text-[13px] text-[#8f93ac]">
              <span className="text-gray-500">/</span> {pathname?.split("/").pop()?.replace(/-/g, " ") || "dashboard"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1a1d35] flex items-center justify-center relative cursor-pointer hover:bg-[#252847] transition-colors">
              <Bell className="w-4 h-4 text-[#8f93ac]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <div className="flex items-center gap-2 pl-3 border-l border-[#1e2139]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#845adf] to-[#6e3bd0] flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <div><p className="text-white text-xs font-medium">Admin</p><p className="text-[#8f93ac] text-[10px]">Owner</p></div>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
