"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("admin_token", data.token);
        router.push("/admin");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative h-16 w-64 mb-6">
            <Image
              src="/logo.svg"
              alt="The Awareness Cafe Logo"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-gray-400 text-sm">Secure Access</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="glass-card p-8">
          <div className="space-y-5">
            <div>
              <label htmlFor="username" className="text-white text-sm font-medium mb-2 block">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-white 
                  placeholder-gray-500 text-sm focus:outline-none focus:border-[#C6FF00]/50 transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-white text-sm font-medium mb-2 block">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-white 
                  placeholder-gray-500 text-sm focus:outline-none focus:border-[#C6FF00]/50 transition-all"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 text-red-400 text-sm border border-red-500/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="neon-btn w-full py-4 text-center disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          <a href="/" className="text-[#C6FF00] hover:underline">← Back to website</a>
        </p>
      </div>
    </div>
  );
}
