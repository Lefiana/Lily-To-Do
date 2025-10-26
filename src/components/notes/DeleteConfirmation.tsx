// src/components/notes/DeleteConfirmation.tsx
"use client";

import React from 'react';
import { GlassCard } from '@/components/dashboard/GlassCard';
import { NoteData } from '@/types/note';

interface Note extends NoteData {
  id: string;
}

interface DeleteConfirmationProps {
  isOpen: boolean;
  note: Note | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  note,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !note) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={onCancel}
    >
      <GlassCard
        className="w-full max-w-sm p-6 text-center border border-red-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-white mb-3">Confirm Deletion</h3>
        <p className="text-gray-300 mb-5">
          Are you sure you want to delete{' '}
          <span className="text-red-400 font-semibold">{note.title}</span>?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md text-sm font-semibold"
          >
            Yes, Delete
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </GlassCard>
    </div>
  );
};