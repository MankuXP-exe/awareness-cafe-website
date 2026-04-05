"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) { localStorage.setItem("admin_token", data.token); router.push("/admin"); }
      else setError(data.error || "Invalid credentials");
    } catch { setError("Login failed."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0c0e1a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative h-14 w-56 mb-5">
            <Image src="/logo.svg" alt="The Awareness Cafe Logo" fill className="object-contain" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#845adf]/10 border border-[#845adf]/20">
            <div className="w-2 h-2 rounded-full bg-[#845adf] animate-pulse" />
            <span className="text-[#845adf] text-[10px] font-medium tracking-wider uppercase">Admin Portal</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-[#101325] border border-[#1e2139] rounded-2xl p-7">
          <h2 className="text-white text-lg font-bold text-center mb-1">Sign In</h2>
          <p className="text-[#8f93ac] text-xs text-center mb-6">Enter your credentials to access the dashboard</p>

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="text-white text-xs font-medium mb-1.5 block">Username</label>
              <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 rounded-lg bg-[#1a1d35] border border-[#2a2d4a] text-white placeholder-[#8f93ac] text-sm focus:outline-none focus:border-[#845adf]/50 transition-all" />
            </div>
            <div>
              <label htmlFor="password" className="text-white text-xs font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-lg bg-[#1a1d35] border border-[#2a2d4a] text-white placeholder-[#8f93ac] text-sm focus:outline-none focus:border-[#845adf]/50 transition-all pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f93ac] hover:text-white">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-[#e6533c]/10 text-[#e6533c] text-sm border border-[#e6533c]/20">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#845adf] to-[#6e3bd0] text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="text-center text-[#8f93ac] text-xs mt-6">
          <a href="/" className="text-[#845adf] hover:underline">← Back to website</a>
        </p>
      </div>
    </div>
  );
}
