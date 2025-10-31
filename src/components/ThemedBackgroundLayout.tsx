"use client";
import React, { useEffect, useState, useRef } from 'react';  // Added useRef for throttling

interface LayoutProps {
  children: React.ReactNode;
  backgroundUrl?: string;
  color1?: string;
  color2?: string;
}

export function ThemedBackgroundLayout({ 
  children, 
  backgroundUrl, 
  color1, 
  color2 
}: LayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const rafId = useRef<number | null>(null);  // For requestAnimationFrame throttling

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // ✅ Smooth scroll listener for parallax
  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current) return;  // Prevent multiple calls
      rafId.current = requestAnimationFrame(() => {
        // Reduced parallax factor for subtler movement (0.1 instead of 0.3)
        // Optional: Disable on desktop by checking !isMobile
        const parallaxFactor = isMobile ? 0.3 : 0.1;  // Less intense on desktop
        setScrollY(window.scrollY * parallaxFactor);
        rafId.current = null;
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isMobile]);  // Added isMobile dependency

  const dynamicStyles = {
    '--blob-color-1': color1 || '#57025a',
    '--blob-color-2': color2 || '#ec4899',
    backgroundSize: isMobile ? 'cover' : 'cover',
    backgroundPosition: `center ${scrollY}px`, // 👈 moves smoothly as you scroll
    backgroundRepeat: 'no-repeat',
    transition: 'background-position 0.3s ease-out', // ✅ smooth movement
    ...(backgroundUrl && { backgroundImage: `url('${backgroundUrl}')` }),
  } as React.CSSProperties;

  return (
    <div 
      className={`relative flex flex-col items-center justify-start min-h-full overflow-visible p-6 ${
        !backgroundUrl ? 'themed-background-container' : 'bg-gray-900'
      }`}
      style={dynamicStyles}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/30 z-0 transition-opacity duration-300" />

      {/* Animated Blobs */}
      <div 
        className="absolute w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px]
                   rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse blob-color-1"
      />
      <div 
        className="absolute w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px]
                   rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse delay-1000 blob-color-2"
      />

      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {children}
      </div>
    </div>
  );
}
