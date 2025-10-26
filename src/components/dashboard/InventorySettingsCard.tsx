// src/components/dashboard/InventorySettingsCard.tsx
"use client";

import React, { useState } from 'react';
import { GlassCard } from '@/components/dashboard/GlassCard';
import useSWR from 'swr';
import { InventoryModal } from './InventoryModal';
import { TimerModal } from '@/components/timer/TimerModal'; 
import { NotesModal } from '../notes/noteModal';
import { JournalModal } from '../journal/JournalModal';
import { LogoutButton } from '../LogoutButton';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const InventorySettingsCard: React.FC = () => {
  const [showInventory, setShowInventory] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const { data: inventory, error, mutate } = useSWR(showInventory ? '/api/v1/reward/inventory' : null, fetcher);

  const handleViewInventory = () => {
    setShowInventory(true);
  };

  const handleCloseInventory = () => {
    setShowInventory(false);
  };

  const handleResetTheme = async () => {
    const response = await fetch('/api/v1/user/set-theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId: null }), 
    });
    if (response.ok) {
      window.location.reload(); 
    } else {
      alert('Error resetting theme.');
    }
  };

  const handleOpenTimer = () => {
    setShowTimer(true);
  };

  const handleCloseTimer = () => {
    setShowTimer(false);
  };

  const handleOpenNotes = () => {
    setShowNotes(true);
  };
  const handleCloseNotes = () => {
    setShowNotes(false);
  };

    const handleOpenJournal = () => {
    setShowJournal(true);
  };
  const handleCloseJournal = () => {
    setShowJournal(false);
  };

  return (
    <>
      <GlassCard className="w-full flex flex-col p-4 h-full">
        <h2 className="text-xl font-semibold text-white mb-3 border-b border-white/20 pb-2 readable-text">
          Inventory & Settings 🎒
        </h2>
        <ul className="space-y-2 flex-grow text-sm">
          <li 
            className="cursor-pointer readable-text"
            onClick={handleViewInventory}
          >
            View Inventory Items
          </li>
          <li 
            className="cursor-pointer readable-text"
            onClick={handleResetTheme}
          >
            Reset Theme
          </li>
          <li 
            className="cursor-pointer readable-text"
            onClick={handleOpenTimer}
          >
            Timer
          </li>
          <li 
            className="cursor-pointer readable-text"
            onClick={handleOpenNotes}
          >
            Notes
          </li>
          <li 
            className="cursor-pointer readable-text"
            onClick={handleOpenJournal}
          >
            Journal
          </li>
        </ul>

        <LogoutButton/>

      </GlassCard>

      {showInventory && (
        <InventoryModal 
          inventory={inventory} 
          isLoading={!inventory && !error} 
          error={error} 
          onClose={handleCloseInventory} 
        />
      )}

      {showTimer && <TimerModal onClose={handleCloseTimer} />}
      {showNotes && <NotesModal isOpen={showNotes} onClose={handleCloseNotes} />}
      {showJournal && <JournalModal isOpen={showJournal} onClose={handleCloseJournal} />}
    </>
  );
};