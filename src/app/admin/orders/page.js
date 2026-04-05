"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, Download, Eye, X, ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";

const statusColors = {
  pending: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  confirmed: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  preparing: { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400" },
  out_for_delivery: { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
  delivered: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  cancelled: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (search) params.append("search", search);
      const res = await fetch(`/api/admin/orders?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch { toast.error("Failed to load orders"); }
    finally { setLoading(false); }
  }, [token, statusFilter, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    await fetch("/api/admin/orders", {
      method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status }),
    });
    toast.success("Status updated!"); fetchOrders();
  };

  const exportCSV = () => {
    const headers = "Order#,Customer,Phone,Address,Items,Total,Status,Date\n";
    const rows = orders.map(o =>
      `${o.order_number},${o.customer_name},${o.customer_phone},"${o.customer_address}","${(o.items||[]).map(i=>`${i.name}x${i.qty}`).join('; ')}",${o.total},${o.status},${new Date(o.created_at).toLocaleDateString()}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `orders-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    toast.success("CSV exported!");
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Orders Management</h1>
          <p className="text-[#8f93ac] text-sm mt-0.5">{orders.length} total orders</p>
        </div>
        <button onClick={exportCSV} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#101325] border border-[#1e2139] text-white text-xs font-medium hover:bg-[#1a1d35] transition-colors">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8f93ac]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchOrders()}
            placeholder="Search by order#, name, phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#101325] border border-[#1e2139] text-white text-sm placeholder-[#8f93ac] focus:outline-none focus:border-[#845adf]/50" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-[#101325] border border-[#1e2139] text-white text-sm focus:outline-none focus:border-[#845adf]/50 min-w-[150px]">
          <option value="all">All Statuses</option>
          {["pending","confirmed","preparing","out_for_delivery","delivered","cancelled"].map(s =>
            <option key={s} value={s}>{s.replace(/_/g," ")}</option>
          )}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#101325] border border-[#1e2139] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e2139]">
                {["Order #", "Customer", "Items", "Total", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className={`text-left p-4 text-[#8f93ac] font-medium text-xs ${["Items","Date"].includes(h) ? "hidden md:table-cell" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={7} className="p-4"><div className="h-10 shimmer rounded-lg" /></td></tr>
              )) : orders.length === 0 ? (
                <tr><td colSpan={7} className="p-12 text-center text-[#8f93ac]">No orders found.</td></tr>
              ) : orders.map((order) => {
                const sc = statusColors[order.status] || statusColors.pending;
                return (
                  <tr key={order.id} className="border-b border-[#1e2139]/50 hover:bg-[#1a1d35]/50 transition-colors">
                    <td className="p-4">
                      <span className="text-[#845adf] font-mono font-semibold text-xs">{order.order_number}</span>
                      {order.is_custom_order && <span className="block text-[8px] text-purple-400 mt-0.5">🤖 AI</span>}
                    </td>
                    <td className="p-4">
                      <p className="text-white text-xs font-medium">{order.customer_name}</p>
                      <p className="text-[#8f93ac] text-[10px]">{order.customer_phone}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell max-w-[180px]">
                      <p className="text-[#8f93ac] text-xs truncate">{(order.items||[]).map(i => `${i.name}×${i.qty}`).join(", ")}</p>
                    </td>
                    <td className="p-4"><span className="text-[#26bf94] font-bold">₹{order.total}</span></td>
                    <td className="p-4">
                      <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-medium border-0 ${sc.bg} ${sc.text} focus:outline-none cursor-pointer appearance-none`}>
                        {["pending","confirmed","preparing","out_for_delivery","delivered","cancelled"].map(s =>
                          <option key={s} value={s} className="bg-[#101325] text-white">{s.replace(/_/g," ")}</option>
                        )}
                      </select>
                    </td>
                    <td className="p-4 hidden md:table-cell text-[#8f93ac] text-[10px]">
                      {new Date(order.created_at).toLocaleString("en-IN", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" })}
                    </td>
                    <td className="p-4">
                      <button onClick={() => setSelectedOrder(order)} className="w-8 h-8 rounded-lg bg-[#1a1d35] flex items-center justify-center text-[#8f93ac] hover:text-[#845adf] transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setSelectedOrder(null)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-2xl mx-auto bg-[#101325] border border-[#1e2139] rounded-2xl p-6 z-[51] max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-lg">Order {selectedOrder.order_number}</h2>
              <button onClick={() => setSelectedOrder(null)} className="w-9 h-9 rounded-lg bg-[#1a1d35] flex items-center justify-center text-[#8f93ac] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-[#1a1d35] rounded-xl p-4">
                <p className="text-[#8f93ac] text-xs mb-1">Customer</p>
                <p className="text-white font-medium text-sm">{selectedOrder.customer_name}</p>
                <p className="text-[#8f93ac] text-xs">{selectedOrder.customer_phone}</p>
              </div>
              <div className="bg-[#1a1d35] rounded-xl p-4">
                <p className="text-[#8f93ac] text-xs mb-1">Address</p>
                <p className="text-white text-sm">{selectedOrder.customer_address}</p>
              </div>
            </div>
            <div className="bg-[#1a1d35] rounded-xl p-4 mb-4">
              <p className="text-[#8f93ac] text-xs mb-3">Items</p>
              {(selectedOrder.items || []).map((item, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-[#2a2d4a] last:border-0">
                  <span className="text-white text-sm">{item.name} × {item.qty}</span>
                  <span className="text-[#26bf94] font-bold text-sm">₹{(item.price || 0) * item.qty}</span>
                </div>
              ))}
              <div className="border-t border-[#2a2d4a] mt-2 pt-2 flex justify-between">
                <span className="text-white font-bold">Total</span>
                <span className="text-[#26bf94] font-bold text-lg">₹{selectedOrder.total}</span>
              </div>
            </div>
            {selectedOrder.notes && (
              <div className="bg-[#1a1d35] rounded-xl p-4">
                <p className="text-[#8f93ac] text-xs mb-1">Notes</p>
                <p className="text-white text-sm">{selectedOrder.notes}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
