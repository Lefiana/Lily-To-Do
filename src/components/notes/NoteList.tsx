"use client";

import React from 'react';
import { NoteData } from '@/types/note';

interface Note extends NoteData {
  id: string;
}

interface NoteListProps {
  notes: Note[] | null; // Fixed: Complete the type (assuming null if not loaded)
  error: string | null; 
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onToggleFavorite: (note: Note) => void;
}

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  error,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  if (error) return <p className="text-red-400 text-sm">⚠️ Error loading notes.</p>;
  if (!notes) return <p className="text-gray-300 text-sm">Loading notes...</p>;
  if (notes.length === 0)
    return <p className="text-gray-400 text-sm italic">No notes yet. Add one above!</p>;

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 overflow-y-auto"
      style={{ maxHeight: '500px' }}
    >
      {notes.map((note) => (
        <div
          key={note.id}
          className="relative group p-4 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 
                     border border-white/10 shadow-lg backdrop-blur-md transition-transform 
                     hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
        >
          {/* Favorite Pin */}
          <button
            onClick={() => onToggleFavorite(note)}
            title={note.isFavorite ? 'Unpin this note' : 'Pin this note'}
            className={`absolute top-3 right-3 text-xl transition transform hover:scale-110 ${
              note.isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-300'
            }`}
          >
            {note.isFavorite ? '⭐' : '☆'}
          </button>

          {/* Note Content */}
          <div className="pr-12"> 
            <h4 className="font-semibold text-white text-lg mb-1 truncate">{note.title}</h4>
            <p className="text-sm text-gray-200 line-clamp-4">{note.content}</p>
            {note.tags && note.tags.length > 0 && (
              <p className="text-xs text-indigo-200 mt-2">
                <span className="opacity-70">Tags:</span> {note.tags.join(', ')}
              </p>
            )}
            {note.createdAt && (
              <p className="text-xs text-gray-300 mt-1">
                Created: {new Date(note.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(note)}
              className="px-3 py-1.5 rounded-lg bg-yellow-500/80 text-white text-xs font-medium hover:bg-yellow-500"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(note)}
              className="px-3 py-1.5 rounded-lg bg-red-500/80 text-white text-xs font-medium hover:bg-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};