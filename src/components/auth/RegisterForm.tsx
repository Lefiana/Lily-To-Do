"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react"; // icons

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } else {
      const data = await res.json();
      alert(data.message || "Registration failed");
    }
  };

return (
  <section className="relative flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
    {/* Gradient blobs */}
    <div className="absolute w-[280px] h-[280px] bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse" />
    <div className="absolute w-[300px] h-[300px] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse" />

    {/* Glass container */}
    <div className="relative w-[380px] sm:w-[420px] p-6 text-white rounded-2xl border border-white/20 backdrop-blur-2xl bg-white/10 shadow-xl">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full border-4 border-white/70 mb-4 flex items-center justify-center bg-black/30">
          {/* Using a placeholder icon for a cleaner look */}
          <User size={48} className="text-white/70" />
        </div>
        <h2 className="text-2xl font-semibold">Create an Account</h2>
        <p className="text-gray-300 text-sm">Join us today!</p>
      </div>

      {success ? (
        <p className="text-center text-green-400 font-semibold animate-pulse">
          🎉 Registration successful! Redirecting...
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5 px-4">
          {/* Name Field */}
          <div className="flex items-center gap-x-3">
            <User className="text-gray-300 flex-shrink-0" size={22} />
            <input
              type="text"
              placeholder="Name/Nickname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 bg-black/30 border border-white/20 
                         rounded-md placeholder-gray-400 focus:outline-none 
                         focus:ring-2 focus:ring-blue-400 text-white"
            />
          </div>

          {/* Email Field */}
          <div className="flex items-center gap-x-3">
            <Mail className="text-gray-300 flex-shrink-0" size={22} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-black/30 border border-white/20
                         rounded-md placeholder-gray-400 focus:outline-none 
                         focus:ring-2 focus:ring-blue-400 text-white"
            />
          </div>

          {/* Password Field with Full Width Input and Overlay Toggle */}
          <div className="flex items-center gap-x-3 password-full-width">
            <Lock className="text-gray-300 flex-shrink-0" size={22} />
            
            {/* NEW: Use flex-grow to ensure this container takes all available space */}
            <div className="relative flex-grow">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                // Classname is identical to the email field, except for the right-padding (pr-10)
                // which prevents text from overlapping the toggle icon.
                className="w-full px-4 pr-10 py-2 bg-black/30 border border-white/20 
                          rounded-md placeholder-gray-400 focus:outline-none 
                          focus:ring-2 focus:ring-blue-400 text-white"
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                // Positioned absolutely inside the input field
                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-1/2 py-2.5 mt-4 rounded-md font-semibold transition self-center ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-300">
        Already have an account?{" "}
        <a href="/login" className="text-blue-400 hover:underline">
          Login
        </a>
      </p>
    </div>
  </section>
);

}
