// src/components/dashboard/GachaAreaCard.tsx (New)
import React from 'react';
import { GlassCard } from '@/components/dashboard/GlassCard';

export const GachaAreaCard: React.FC = () => {
  return (
    <GlassCard className="w-full flex flex-col items-center justify-center p-4 h-full">
      <h2 className="text-xl font-semibold text-white mb-3">
        Gacha Time! 🎉
      </h2>
      
      <div className="h-32 w-32 bg-white/10 rounded-full flex items-center justify-center mb-4 border border-pink-500/50">
        <p className="text-gray-300 text-sm text-center">
            {/* Placeholder for Gacha image/animation */}
            Gacha Image
        </p>
      </div>

      <button
        className="w-full bg-custom-pink text-white px-4 py-2 rounded-lg 
                   hover:bg-pink-400 transition duration-150 text-sm font-bold button-theme-hover"
      >
        Roll for an Item (200 🪙)
      </button>
    </GlassCard>
  );
};