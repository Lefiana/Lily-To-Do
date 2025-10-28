// src/components/GlassCard.tsx
import React from 'react';
import { HTMLAttributes, forwardRef } from 'react'; // 🎯 Add forwardRef

// ✅ Removed: Empty GlassCardProps interface (no longer needed)
export const GlassCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => { // 🎯 Add ref parameter
    return (
      <div
        ref={ref} // 🎯 Forward the ref to the div
        className={`
          relative z-10 p-6 rounded-[20px] transition-all duration-300
          
          // Match .container styles
          backdrop-blur-[20px] 
          
          bg-[rgba(255,255,255,0.4)] 
          
          border-b-[5px] border-l-[5px] border-[rgba(255,255,255,0.3)]
          
          shadow-black/40
          
          hover:-translate-y-[2px] hover:shadow-2xl hover:shadow-black/60
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// 🎯 Add display name for better debugging
GlassCard.displayName = 'GlassCard';