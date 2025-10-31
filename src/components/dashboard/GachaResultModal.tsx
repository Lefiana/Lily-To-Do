// src/components/dashboard/GachaResultModal.tsx
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { GlassCard } from './GlassCard';
import Image from 'next/image';
import { GachaResult } from '@/types/gacha';

interface GachaResultModalProps {
  result: GachaResult | null;
  onClose: () => void;
}

export const GachaResultModal: React.FC<GachaResultModalProps> = ({ result, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false); // Track image load errors

  // Handle outside click to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!result) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <GlassCard ref={modalRef} className="max-w-md w-full text-center">
        <h3 className="text-lg font-bold text-white mb-4">🎉 You Got!</h3>
        {result.item?.imageURL && !imageError && (
          <div className="relative h-40 w-40 mx-auto mb-4 rounded overflow-hidden border border-pink-500/50">
            <Image
              src={result.item.imageURL}
              alt={result.item.name || 'Item'}
              fill
              className="object-cover"
              unoptimized // Allows proxy/external images without Next.js optimization
              onError={() => setImageError(true)} // Handle load failures
              priority // Loads immediately for modals
            />
          </div>
        )}
        {imageError && (
          <div className="relative h-40 w-40 mx-auto mb-4 rounded overflow-hidden border border-pink-500/50 bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Image Unavailable</span>
          </div>
        )}
        <p className="text-white font-semibold">{result.item?.name || 'Unknown Item'}</p>
        <p className="text-gray-300 text-sm">Rarity: {result.item?.rarity || 'N/A'}</p>
        <p className="text-gray-300 text-sm mb-4">New Balance: {result.newBalance} 🪙</p>
        <button 
          onClick={onClose}
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-400 transition"
        >
          Close
        </button>
      </GlassCard>
    </div>
  );
};