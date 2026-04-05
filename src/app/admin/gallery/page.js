"use client";
import { useState, useEffect, useCallback } from "react";
import { Upload, Trash2, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ title: "", category: "food", file: null });
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setImages(data.images || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.file) return toast.error("Select an image");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", form.file); fd.append("title", form.title); fd.append("category", form.category);
      const res = await fetch("/api/admin/gallery", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      if (res.ok) { toast.success("Uploaded!"); setShowUpload(false); setForm({ title: "", category: "food", file: null }); fetchImages(); }
      else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.error || "Upload failed");
      }
    } catch { toast.error("Network Error"); } finally { setUploading(false); }
  };

  const handleDelete = async (id, url) => {
    if (!confirm("Delete?")) return;
    await fetch("/api/admin/gallery", { method: "DELETE", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ id, image_url: url }) });
    toast.success("Deleted"); fetchImages();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Gallery</h1>
          <p className="text-[#8f93ac] text-sm mt-0.5">{images.length} images</p>
        </div>
        <button onClick={() => setShowUpload(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#845adf] to-[#6e3bd0] text-white text-xs font-medium">
          <Upload className="w-3.5 h-3.5" /> Upload
        </button>
      </div>

      {showUpload && (<>
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setShowUpload(false)} />
        <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-[#101325] border border-[#1e2139] rounded-2xl p-6 z-[51]">
          <div className="flex justify-between mb-4">
            <h2 className="text-white font-bold text-base">Upload Image</h2>
            <button onClick={() => setShowUpload(false)}><X className="w-4 h-4 text-[#8f93ac]" /></button>
          </div>
          <form onSubmit={handleUpload} className="space-y-4">
            <input type="file" accept="image/*" onChange={e => setForm(p => ({ ...p, file: e.target.files?.[0] }))}
              className="w-full px-3 py-2 rounded-lg bg-[#1a1d35] border border-[#2a2d4a] text-white text-sm file:mr-2 file:bg-[#845adf] file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:text-xs" />
            <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Caption"
              className="w-full px-3 py-2.5 rounded-lg bg-[#1a1d35] border border-[#2a2d4a] text-white text-sm placeholder-[#8f93ac] focus:outline-none focus:border-[#845adf]/50" />
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg bg-[#1a1d35] border border-[#2a2d4a] text-white text-sm focus:outline-none focus:border-[#845adf]/50">
              {["food","interior","exterior","team"].map(c => <option key={c}>{c}</option>)}
            </select>
            <button type="submit" disabled={uploading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#845adf] to-[#6e3bd0] text-white text-sm font-medium disabled:opacity-50">
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      </>)}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(8)].map((_, i) => <div key={i} className="aspect-square shimmer rounded-xl" />)}</div>
      ) : images.length === 0 ? (
        <div className="bg-[#101325] border border-[#1e2139] rounded-xl p-12 text-center">
          <p className="text-[#8f93ac]">No images yet. Upload some!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square border border-[#1e2139]">
              <Image src={img.image_url} alt={img.title||"Gallery"} fill className="object-cover" sizes="25vw" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => handleDelete(img.id, img.image_url)} className="w-10 h-10 rounded-xl bg-[#e6533c]/20 text-[#e6533c] flex items-center justify-center"><Trash2 className="w-5 h-5" /></button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-2">
                <p className="text-white text-xs truncate">{img.title}</p>
                <span className="text-[#845adf] text-[10px] capitalize">{img.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
