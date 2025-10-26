// src/components/dashboard/JournalModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { GlassCard } from '@/components/dashboard/GlassCard';
import { JournalData } from '@/types/journal';

interface Journal extends JournalData {
  id: string;
}

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const JournalModal: React.FC<JournalModalProps> = ({ isOpen, onClose }) => {
  const { data: journals, error, mutate } = useSWR(isOpen ? '/api/v1/journal' : null, fetcher);
  const [showForm, setShowForm] = useState(false);
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [journalToDelete, setJournalToDelete] = useState<Journal | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Reset form when modal opens/closes or form state changes
  useEffect(() => {
    if (!isOpen) {
      setShowForm(false);
      setEditingJournal(null);
      setTitle('');
      setContent('');
      setMood('');
      setTags('');
      setShowConfirmDelete(false);
      setJournalToDelete(null);
      setToast(null);
    }
  }, [isOpen]);

  // Populate form when editing a journal
  useEffect(() => {
    if (editingJournal) {
      setTitle(editingJournal.title);
      setContent(editingJournal.content);
      setMood(editingJournal.mood || '');
      setTags(editingJournal.tags ? editingJournal.tags.join(', ') : '');
    } else {
      setTitle('');
      setContent('');
      setMood('');
      setTags('');
    }
  }, [editingJournal]);

  const prepareJournalData = () => ({
    title,
    content,
    mood,
    tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = async () => {
    const journalData = prepareJournalData();

    try {
      console.log("📝 Sending journalData:", journalData); // optional debug
      const response = await fetch('/api/v1/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(journalData),
      });

      if (response.ok) {
        mutate(); // Refresh journal list
        setShowForm(false);
        setEditingJournal(null);
        showToast('Journal created successfully!', 'success');
      } else {
        showToast('Failed to create journal.', 'error');
      }
    } catch (error) {
      console.error('Error creating journal:', error);
      showToast('Error creating journal.', 'error');
    }
  };

  const handleUpdate = async () => {
    if (!editingJournal) return;

    const journalData = prepareJournalData();

    try {
      console.log("📝 Sending journalData:", journalData); // optional debug
      const response = await fetch(`/api/v1/journal/${editingJournal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(journalData),
      });

      if (response.ok) {
        mutate(); // Refresh journal list
        setShowForm(false);
        setEditingJournal(null);
        showToast('Journal updated successfully!', 'success');
      } else {
        showToast('Failed to update journal.', 'error');
      }
    } catch (error) {
      console.error('Error updating journal:', error);
      showToast('Error updating journal.', 'error');
    }
  };

  const handleDeleteClick = (journal: Journal) => {
    setJournalToDelete(journal);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (!journalToDelete) return;

    try {
      const response = await fetch(`/api/v1/journal/${journalToDelete.id}`, { method: 'DELETE' });
      if (response.ok) {
        mutate(); // Refresh journal list
        showToast('Journal deleted successfully!', 'success');
      } else {
        showToast('Failed to delete journal.', 'error');
      }
    } catch (error) {
      console.error('Error deleting journal:', error);
      showToast('Error deleting journal.', 'error');
    }
    setShowConfirmDelete(false);
    setJournalToDelete(null);
  };

  const handleEdit = (journal: Journal) => {
    setEditingJournal(journal);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingJournal(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingJournal(null);
    setTitle('');
    setContent('');
    setMood('');
    setTags('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-60 p-4 rounded-md text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}

      {/* Main Modal */}
      <div
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm"
        onClick={onClose}
      >
        <GlassCard
          className="w-full max-w-3xl p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/20 pb-2">
            Journal Area
          </h2>

          {/* Add New Journal Button */}
          {!showForm && (
            <div className="mb-6">
              <button
                onClick={handleAddNew}
                className="px-4 py-2 text-sm font-bold text-white bg-blue-600/80 rounded-md hover:bg-blue-500 transition"
              >
                Add New Journal
              </button>
            </div>
          )}

          {/* Form for Add/Edit */}
          {showForm && (
            <form className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">{editingJournal ? 'Edit Journal' : 'Add New Journal'}</h3>
              <div>
                <label
                  htmlFor="journal-title"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Title
                </label>
                <input
                  id="journal-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 text-sm bg-white/10 rounded-md border border-white/20 text-white"
                  placeholder="Title"
                  title="Enter the title of the journal"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="journal-content"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Content
                </label>
                <textarea
                  id="journal-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                  className="w-full p-2 text-sm bg-white/10 rounded-md border border-white/20 text-white resize-none"
                  placeholder="Content"
                  title="Enter the content of the journal"
                />
              </div>
              <div>
                <label
                  htmlFor="journal-mood"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Mood
                </label>
                <input
                  id="journal-mood"
                  type="text"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full p-2 text-sm bg-white/10 rounded-md border border-white/20 text-white"
                  placeholder="Mood e.g., happy, sad, neutral"
                  title="Enter Mood e.g., happy, sad, neutral"
                />
              </div>
              <div>
                <label
                  htmlFor="journal-tags"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Tags
                </label>
                <input
                  id="journal-tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full p-2 text-sm bg-white/10 rounded-md border border-white/20 text-white"
                  placeholder="Tags (comma-separated)"
                  title="Enter tags separated by commas"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-white/10 rounded-md hover:bg-white/20 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={editingJournal ? handleUpdate : handleCreate}
                  disabled={!title.trim()}
                  className="px-4 py-2 text-sm font-bold text-white bg-green-600/80 rounded-md hover:bg-green-500 transition disabled:opacity-50"
                >
                  {editingJournal ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          )}

          {/* Journals List */}
            {!showForm && (
          <div className="space-y-3">
            {error && <p className="text-red-500">Error loading journals.</p>}
            {!journals && !error && <p className="text-gray-300">Loading journals...</p>}
            {journals && journals.length === 0 && <p className="text-gray-300">No journals yet. Add one above!</p>}
            {journals && journals.map((journal: Journal) => (
              <div key={journal.id} className="p-3 border border-white/20 rounded bg-white/5">
                <h4 className="font-semibold text-white">{journal.title}</h4>
                <p className="text-sm text-gray-300 mt-1">{journal.content}</p>
                {journal.mood && (
                  <p className="text-xs text-gray-400 mt-1">Mood: {journal.mood}</p>
                )}
                {journal.tags && journal.tags.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">Tags: {journal.tags.join(', ')}</p>
                )}
                {journal.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">Created: {new Date(journal.createdAt).toLocaleDateString()}</p>
                )}
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => handleEdit(journal)}
                    className="px-2 py-1 bg-yellow-500/80 text-white rounded text-xs hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(journal)}
                    className="px-2 py-1 bg-red-500/80 text-white rounded text-xs hover:bg-red-500 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </GlassCard>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && journalToDelete && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setShowConfirmDelete(false)}
        >
          <GlassCard
            className="w-full max-w-sm p-6 text-center border border-red-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-3">
              Confirm Deletion
            </h3>
            <p className="text-gray-300 mb-5">
              Are you sure you want to delete{" "}
              <span className="text-red-400 font-semibold">{journalToDelete.title}</span>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md text-sm font-semibold"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
};
