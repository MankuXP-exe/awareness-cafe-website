"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("contacts");
  const [token, setToken] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (!t) {
      router.push("/admin/login");
      return;
    }
    setToken(t);
  }, [router]);

  const fetchContacts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    } finally {
      setLoading(false);
    }
  }, [token, router]);

  useEffect(() => {
    if (token) fetchContacts();
  }, [token, fetchContacts]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const tabs = [
    { key: "contacts", label: "📩 Contact Submissions", icon: "📩" },
    { key: "menu", label: "🍔 Menu Management", icon: "🍔" },
    { key: "settings", label: "⚙️ Settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#111] border-b border-[#2a2a2a] px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-8 w-40 md:h-10 md:w-48">
              <Image
                src="/logo.svg"
                alt="The Awareness Cafe Logo"
                fill
                className="object-contain object-left"
              />
            </div>
            <div className="border-l border-[#2a2a2a] pl-4">
              <h1 className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Admin Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-400 hover:text-[#C6FF00] text-sm transition-colors">
              ← Website
            </a>
            <button onClick={handleLogout} className="neon-btn-outline !py-2 !px-4 !text-xs">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`menu-filter-btn whitespace-nowrap ${activeTab === tab.key ? "active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "contacts" && (
          <ContactsTab contacts={contacts} loading={loading} onRefresh={fetchContacts} />
        )}
        {activeTab === "menu" && (
          <MenuTab token={token} />
        )}
        {activeTab === "settings" && (
          <SettingsTab />
        )}
      </div>
    </div>
  );
}

function ContactsTab({ contacts, loading, onRefresh }) {
  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4 animate-pulse">📩</div>
        <p className="text-gray-400">Loading submissions...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Contact Submissions ({contacts.length})
        </h2>
        <button onClick={onRefresh} className="neon-btn-outline !py-2 !px-4 !text-xs">
          🔄 Refresh
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-400">No submissions yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <div key={contact._id} className="glass-card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C6FF00]/10 flex items-center justify-center text-[#C6FF00] font-bold text-sm">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">{contact.name}</h4>
                    <a href={`tel:${contact.phone}`} className="text-[#C6FF00] text-xs hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                </div>
                <span className="text-gray-500 text-xs">
                  {new Date(contact.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-gray-300 text-sm bg-[#1a1a1a] rounded-lg p-3">{contact.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MenuTab({ token }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", price: "", desc: "", category: "", image: "" });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      setMenuItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ name: "", price: "", desc: "", category: "", image: "" });
        fetchMenu();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await fetch(`/api/menu/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4 animate-pulse">🍔</div>
        <p className="text-gray-400">Loading menu...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Menu Items ({menuItems.length})
        </h2>
        <button onClick={() => setShowForm(!showForm)} className="neon-btn !py-2 !px-4 !text-xs">
          {showForm ? "✕ Cancel" : "+ Add Item"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="glass-card p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["name", "price", "category", "image", "desc"].map((field) => (
              <div key={field} className={field === "desc" ? "sm:col-span-2" : ""}>
                <label className="text-white text-xs font-medium mb-1 block capitalize">{field}</label>
                <input
                  type="text"
                  value={formData[field]}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))}
                  placeholder={`Enter ${field}`}
                  className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white 
                    placeholder-gray-500 text-sm focus:outline-none focus:border-[#C6FF00]/50 transition-all"
                />
              </div>
            ))}
          </div>
          <button type="submit" className="neon-btn mt-4 !py-2 !px-6 !text-xs">
            Add Item
          </button>
        </form>
      )}

      {menuItems.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-4xl mb-4">🍽️</div>
          <p className="text-gray-400">No menu items in database. Menu is loaded from static data.</p>
          <p className="text-gray-500 text-sm mt-2">Add items here to override static menu data.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {menuItems.map((item) => (
            <div key={item._id} className="glass-card p-4 flex items-center justify-between">
              <div>
                <h4 className="text-white font-semibold text-sm">{item.name}</h4>
                <p className="text-gray-400 text-xs">{item.category} • {item.price}</p>
              </div>
              <button onClick={() => handleDelete(item._id)} className="text-red-400 hover:text-red-300 text-sm">
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsTab() {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-heading)" }}>
        Settings
      </h2>
      <div className="glass-card p-6 space-y-6">
        <div>
          <h3 className="text-white font-semibold text-sm mb-2">Cafe Details</h3>
          <div className="bg-[#1a1a1a] rounded-lg p-4 space-y-2 text-sm">
            <p className="text-gray-400"><span className="text-gray-300 font-medium">Name:</span> The Awareness Cafe</p>
            <p className="text-gray-400"><span className="text-gray-300 font-medium">Phone:</span> +91 87501 55505</p>
            <p className="text-gray-400"><span className="text-gray-300 font-medium">Address:</span> Gadi Budhera Road, Near Vaishno Devi Mandir, Haryana 122505</p>
          </div>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm mb-2">Database Status</h3>
          <div className="bg-[#1a1a1a] rounded-lg p-4">
            <p className="text-gray-400 text-sm">
              Database connection is configured via <code className="text-[#C6FF00] bg-black/30 px-1 rounded">MONGODB_URI</code> environment variable.
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm mb-2">Admin Credentials</h3>
          <div className="bg-[#1a1a1a] rounded-lg p-4">
            <p className="text-gray-400 text-sm">
              Credentials are set via <code className="text-[#C6FF00] bg-black/30 px-1 rounded">ADMIN_USER</code> and{" "}
              <code className="text-[#C6FF00] bg-black/30 px-1 rounded">ADMIN_PASSWORD</code> environment variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
