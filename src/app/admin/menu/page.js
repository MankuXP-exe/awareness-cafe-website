"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import toast from "react-hot-toast";
import { menuData } from "@/lib/data";

const categories = ["Breakfast", "Shakes", "Smoothies", "Refreshments", "Burgers", "Snacks", "Pizza", "Sandwich", "Tea", "Coffee"];

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", category: "Breakfast", price: "", image_url: "", is_available: true });
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/menu", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.items?.length > 0) { setItems(data.items); }
      else {
        const flat = menuData.flatMap(c => c.items.map(i => ({ ...i, category: c.category, is_available: true, id: i.name })));
        setItems(flat);
      }
    } catch {
      const flat = menuData.flatMap(c => c.items.map(i => ({ ...i, category: c.category, is_available: true, id: i.name })));
      setItems(flat);
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchMenu(); }, [fetchMenu]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editItem ? "PUT" : "POST";
    const body = editItem ? { ...form, id: editItem.id } : { ...form };
    const res = await fetch("/api/admin/menu", {
      method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      toast.success(editItem ? "Updated!" : "Added!");
      setShowForm(false); setEditItem(null);
      setForm({ name: "", description: "", category: "Breakfast", price: "", image_url: "", is_available: true });
      fetchMenu();
    } else toast.error("Failed to save");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    await fetch("/api/admin/menu", { method: "DELETE", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ id }) });
    toast.success("Deleted!"); fetchMenu();
  };

  const toggleAvailability = async (item) => {
    await fetch("/api/admin/menu", { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: item.id, is_available: !item.is_available }) });
    fetchMenu();
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, description: item.description || item.desc || "", category: item.category, price: item.price, image_url: item.image_url || item.image || "", is_available: item.is_available !== false });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Menu Management</h1>
          <p className="text-[#8f93ac] text-sm mt-0.5">{items.length} items</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm({ name: "", description: "", category: "Breakfast", price: "", image_url: "", is_available: true }); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#845adf] to-[#6e3bd0] text-white text-xs font-medium">
          <Plus className="w-3.5 h-3.5" /> Add Item
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setShowForm(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-[#101325] border border-[#1e2139] rounded-2xl p-6 z-[51] max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-base">{editItem ? "Edit Item" : "Add New Item"}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg bg-[#1a1d35] flex items-center justify-center text-[#8f93ac]"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-white text-xs font-medium mb-1.5 block">Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#1a1d35] border border-[#2a2d4a] text-white text-sm placeholder-[#8f93ac] focus:outline-none focus:border-[#845adf]/50" placeholder="e.g. Chicken Tikki Burger" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white text-xs font-medium mb-1.5 block">Category *</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#1a1d35] border border-[#2a2d4a] text-white text-sm focus:outline-none focus:border-[#845adf]/50">
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-white text-xs font-medium mb-1.5 block">Price *</label>
                  <input type="text" required value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#1a1d35] border border-[#2a2d4a] text-white text-sm placeholder-[#8f93ac] focus:outline-none focus:border-[#845adf]/50" placeholder="₹49" />
                </div>
              </div>
              <div>
                <label className="text-white text-xs font-medium mb-1.5 block">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#1a1d35] border border-[#2a2d4a] text-white text-sm placeholder-[#8f93ac] focus:outline-none focus:border-[#845adf]/50 resize-none" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="avail" checked={form.is_available} onChange={e => setForm(p => ({ ...p, is_available: e.target.checked }))} className="accent-[#845adf]" />
                <label htmlFor="avail" className="text-white text-sm">Available</label>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#845adf] to-[#6e3bd0] text-white text-sm font-medium flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> {editItem ? "Update" : "Add Item"}
              </button>
            </form>
          </div>
        </>
      )}

      {/* Items List */}
      {loading ? (
        <div className="space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="h-16 shimmer rounded-xl" />)}</div>
      ) : (
        <div className="bg-[#101325] border border-[#1e2139] rounded-xl overflow-hidden">
          {items.map((item, i) => (
            <div key={item.id || item.name} className={`p-4 flex items-center gap-4 hover:bg-[#1a1d35]/50 transition-colors ${i < items.length - 1 ? "border-b border-[#1e2139]/50" : ""}`}>
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.is_available !== false ? "bg-[#26bf94]" : "bg-[#e6533c]"}`} />
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm truncate">{item.name}</h4>
                <p className="text-[#8f93ac] text-xs">{item.category} • {item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleAvailability(item)} className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${item.is_available !== false ? "bg-[#26bf94]/10 text-[#26bf94]" : "bg-[#e6533c]/10 text-[#e6533c]"}`}>
                  {item.is_available !== false ? "Active" : "Inactive"}
                </button>
                <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg bg-[#1a1d35] flex items-center justify-center text-[#8f93ac] hover:text-[#845adf]">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#e6533c]/60 hover:text-[#e6533c] hover:bg-[#e6533c]/10">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
