import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  backgroundUrl?: string; // Cloudinary URL
  color1?: string;      // Dominant color for first blob
  color2?: string;      // Secondary color for second blob
}

export function ThemedBackgroundLayout({ 
  children, 
  backgroundUrl, 
  color1, 
  color2 
}: LayoutProps) {
  
  // Define fallbacks for colors using your default theme colors
  const defaultColor1 = '#57025a';
  const defaultColor2 = '#ec4899';
  
  const blobColor1 = color1 || defaultColor1;
  const blobColor2 = color2 || defaultColor2;

  // Centralized Dynamic Styles: Set CSS Variables and the Background Image
  // This is the only place we use the style prop, which is necessary for dynamic data.
  const dynamicStyles = {
    // 1. Inject custom colors as CSS Variables (Custom Properties)
    '--blob-color-1': blobColor1,
    '--blob-color-2': blobColor2,

    // 2. Dynamic background image setting
    ...(backgroundUrl && {
      backgroundImage: `url('${backgroundUrl}')`,
    }),
  } as React.CSSProperties; // Type assertion for custom properties

  return (
    // Outer container: Applies dynamic style and centering
    <div 
      // Use bg-gray-900 as a fallback solid color if no image is provided
      className={`relative flex items-center justify-center min-h-screen overflow-hidden p-6 ${!backgroundUrl ? 'themed-background-container' 
        : 'bg-gray-900' }`}
      style={dynamicStyles} 
    >
      
      <div 
        className="absolute w-[300px] h-[300px] rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse blob-color-1"
      />
      <div 
        className="absolute w-[320px] h-[320px] rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse delay-1000 blob-color-2" 
      />

      {/* Main content wrapper: Ensures children are vertically and horizontally centered.
        mx-auto centers the block-level children (like your glass card).
      */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}