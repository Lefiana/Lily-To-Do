// src/components/dashboard/InventoryModal.tsx
"use client";

import React, { useRef, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { useRouter } from 'next/navigation';

interface InventoryModalProps {
  inventory: any[] | undefined; // 🎯 Fixed: Complete the type
  isLoading: boolean;
  error: any;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ inventory, isLoading, error, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
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

  const [filter, setFilter] = React.useState<'all' | 'manual' | 'public' | 'wallhaven'>('all');

  // Filter inventory based on selection
const filteredInventory = inventory?.filter((item: any) => {
  if (filter === 'all') return true;
  if (filter === 'manual') return item.name.includes('Manual') || !item.name.includes('Waifu') && !item.name.includes('Wallhaven');
  if (filter === 'public') return item.name.includes('Waifu');
  if (filter === 'wallhaven') return item.name.includes('Wallhaven'); // 🎯 Add filter
  return true;
});

  const handleSetTheme = async (itemId: string) => {
    try {
      const response = await fetch('/api/v1/user/set-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
      if (response.ok) {
        // alert('Theme set successfully! Refresh the page to see changes.'); // 🎯 Removed alert
        router.push('/dashboard'); // 🎯 Auto-redirect to dashboard
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`); // Keep error alert
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Network error. Check console for details.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <GlassCard ref={modalRef} className="w-full max-w-4xl h-3/4 overflow-hidden flex flex-col">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Your Inventory</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-pink-400 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Filter Dropdown */}
        <div className="mb-4">
          <label htmlFor="inventory-filter" className="text-white text-sm mr-2">Filter by Type:</label>
          <select
            id="inventory-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'manual' | 'public')}
            className="bg-gray-700 text-white px-2 py-1 rounded"
          >
            <option value="all">All</option>
            <option value="manual">Manual Gacha</option>
            <option value="public">Public Gacha</option>
            <option value="wallhaven">Wallhaven Gacha</option>
          </select>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto">
          {isLoading && <p className="text-gray-400 text-center">Loading inventory...</p>}
          {error && <p className="text-red-400 text-center">Error loading inventory.</p>}
          {!isLoading && !error && (!filteredInventory || filteredInventory.length === 0) && (
            <p className="text-gray-400 text-center">No items match the filter. Pull some gachas!</p>
          )}
          {!isLoading && !error && filteredInventory && filteredInventory.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredInventory.map((item: any) => (
                <div key={item.id} className="bg-gray-700/50 p-3 rounded-lg text-center">
                  <img 
                    src={item.imageURL} 
                    alt={item.name} 
                    className="h-16 w-16 mx-auto mb-2 rounded object-cover" 
                  />
                  <p className="text-white font-semibold text-sm">{item.name}</p>
                  <p className="text-gray-300 text-xs">x{item.count}</p>
                  <p className="text-gray-400 text-xs">Rarity: {item.rarity}</p>
                  {item.description && <p className="text-gray-300 text-xs mt-1 break-all overflow-hidden 
                  text-ellipsis">{item.description}</p>}
                  {/* 🎯 Buttons inside the item card */}
                  <div className="mt-2 flex flex-col space-y-1">
                    <button onClick={() => handleSetTheme(item.id)} className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                      Set as Theme
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
