// src/components/dashboard/InventorySettingsCard.tsx (Updated and Renamed)
"use client";

import React from 'react';
import { signOut } from "next-auth/react";
import { GlassCard } from '@/components/dashboard/GlassCard';

export const InventorySettingsCard: React.FC = () => {
  return (
    <GlassCard className="w-full flex flex-col p-4 h-full"> {/* p-4 for a bit less padding */}
      <h2 className="text-xl font-semibold text-white mb-3 border-b border-white/20 pb-2">
        Inventory & Settings 🎒
      </h2>
      <ul className="space-y-2 flex-grow text-gray-300 text-sm">
        <li className="hover:text-pink-400 cursor-pointer">View Inventory Items</li>
        <li className="hover:text-pink-400 cursor-pointer">Account Preferences</li>
        <li className="hover:text-pink-400 cursor-pointer">App/Theme Settings</li>
      </ul>
      
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-3 w-full bg-red-600/80 text-white px-3 py-1 rounded-lg 
                   hover:bg-red-500 transition duration-150 text-xs font-medium"
      >
        Sign Out 👋
      </button>
    </GlassCard>
  );
};