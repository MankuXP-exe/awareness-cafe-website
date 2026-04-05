"use client";
import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Trash2, CheckCircle, MailWarning } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminContacts() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contacts", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setMessages(data.messages || []);
    } catch { 
      toast.error("Failed to load messages");
    } finally { 
      setLoading(false); 
    }
  }, [token]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        toast.success("Status updated");
        fetchMessages();
      } else {
        toast.error("Update failed");
      }
    } catch {
      toast.error("Error updating status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await fetch("/api/admin/contacts", { 
        method: "DELETE", 
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, 
        body: JSON.stringify({ id }) 
      });
      toast.success("Message deleted");
      fetchMessages();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#845adf]" />
            Bookings & Messages
          </h1>
          <p className="text-[#8f93ac] text-sm mt-0.5">Manage customer inquiries and table reservations</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 shimmer rounded-xl" />)}
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-[#101325] border border-[#1e2139] rounded-xl p-12 text-center">
          <MailWarning className="w-12 h-12 text-[#8f93ac] mx-auto mb-4 opacity-50" />
          <p className="text-[#8f93ac]">No messages received yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => {
            const isRead = msg.status === "confirmed";
            return (
              <div key={msg.id} className={`bg-[#101325] border ${isRead ? 'border-[#1e2139]/50 opacity-80' : 'border-[#845adf]/50'} rounded-xl p-5 relative transition-all`}>
                {!isRead && (
                  <div className="absolute top-5 right-5 flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#845adf] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#845adf]"></span>
                    </span>
                    <span className="text-xs text-[#845adf] font-bold tracking-wider">NEW</span>
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">{msg.customer_name}</h3>
                    <p className="text-sm font-medium text-[#C6FF00] mb-3">{msg.customer_phone}</p>
                    
                    <div className="bg-[#1a1d35] p-3 rounded-lg border border-[#2a2d4a]">
                      <p className="text-[#e2e8f0] text-sm whitespace-pre-wrap">{msg.notes}</p>
                    </div>
                    <p className="text-[10px] text-[#8f93ac] mt-3">
                      Received: {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto shrink-0 border-t border-[#1e2139] md:border-0 pt-4 md:pt-0">
                    {!isRead ? (
                      <button 
                        onClick={() => updateStatus(msg.id, "confirmed")}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1d35] hover:bg-[#26bf94]/10 text-[#26bf94] border border-[#2a2d4a] hover:border-[#26bf94]/30 rounded-lg text-xs font-medium transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateStatus(msg.id, "pending")}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1d35] hover:bg-[#8f93ac] text-[#8f93ac] hover:text-white border border-[#2a2d4a] rounded-lg text-xs font-medium transition-colors"
                      >
                        Mark Unread
                      </button>
                    )}
                    
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="w-9 h-9 rounded-lg bg-[#1a1d35] flex items-center justify-center text-[#e6533c]/80 hover:text-[#e6533c] hover:bg-[#e6533c]/10 border border-[#2a2d4a] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
