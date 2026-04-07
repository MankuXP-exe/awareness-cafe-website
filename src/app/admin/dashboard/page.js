"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Package, CheckCircle, XCircle, DollarSign, TrendingUp, Clock, RefreshCw, ArrowUpRight, ArrowDownRight, Flame, ShoppingBag, MessageSquare, ChevronRight } from "lucide-react";

// Simple SVG donut chart
function DonutChart({ data, total }) {
  const size = 160, strokeWidth = 22, radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((item, i) => {
          const dash = (item.value / (total || 1)) * circumference;
          const gap = circumference - dash;
          const currentOffset = offset;
          offset += dash;
          return (
            <circle key={i} cx={size/2} cy={size/2} r={radius}
              fill="none" stroke={item.color} strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-currentOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size/2} ${size/2})`}
              style={{ transition: "all 0.8s ease" }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-white text-2xl font-bold">{total}</span>
        <span className="text-[#8f93ac] text-[10px]">Total</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [statsRes, ordersRes, bookingsRes] = await Promise.all([
        fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/orders?limit=10", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/contacts", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setRecentOrders(data.orders || []);
      }
      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        setRecentBookings((data.messages || []).slice(0, 5));
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const statusColors = {
    pending: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
    confirmed: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
    preparing: { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400" },
    out_for_delivery: { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
    delivered: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
    cancelled: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const statCards = stats ? [
    { icon: Package, label: "Total Orders", value: stats.totalOrders || 0, change: "+12%", up: true,
      gradient: "from-[#845adf] to-[#6e3bd0]", iconBg: "bg-white/20" },
    { icon: DollarSign, label: "Total Revenue", value: `₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`, change: "+25%", up: true,
      gradient: "from-[#23b7e5] to-[#1a8fb5]", iconBg: "bg-white/20" },
    { icon: CheckCircle, label: "Delivered", value: stats.deliveredOrders || 0, change: `${stats.totalOrders ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0}%`, up: true,
      gradient: "from-[#26bf94] to-[#1ea07a]", iconBg: "bg-white/20" },
    { icon: TrendingUp, label: "Today's Revenue", value: `₹${(stats.todayRevenue || 0).toLocaleString("en-IN")}`, change: `${stats.todayOrders || 0} orders`, up: true,
      gradient: "from-[#f5b849] to-[#e09a2d]", iconBg: "bg-white/20" },
    { icon: MessageSquare, label: "Unread Bookings", value: stats.unreadBookings || 0, change: `Total: ${stats.totalBookings}`, up: stats.unreadBookings > 0,
      gradient: "from-[#845adf] to-[#3b82f6]", iconBg: "bg-white/20" },
  ] : [];

  const donutData = stats ? [
    { label: "Delivered", value: stats.deliveredOrders || 0, color: "#26bf94" },
    { label: "Pending", value: (stats.totalOrders || 0) - (stats.deliveredOrders || 0) - (stats.cancelledOrders || 0), color: "#845adf" },
    { label: "Cancelled", value: stats.cancelledOrders || 0, color: "#e6533c" },
  ] : [];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Welcome back, Admin! 👋
          </h1>
          <p className="text-[#8f93ac] text-sm mt-0.5">Track your orders, revenue and activity here.</p>
        </div>
        <button onClick={fetchData} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#845adf] to-[#6e3bd0] text-white text-xs font-medium hover:opacity-90 transition-opacity">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          {[...Array(5)].map((_, i) => <div key={i} className="h-[120px] shimmer rounded-xl" />)}
        </div>
      ) : (
        <>
          {/* Stat Cards — Colorful gradient like Ynex */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
            {statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${card.gradient} p-5`}
                >
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/5" />
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white/90 font-medium">
                        {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {card.change}
                      </div>
                    </div>
                    <p className="text-white/70 text-xs mb-1">{card.label}</p>
                    <p className="text-white text-2xl font-bold">{card.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Middle Row — Donut + Top Items + Most Ordered */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
            {/* Order Status Donut */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="lg:col-span-4 bg-[#101325] border border-[#1e2139] rounded-xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold text-sm">Order Status</h3>
                <span className="text-[#8f93ac] text-[10px]">All time</span>
              </div>
              <div className="flex justify-center mb-5">
                <DonutChart data={donutData} total={stats?.totalOrders || 0} />
              </div>
              <div className="space-y-2.5">
                {donutData.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[#8f93ac] text-xs">{item.label}</span>
                    </div>
                    <span className="text-white text-xs font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Ordered Items */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="lg:col-span-4 bg-[#101325] border border-[#1e2139] rounded-xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold text-sm">Top Items</h3>
                <span className="text-[#8f93ac] text-[10px]">By orders</span>
              </div>
              {stats?.mostOrderedItem ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-[#845adf]/10 border border-[#845adf]/20 rounded-lg">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#845adf] to-[#6e3bd0] flex items-center justify-center">
                      <Flame className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{stats.mostOrderedItem.name}</p>
                      <p className="text-[#845adf] text-xs">{stats.mostOrderedItem.count} orders</p>
                    </div>
                    <span className="text-[10px] bg-[#845adf]/20 text-[#845adf] px-2 py-0.5 rounded-full font-medium">#1</span>
                  </div>
                  {/* Placeholder for more items */}
                  {[2, 3, 4].map(rank => (
                    <div key={rank} className="flex items-center gap-3 p-3 bg-[#1a1d35]/50 rounded-lg">
                      <div className="w-9 h-9 rounded-lg bg-[#1a1d35] flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-[#8f93ac]" />
                      </div>
                      <div className="flex-1">
                        <div className="h-3 w-24 bg-[#1a1d35] rounded shimmer" />
                        <div className="h-2 w-16 bg-[#1a1d35] rounded shimmer mt-1.5" />
                      </div>
                      <span className="text-[10px] bg-[#1a1d35] text-[#8f93ac] px-2 py-0.5 rounded-full">#{rank}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-[#8f93ac]">
                  <ShoppingBag className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-xs">No order data yet</p>
                </div>
              )}
            </motion.div>

            {/* Recent Bookings Box */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="lg:col-span-4 bg-[#101325] border border-[#1e2139] rounded-xl overflow-hidden flex flex-col">
              <div className="p-5 flex items-center justify-between border-b border-[#1e2139]">
                <h3 className="text-white font-semibold text-sm">Recent Bookings</h3>
                <Link href="/admin/contacts" className="text-[#845adf] text-xs font-medium hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[300px]">
                {recentBookings.length === 0 ? (
                  <div className="p-10 text-center flex flex-col items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-[#8f93ac] opacity-20 mb-2" />
                    <p className="text-[#8f93ac] text-xs">No active bookings</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#1e2139]">
                    {recentBookings.map((msg) => (
                      <div key={msg.id} className="p-4 hover:bg-[#1a1d35]/30 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white text-xs font-bold truncate">{msg.name}</p>
                          {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-[#845adf] animate-pulse" />}
                        </div>
                        <p className="text-[#8f93ac] text-[10px] mb-2">{msg.phone}</p>
                        <p className="text-[#e2e8f0] text-[11px] line-clamp-1 italic">&quot;{msg.message}&quot;</p>
                        <p className="text-[9px] text-gray-600 mt-2">
                          {new Date(msg.created_at).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Recent Orders Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="bg-[#101325] border border-[#1e2139] rounded-xl overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-[#1e2139]">
              <h3 className="text-white font-semibold text-sm">Recent Orders</h3>
              <a href="/admin/orders" className="text-[#845adf] text-xs font-medium hover:underline flex items-center gap-1">
                View All <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e2139]">
                    {["Order #", "Customer", "Items", "Total", "Status", "Date", "Action"].map(h => (
                      <th key={h} className={`text-left p-4 text-[#8f93ac] font-medium text-xs ${["Items","Date"].includes(h) ? "hidden md:table-cell" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan={7} className="p-10 text-center text-[#8f93ac] text-sm">No orders yet 📦 They&apos;ll show up here!</td></tr>
                  ) : (
                    recentOrders.map((order) => {
                      const sc = statusColors[order.status] || statusColors.pending;
                      return (
                        <tr key={order.id} className="border-b border-[#1e2139]/50 hover:bg-[#1a1d35]/50 transition-colors">
                          <td className="p-4">
                            <span className="text-[#845adf] font-mono font-semibold text-xs">{order.order_number}</span>
                            {order.is_custom_order && <span className="ml-1.5 text-[8px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">AI</span>}
                          </td>
                          <td className="p-4">
                            <p className="text-white text-xs font-medium">{order.customer_name}</p>
                            <p className="text-[#8f93ac] text-[10px]">{order.customer_phone}</p>
                          </td>
                          <td className="p-4 hidden md:table-cell max-w-[180px]">
                            <p className="text-[#8f93ac] text-xs truncate">{(order.items || []).map(i => `${i.name}×${i.qty}`).join(", ")}</p>
                          </td>
                          <td className="p-4"><span className="text-[#26bf94] font-bold text-sm">₹{order.total}</span></td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium ${sc.bg} ${sc.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                              {order.status?.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            <span className="text-[#8f93ac] text-[10px]">
                              {new Date(order.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </td>
                          <td className="p-4">
                            <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="bg-[#1a1d35] border border-[#2a2d4a] text-white text-[10px] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#845adf]/50 cursor-pointer">
                              {["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"].map((s) => (
                                <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
