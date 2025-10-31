// src/components/admin/AdminItemManager.tsx
"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Item {
  id: string;
  name: string;
  rarity: number;
  description?: string;
  imageURL?: string;
}

export const AdminItemManager: React.FC = () => {
  const { data: items, error, mutate } = useSWR<Item[]>('/api/admin/items', fetcher);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({ name: '', rarity: 1, description: '', imageURL: '' });
  const [filter, setFilter] = useState<'all' | 'manual' | 'public'>('all'); // 🎯 New filter state

  // 🎯 Filter items based on selection
  const filteredItems = items?.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'manual') return !item.name.includes('Waifu'); // Assume manual items don't have "Waifu"
    if (filter === 'public') return item.name.includes('Waifu'); // Assume public items have "Waifu"
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingItem ? 'PATCH' : 'POST';
    const url = editingItem ? `/api/admin/items/${editingItem.id}` : '/api/admin/items';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      mutate(); // Refresh the list
      setFormData({ name: '', rarity: 1, description: '', imageURL: '' });
      setEditingItem(null);
    } else {
      alert('Error saving item');
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({ name: item.name, rarity: item.rarity, description: item.description || '', imageURL: item.imageURL || '' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const response = await fetch(`/api/admin/items/${id}`, { method: 'DELETE' });
      if (response.ok) {
        mutate(); // Refresh the list
      } else {
        // Parse the error response for details
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`Error deleting item: ${errorData.error}`);
      }
    }
  };

  if (error) return <p>Error loading items</p>;
  if (!items) return <p>Loading...</p>;

  return (
    <div className="mt-6 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Item Management</h2>
      
      {/* 🎯 Filter Dropdown */}
      <div className="mb-4">
        <label htmlFor="item-filter" className="mr-2">Filter by Type:</label>
        <select
          id="item-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'manual' | 'public')}
          className="p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="manual">Manual Gacha</option>
          <option value="public">Public Gacha</option>
        </select>
      </div>
      
      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Rarity"
          value={formData.rarity}
          onChange={(e) => setFormData({ ...formData, rarity: parseInt(e.target.value) })}
          min="1"
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="url"
          placeholder="Image URL"
          value={formData.imageURL}
          onChange={(e) => setFormData({ ...formData, imageURL: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingItem ? 'Update Item' : 'Add Item'}
        </button>
        {editingItem && (
          <button type="button" onClick={() => setEditingItem(null)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </form>

            {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* 🎯 Grid layout */}
        {filteredItems?.map((item) => (
          <div key={item.id} className="p-4 border rounded shadow-sm bg-white"> {/* 🎯 Changed from <li> to <div> */}
            <div>
              <p><strong>{item.name}</strong> (Rarity: {item.rarity})</p>
              {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
              {item.imageURL && (
                <div className="relative w-full h-32 mt-2 rounded overflow-hidden">
                  <Image
                    src={item.imageURL}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div className="mt-2 flex justify-end space-x-2">
              <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                Edit
              </button>
              <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};