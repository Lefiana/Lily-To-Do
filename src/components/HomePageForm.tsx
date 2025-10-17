// HomePageForm.tsx (place in src/components or appropriate location)

'use client';

import Image from "next/image";

export function HomePageForm() {
    return (
        // The content is now the dark, glassy card
        <div className="relative w-full max-w-2xl p-10 text-white 
        rounded-2xl border border-white/20 backdrop-blur-2xl
         bg-white/10 shadow-xl transition hover:shadow-2xl 
         hover:border-white/30 z-10 mx-auto">
            
            <h1 className="text-3xl font-bold mb-4 text-center text-pink-400">Welcome to Lily 🌸</h1>
            
            <p className="text-gray-300 text-center mb-8 max-w-lg mx-auto">
                Lily is a modern web application built with Next.js, Tailwind CSS, and TypeScript. Experience the future of web development.
            </p>
            
            {/* Logo and Separator */}
            <div className="flex flex-col items-center">
                <Image
                    src="https://res.cloudinary.com/dal65p2pp/image/upload/v1759830449/8984ef6189b44b61efe7fcede5b4eae10cec22e14ed8bb1e72d2a229ff885e8a_ns6nhn.gif"
                    alt="Animated GIF"
                    width={150}
                    height={150}
                    unoptimized
                    // Use the custom border class from base.css
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
                        // Use custom background and border classes from base.css
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
            <div className="mt-12 text-center">
                <p className="text-gray-400 text-sm">
                    © {new Date().getFullYear()} Lily. All rights reserved.
                </p>
            </div>
        </div>
    );
}