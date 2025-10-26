// src/hooks/useNotes.ts
import useSWR from 'swr';
import { NoteData } from '@/types/note';

interface Note extends NoteData {
  id: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useNotes = (isOpen: boolean) => {
  const { data: notes, error, mutate } = useSWR<Note[]>(
    isOpen ? '/api/v1/notes' : null,
    fetcher
  );

  const prepareNoteData = (title: string, content: string, tags: string) => ({
    title,
    content,
    tags: tags.split(',').map((tag) => tag.trim()).filter((tag) => tag),
  });

  const handleCreate = async (
    title: string,
    content: string,
    tags: string,
    onSuccess: (message: string, type: 'success' | 'error') => void,
    onError: (message: string, type: 'success' | 'error') => void
  ) => {
    const noteData = prepareNoteData(title, content, tags);

    try {
      console.log('📝 Sending noteData:', noteData); // optional debug
      const response = await fetch('/api/v1/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        mutate(); // Refresh notes list
        onSuccess('Note created successfully!', 'success');
      } else {
        onError('Failed to create note.', 'error');
      }
    } catch (error) {
      console.error('Error creating note:', error);
      onError('Error creating note.', 'error');
    }
  };

  const handleUpdate = async (
    noteId: string,
    title: string,
    content: string,
    tags: string,
    onSuccess: (message: string, type: 'success' | 'error') => void,
    onError: (message: string, type: 'success' | 'error') => void
  ) => {
    const noteData = prepareNoteData(title, content, tags);

    try {
      console.log('📝 Sending noteData:', noteData); // optional debug
      const response = await fetch(`/api/v1/notes/${noteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        mutate(); // Refresh notes list
        onSuccess('Note updated successfully!', 'success');
      } else {
        onError('Failed to update note.', 'error');
      }
    } catch (error) {
      console.error('Error updating note:', error);
      onError('Error updating note.', 'error');
    }
  };

  const handleDelete = async (
    noteId: string,
    onSuccess: (message: string, type: 'success' | 'error') => void,
    onError: (message: string, type: 'success' | 'error') => void
  ) => {
    try {
      const response = await fetch(`/api/v1/notes/${noteId}`, { method: 'DELETE' });
      if (response.ok) {
        mutate(); // Refresh notes list
        onSuccess('Note deleted successfully!', 'success');
      } else {
        onError('Failed to delete note.', 'error');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      onError('Error deleting note.', 'error');
    }
  };
  
  const handleToggleFavorite = async (
    noteId: string,
    currentFavorite: boolean,
    onSuccess: (message: string, type: 'success' | 'error') => void,
    onError: (message: string, type: 'success' | 'error') => void
  ) => {
    try {
      const response = await fetch(`/api/v1/notes/${noteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !currentFavorite }),
      });
      if (response.ok) {
        mutate(); // Refresh notes list
        onSuccess(
          `Note ${!currentFavorite ? 'pinned' : 'unpinned'} successfully!`,
          'success'
        );
      } else {
        onError('Failed to toggle favorite.', 'error');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      onError('Error toggling favorite.', 'error');
    }
  };

  return {
    notes,
    error,
    mutate,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleFavorite, 
  };
};