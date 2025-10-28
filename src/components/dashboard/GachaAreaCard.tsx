"use client";

import React, { useState } from 'react';
import { GlassCard } from '@/components/dashboard/GlassCard';
import { useCurrency } from '@/hooks/useCurrency';
import { GachaResultModal } from './GachaResultModal'; // Import the modal
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { GachaResult } from '@/types/gacha';

export const GachaAreaCard: React.FC = () => {
  const { performGacha, currency } = useCurrency();
  const [isPulling, setIsPulling] = useState(false);
  const [result, setResult] = useState<GachaResult | null>(null);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN'; // Check if user is admin
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'manual' | 'public' | 'wallhaven'>(isAdmin ? 'manual' : 'public'); // Set initial mode based on admin status
  const [character, setCharacter] = useState<string>('');
  const [showModal, setShowModal] = useState(false); // State for modal
  
  const toggleMode = () => {
    setMode(prev => {
      if (isAdmin) {
        if (prev === 'manual') return 'public';
        if (prev === 'public') return 'wallhaven';
        return 'manual';
      } else {
        if (prev === 'public') return 'wallhaven';
        return 'public';
      }
    });
    setResult(null);
    setError(null);
    setShowModal(false); // Hide modal on mode switch
  };

  const closeModal = () => {
    setShowModal(false); // Close modal
  };

  const gachaTitle = mode === 'manual' ? 'Manual Gacha! 🎉' : mode === 'public' ? 'Public Gacha! 🌐' : 'Wallhaven Gacha! 🖼️';
  const gachaImage = mode === 'manual' 
    ? 'https://res.cloudinary.com/dal65p2pp/image/upload/v1760884515/20241018_083250_-_Copy_npcsdf.jpg' 
    : mode === 'public' ? 'https://cdn.waifu.im/7497.jpg' : 'https://res.cloudinary.com/dal65p2pp/image/upload/v1760884086/sorry_chkqqt.png';
  const gachaCost = mode === 'manual' ? 2000 : mode === 'public' ? 500 : 1000; 
  const canAfford = currency >= gachaCost;
  const buttonText = isPulling ? 'Pulling...' : !canAfford ? 'Not Enough Coins!' : `Pull ${mode === 'manual' ? 'Manual' : mode === 'public' ? 'Public' : 'Wallhaven'} Gacha`;

  const handleGacha = async () => {
    const canAfford = currency >= gachaCost;
    if (!canAfford) return;
    setIsPulling(true);
    setError(null);
    try {
      const gachaResult = await performGacha(mode, character);
      setResult(gachaResult);
      setShowModal(true); 
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsPulling(false);
    }
  };

  return (
    <>
      <GlassCard className="w-full flex flex-col items-center justify-center p-4 h-auto relative">
        
        {mode === 'public' && (
          <input
            type="text"
            placeholder="Enter character name (e.g., raiden-shogun)"
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            className="w-full mb-2 px-2 py-1 text-sm bg-gray-700 text-white rounded"
          />
        )}

        <h2 
          className="text-xl font-semibold text-white mb-3 cursor-pointer hover:text-pink-400 transition duration-150 readable-text"
          onClick={toggleMode}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && toggleMode()}
        >
          {gachaTitle}
        </h2>
        
       <div className="h-32 w-32 bg-white/10 rounded-full flex items-center justify-center mb-4 border border-pink-500/50">
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image
              src={gachaImage}
              alt={`${mode} Gacha Machine`}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Conditionally render the manual gacha button/input */}
        {isAdmin && mode === 'manual' && (
          <button
            onClick={handleGacha}
            disabled={isPulling || !canAfford}
            className={`w-full px-4 py-2 rounded-lg text-sm font-bold mb-2 ${
              canAfford && !isPulling
                ? 'bg-custom-pink text-white hover:bg-pink-400 transition duration-150 button-theme-hover'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            {buttonText}
          </button>
        )}

        {/* Public and Wallhaven Gacha buttons */}
        {mode !== 'manual' && (
          <button
            onClick={handleGacha}
            disabled={isPulling || !canAfford}
            className={`w-full px-4 py-2 rounded-lg text-sm font-bold mb-2 ${
              canAfford && !isPulling
                ? 'bg-custom-pink text-white hover:bg-pink-400 transition duration-150 button-theme-hover'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            {buttonText}
          </button>
        )}
        
        <p className="text-gray-300 text-xs mb-4 readable-text">Roll for an Item ({gachaCost} 🪙)</p>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </GlassCard>

      {/* Gacha Result Modal (Outside the Card) */}
      {showModal && <GachaResultModal result={result} onClose={closeModal} />}
    </>
  );
};
