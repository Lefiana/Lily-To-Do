// src/components/notes/noteModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/dashboard/GlassCard';
import { DeleteConfirmation } from './DeleteConfirmation';
import { NoteForm } from './NoteForm';
import { NoteList } from './NoteList';
import { Toast } from './Toast';
import { useNotes } from '@/hooks/useNotes';
import { NoteData } from '@/types/note';

interface Note extends NoteData {
  id: string;
}

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({ isOpen, onClose }) => {
  const { notes, error, handleCreate, handleUpdate, handleDelete,handleToggleFavorite } = useNotes(isOpen);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Reset form when modal opens/closes or form state changes
  useEffect(() => {
    if (!isOpen) {
      setShowForm(false);
      setEditingNote(null);
      setTitle('');
      setContent('');
      setTags('');
      setShowConfirmDelete(false);
      setNoteToDelete(null);
      setToast(null);
    }
  }, [isOpen]);

  // Populate form when editing a note
  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setTags(editingNote.tags ? editingNote.tags.join(', ') : '');
    } else {
      setTitle('');
      setContent('');
      setTags('');
    }
  }, [editingNote]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const onCreate = () => handleCreate(title, content, tags, showToast, showToast);
  const onUpdate = () => editingNote && handleUpdate(editingNote.id, title, content, tags, showToast, showToast);
  const onDeleteConfirm = () => noteToDelete && handleDelete(noteToDelete.id, showToast, showToast);

  const handleDeleteClick = (note: Note) => {
    setNoteToDelete(note);
    setShowConfirmDelete(true);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingNote(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingNote(null);
    setTitle('');
    setContent('');
    setTags('');
  };

  const handleFormSubmit = () => {
    if (editingNote) {
      onUpdate();
      setShowForm(false);
      setEditingNote(null);
    } else {
      onCreate();
      setShowForm(false);
    }
  };

  const onToggleFavorite = (note: Note) => {
    handleToggleFavorite(note.id, note.isFavorite || false, showToast, showToast);
  };
  if (!isOpen) return null;

  return (
    <>
      <Toast toast={toast} />

      {/* Main Modal */}
      <div
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm"
        onClick={onClose}
      >
        <GlassCard
          className="w-full max-w-6xl p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/20 pb-2">
            Notes Area
          </h2>

          {/* Add New Note Button */}
          {!showForm && (
            <div className="mb-6">
              <button
                onClick={handleAddNew}
                className="px-4 py-2 text-sm font-bold text-white bg-blue-600/80 rounded-md hover:bg-blue-500 transition"
              >
                Add New Note
              </button>
            </div>
          )}

          {/* Form for Add/Edit */}
          {showForm && (
            <NoteForm
              isEditing={!!editingNote}
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
              tags={tags}
              setTags={setTags}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          )}

          {/* Notes List */}
          {!showForm && (
            <NoteList
              notes={notes}
              error={error}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onToggleFavorite={onToggleFavorite}
            />
          )}
        </GlassCard>
      </div>

      <DeleteConfirmation
        isOpen={showConfirmDelete}
        note={noteToDelete}
        onConfirm={() => {
          onDeleteConfirm();
          setShowConfirmDelete(false);
          setNoteToDelete(null);
        }}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </>
  );
};