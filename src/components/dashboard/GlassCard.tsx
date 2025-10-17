// src/components/GlassCard.tsx - UPDATED
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable component applying the custom "glass" effect from the original login CSS.
 */
export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`
        relative z-10 p-6 rounded-[20px] transition-all duration-300 
        
        // Match .container styles
        // backdrop-filter: blur(20px)
        backdrop-blur-[20px] 
        
        // background-color: rgba(255, 255, 255, 0.05)
        bg-[rgba(255,255,255,0.05)] 
        
        // border-bottom/left: 5px solid rgba(255, 255, 255, 0.3)
        border-b-[5px] border-l-[5px] border-[rgba(255,255,255,0.3)]
        
        // box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4)
        shadow-black/40
        
        // hover: transform: translateY(-2px) and adjusted shadow
        hover:-translate-y-[2px] hover:shadow-2xl hover:shadow-black/60
        
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// NOTE: You must ensure Tailwind's JIT mode is active (which it is in Next.js App Router)
// for these arbitrary values (like backdrop-blur-[20px] and bg-[...]) to work correctly.