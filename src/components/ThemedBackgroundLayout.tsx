"use client";
import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    // Runs only on client
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const dynamicStyles = {
    '--blob-color-1': color1 || '#57025a',
    '--blob-color-2': color2 || '#ec4899',
    backgroundSize: isMobile ? 'contain' : 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    ...(backgroundUrl && { backgroundImage: `url('${backgroundUrl}')` }),
  } as React.CSSProperties;

  return (
    <div 
      className={`relative flex items-center justify-center min-h-screen overflow-hidden p-6 ${
        !backgroundUrl ? 'themed-background-container' : 'bg-gray-900'
      }`}
      style={dynamicStyles}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/* Responsive Blobs */}
      <div 
        className="absolute w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px]
                   rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse blob-color-1"
      />
      <div 
        className="absolute w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px]
                   rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse delay-1000 blob-color-2"
      />

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
