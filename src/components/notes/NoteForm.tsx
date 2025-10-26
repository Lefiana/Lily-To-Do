// src/components/notes/NoteForm.tsx
"use client";

import React from 'react';

interface NoteFormProps {
  isEditing: boolean;
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  tags: string;
  setTags: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  isEditing,
  title,
  setTitle,
  content,
  setContent,
  tags,
  setTags,
  onSubmit,
  onCancel,
}) => {
  return (
    <form className="space-y-4 mb-6">
      <h3 className="text-lg font-semibold text-white mb-2">
        {isEditing ? 'Edit Note' : 'Add New Note'}
      </h3>
      <div>
        <label
          htmlFor="note-title"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Title
        </label>
        <input
          id="note-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 text-sm bg-white/10 rounded-md border border-white/20 text-white"
          placeholder="Title"
          title="Enter the title of the note"
          required
        />
      </div>
      <div>
        <label
          htmlFor="note-content"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Content
        </label>
        <textarea
          id="note-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full p-2 text-sm bg-white/10 rounded-md border border-white/20 text-white resize-none"
          placeholder="Content"
          title="Enter the content of the note"
        />
      </div>
      <div>
        <label
          htmlFor="note-tags"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Tags
        </label>
        <input
          id="note-tags"
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
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-white/10 rounded-md hover:bg-white/20 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!title.trim()}
          className="px-4 py-2 text-sm font-bold text-white bg-green-600/80 rounded-md hover:bg-green-500 transition disabled:opacity-50"
        >
          {isEditing ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};