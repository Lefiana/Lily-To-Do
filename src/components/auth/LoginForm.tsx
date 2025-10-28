"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"
import Image from "next/image";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      alert("Login failed: " + result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <section className="relative flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
      {/* Optional animated background circles */}
      <div className="absolute w-[280px] h-[280px] bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse" />
      <div className="absolute w-[300px] h-[300px] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse" />

      {/* Glassmorphism Container */}
      <div className="relative w-[350px] sm:w-[400px] p-8 text-white rounded-2xl border border-white/20 backdrop-blur-2xl bg-white/10 shadow-xl">
        <div className="flex flex-col items-center mb-6">
            <Image
              src="https://res.cloudinary.com/dal65p2pp/image/upload/v1760668146/835f2b4a3e2753c4dbd897c7ee903c27_t7azjc.webp"
              alt="Avatar"
              width={96}  // Matches w-24 (24 * 4px = 96px in Tailwind)
              height={96} // Matches h-24
              className="rounded-full border-4 border-white/70 mb-4"
            />
          <h2 className="text-2xl font-semibold">Welcome Back</h2>
          <p className="text-gray-300 text-sm">Please log in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center space-y-4" >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
          />

          <button
            type="submit"
            className="w-1/2 py-2 mt-2  bg-gradient-to-r from-blue-500 via-pink-500 to-purple-600 rounded-md text-white font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          New here?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </section>
  );
}
