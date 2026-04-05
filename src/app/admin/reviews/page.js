"use client";
import { useState, useEffect, useCallback } from "react";
import { Check, X as XIcon, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews?filter=${filter}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [token, filter]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleAction = async (id, approve) => {
    await fetch("/api/admin/reviews", { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ id, is_approved: approve }) });
    toast.success(approve ? "Approved!" : "Rejected."); fetchReviews();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    await fetch("/api/admin/reviews", { method: "DELETE", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ id }) });
    toast.success("Deleted"); fetchReviews();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Review Moderation</h1>
          <p className="text-[#8f93ac] text-sm mt-0.5">{reviews.length} {filter} reviews</p>
        </div>
        <div className="flex gap-2">
          {["pending", "approved", "all"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all capitalize
                ${filter === f ? "bg-gradient-to-r from-[#845adf] to-[#6e3bd0] text-white" : "bg-[#101325] border border-[#1e2139] text-[#8f93ac] hover:text-white"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-32 shimmer rounded-xl" />)}</div>
      ) : reviews.length === 0 ? (
        <div className="bg-[#101325] border border-[#1e2139] rounded-xl p-12 text-center">
          <p className="text-[#8f93ac]">No {filter} reviews.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review.id} className="bg-[#101325] border border-[#1e2139] rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#845adf] to-[#6e3bd0] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {review.customer_name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-medium text-sm">{review.customer_name}</h4>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-[#2a2d4a]"}`} />)}
                    </div>
                    <span className={`ml-auto px-2 py-0.5 rounded-full text-[9px] font-medium ${review.is_approved ? "bg-[#26bf94]/10 text-[#26bf94]" : "bg-amber-500/10 text-amber-400"}`}>
                      {review.is_approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="text-[#8f93ac] text-sm leading-relaxed">{review.review_text}</p>
                  <p className="text-[#8f93ac]/50 text-[10px] mt-2">{new Date(review.created_at).toLocaleString("en-IN")}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-[#1e2139]">
                {!review.is_approved && (
                  <button onClick={() => handleAction(review.id, true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#26bf94]/10 text-[#26bf94] text-xs hover:bg-[#26bf94]/20 transition-all">
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                )}
                {review.is_approved && (
                  <button onClick={() => handleAction(review.id, false)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs hover:bg-amber-500/20 transition-all">
                    <XIcon className="w-3.5 h-3.5" /> Unapprove
                  </button>
                )}
                <button onClick={() => handleDelete(review.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e6533c]/10 text-[#e6533c] text-xs hover:bg-[#e6533c]/20 transition-all ml-auto">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
