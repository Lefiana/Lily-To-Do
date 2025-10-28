// src/components/HomePageForm.tsx
'use client';

import Image from "next/image";

export function HomePageForm() {
    return (
        <div
            className="relative w-full max-w-2xl p-10 text-white 
            rounded-2xl border border-white/20 backdrop-blur-2xl
            bg-white/10 shadow-xl transition hover:shadow-2xl 
            hover:border-white/30 z-10 mx-auto"
        >
            <h1 className="text-3xl font-bold mb-4 text-center text-pink-400">
                Welcome to Lily 🌸
            </h1>

            <p className="text-gray-300 text-center mb-8 max-w-lg mx-auto">
                Lily is a modern web application built with Next.js, Tailwind CSS, and TypeScript.
                Experience the future of productivity with an elegant and interactive interface.
            </p>

            {/* Logo and Separator */}
            <div className="flex flex-col items-center">
                <Image
                    src="https://res.cloudinary.com/dal65p2pp/image/upload/v1759830449/8984ef6189b44b61efe7fcede5b4eae10cec22e14ed8bb1e72d2a229ff885e8a_ns6nhn.gif"
                    alt="Animated GIF"
                    width={150}
                    height={150}
                    unoptimized
                    className="rounded-full border-4 border-custom-pink/50 mb-4 shadow-lg transition duration-300 hover:scale-[1.02]"
                />
                <div className="w-10 h-1 bg-pink-400/70 rounded-full mb-8"></div>
            </div>

            {/* Navigation Links */}
            <div className="mt-8 text-center space-y-4">
                <p className="text-gray-200 text-lg">
                    Ready to begin your journey?
                </p>
                <div className="flex justify-center space-x-6">
                    <a
                        href="/login"
                        className="text-white py-2 px-6 rounded-lg font-semibold transition duration-300 shadow-md bg-custom-purple border border-custom-pink"
                    >
                        Login
                    </a>
                    <a
                        href="/register"
                        className="text-gray-900 py-2 px-6 rounded-lg font-semibold transition duration-300 bg-pink-400 hover:bg-pink-500 shadow-md"
                    >
                        Register
                    </a>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 text-center space-y-2 border-t border-white/10 pt-6">
            <p className="text-gray-400 text-sm tracking-wide">
                © {new Date().getFullYear()} <span className="font-semibold text-white">Lily</span>. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs leading-relaxed max-w-lg mx-auto">
                Images and artwork remain the property of their respective creators. <br className="hidden sm:block" />
                Majority of the visual assets featured in Lily sourced from{" "}
                <a
                href="https://waifu.im"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 hover:underline transition-colors"
                >
                waifu.im
                </a>{" "}
                and{" "}
                <a
                href="https://wallhaven.cc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 hover:underline transition-colors"
                >
                wallhaven.cc
                </a>.
            </p>
            </footer>
        </div>
    );
}
