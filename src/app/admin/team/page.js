"use client";
import { useState, useEffect, useCallback } from "react";
import { Upload, Trash2, Edit2, X, Plus } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function AdminTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [form, setForm] = useState({ id: "", name: "", role: "", desc: "", file: null, existing_image_url: "" });
  const [previewUrl, setPreviewUrl] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/team", { 
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store" 
      });
      const data = await res.json();
      setTeam(data.team || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchTeam(); }, [fetchTeam]);

  const openAddModal = () => {
    setForm({ id: "", name: "", role: "", desc: "", file: null, existing_image_url: "" });
    setPreviewUrl("");
    setShowModal(true);
  };

  const openEditModal = (member) => {
    setForm({ 
      id: member.id, 
      name: member.name, 
      role: member.role, 
      desc: member.desc, 
      file: null, 
      existing_image_url: member.image_url 
    });
    setPreviewUrl(member.image_url);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((p) => ({ ...p, file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.role) return toast.error("Name and Role are required");
    
    setUploading(true);
    try {
      const fd = new FormData();
      if (form.id) fd.append("id", form.id);
      fd.append("name", form.name);
      fd.append("role", form.role);
      fd.append("desc", form.desc);
      if (form.existing_image_url) fd.append("existing_image_url", form.existing_image_url);
      if (form.file) fd.append("file", form.file);

      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });

      if (res.ok) {
        toast.success(form.id ? "Member updated!" : "Member added!");
        setShowModal(false);
        fetchTeam();
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.error || "Upload failed");
      }
    } catch {
      toast.error("Network Error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    
    try {
      const res = await fetch("/api/admin/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        toast.success("Member removed");
        fetchTeam();
      } else {
        toast.error("Failed to remove member");
      }
    } catch {
      toast.error("Network Error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Team Management</h1>
          <p className="text-[#8f93ac] text-sm mt-0.5">{team.length} members</p>
        </div>
        <button onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#845adf] to-[#6e3bd0] text-white text-xs font-medium">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {showModal && (<>
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#101325] border border-[#1e2139] rounded-2xl p-6 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-bold text-lg">{form.id ? "Edit Member" : "Add Team Member"}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-[#1a1d35] flex items-center justify-center hover:bg-[#252847] transition-colors"><X className="w-4 h-4 text-[#8f93ac]" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Image Preview */}
              <div className="flex justify-center mb-4">
                <div className="relative w-24 h-24 rounded-full bg-[#1a1d35] border-2 border-dashed border-[#2a2d4a] flex items-center justify-center overflow-hidden group">
                  {previewUrl ? (
                    <Image src={previewUrl} alt="Profile preview" fill className="object-cover" />
                  ) : (
                    <Upload className="w-6 h-6 text-[#8f93ac] group-hover:text-white transition-colors" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <span className="text-xs text-white font-medium">Change</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#8f93ac] mb-1.5 uppercase tracking-wider">Name</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. John Doe"
                  className="w-full px-3 py-2.5 rounded-lg bg-[#1a1d35] border border-[#2a2d4a] text-white text-sm placeholder-[#4a4d6a] focus:outline-none focus:border-[#845adf]/50" required />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#8f93ac] mb-1.5 uppercase tracking-wider">Role / Title</label>
                <input type="text" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="e.g. Owner & Founder"
                  className="w-full px-3 py-2.5 rounded-lg bg-[#1a1d35] border border-[#2a2d4a] text-white text-sm placeholder-[#4a4d6a] focus:outline-none focus:border-[#845adf]/50" required />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#8f93ac] mb-1.5 uppercase tracking-wider">Description</label>
                <textarea rows="3" value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} placeholder="Short bio or description..."
                  className="w-full px-3 py-2.5 rounded-lg bg-[#1a1d35] border border-[#2a2d4a] text-white text-sm placeholder-[#4a4d6a] focus:outline-none focus:border-[#845adf]/50 resize-none" />
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg bg-[#1a1d35] text-white text-sm font-medium hover:bg-[#252847] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={uploading}
                  className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#845adf] to-[#6e3bd0] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                  {uploading ? "Saving..." : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>)}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="h-40 shimmer rounded-xl" />)}</div>
      ) : team.length === 0 ? (
        <div className="bg-[#101325] border border-[#1e2139] rounded-xl p-12 text-center">
          <p className="text-[#8f93ac] mb-3">No team members added yet.</p>
          <button onClick={openAddModal} className="text-[#845adf] text-sm hover:underline font-medium">Add your first team member</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map(member => (
            <div key={member.id} className="relative group bg-[#101325] border border-[#1e2139] rounded-xl p-6 hover:border-[#845adf]/30 transition-colors">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => openEditModal(member)} className="w-8 h-8 rounded-lg bg-[#845adf]/20 text-[#845adf] flex items-center justify-center hover:bg-[#845adf]/30 transition-colors tooltip" aria-label="Edit"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(member.id)} className="w-8 h-8 rounded-lg bg-[#e6533c]/20 text-[#e6533c] flex items-center justify-center hover:bg-[#e6533c]/30 transition-colors tooltip" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full mb-4 relative overflow-hidden bg-gradient-to-br from-[#845adf]/20 to-[#6e3bd0]/10 flex items-center justify-center border-2 border-[#1e2139]">
                  {member.image_url ? (
                    <Image src={member.image_url} alt={member.name} fill className="object-cover" sizes="80px" />
                  ) : (
                    <span className="text-3xl">👨‍🍳</span>
                  )}
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{member.name}</h3>
                <span className="text-[#845adf] text-xs font-semibold uppercase tracking-wider mb-3 px-2 py-1 bg-[#845adf]/10 rounded-md inline-block">{member.role}</span>
                <p className="text-[#8f93ac] text-sm leading-relaxed line-clamp-3">{member.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
