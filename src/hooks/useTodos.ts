// src/hooks/useTodos.ts
"use client";

import useSWR, { mutate } from 'swr';

export interface Todo {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  category: 'dailyquest' | 'default' | string; // Assuming 'dailyquest' and 'default' are key categories
  dailyQuest: boolean;
  repeatDaily: boolean;
  completed: boolean;
  progress: number;
  deadline: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
// Helper function to fetch data from your API
const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
});

// Base URL for your Todo API
const API_URL = '/api/v1/todo';

// --- MAIN HOOK ---
export const useTodos = () => {
  // --- FETCHING (GET /api/v1/todo) ---
  const { data: todos, error, isLoading } = useSWR<Todo[]>(API_URL, fetcher);
  
  // --- MUTATION FUNCTIONS ---
  
  /**
   * CREATE (POST /api/v1/todo)
   */
  const createTodo = async (newTodoData: Pick<Todo, 'title' | 'description' | 'category' | 'dailyQuest' | 'repeatDaily'>) => {
    // 1. Optimistic Update (shows new item immediately before API response)
    const tempId = Date.now().toString();
    const tempTodo: Todo = { 
        ...newTodoData,
        id: tempId, 
        completed: false, 
        progress: 0,
        // Mocking other required fields
        userId: 'temp', category: newTodoData.category || 'default', dailyQuest: newTodoData.dailyQuest || false, 
        repeatDaily: newTodoData.repeatDaily || false, deadline: null, createdAt: new Date(), updatedAt: new Date(),
    };
    
    mutate(API_URL, (currentTodos: Todo[] = []) => [...currentTodos, tempTodo], false);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodoData),
      });

      if (!res.ok) throw new Error("Failed to create todo.");
      
      // 2. Revalidate/Refetch data from the server
      mutate(API_URL); 

    } catch (err) {
      // 3. Rollback the optimistic update on error (re-fetches original data)
      mutate(API_URL); 
      console.error("Failed to create todo:", err);
      alert("Failed to create todo. Please check the server logs.");
    }
  };

  /**
   * DELETE (DELETE /api/v1/todo/[id])
   */
  const deleteTodo = async (id: string) => {
    // 1. Optimistic Update: Remove the item from the list
    mutate(API_URL, (currentTodos: Todo[] = []) => currentTodos.filter(t => t.id !== id), false);

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error("Failed to delete todo.");
      
      // No revalidate needed if optimistic update was successful, but we call 
      // it again just in case another user made changes.
      mutate(API_URL);

    } catch (err) {
      // 2. Rollback the optimistic update on error
      mutate(API_URL);
      console.error("Failed to delete todo:", err);
      alert("Failed to delete todo. Please check the server logs.");
    }
  };

  /**
   * UPDATE PROGRESS (PATCH /api/v1/todo/[id]/progress)
   */
  const updateProgress = async (id: string, progress: number) => {
    // 1. Optimistic Update
    mutate(API_URL, (currentTodos: Todo[] = []) => currentTodos.map(t => 
      t.id === id ? { ...t, progress: progress } : t
    ), false);

    try {
      const res = await fetch(`${API_URL}/${id}/progress`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress }),
      });

      if (!res.ok) throw new Error("Failed to update progress.");

      // 2. Revalidate/Refetch data (in case there were side effects/server changes)
      mutate(API_URL);

    } catch (err) {
      // 3. Rollback
      mutate(API_URL);
      console.error("Failed to update progress:", err);
    }
  };

  /**
   * MARK COMPLETED (PATCH /api/v1/todo/[id]/completed)
   */
  const markCompleted = async (id: string, completed: boolean) => {
    // 1. Optimistic Update
    mutate(API_URL, (currentTodos: Todo[] = []) => currentTodos.map(t => 
      t.id === id ? { ...t, completed: completed, progress: completed ? 100 : t.progress } : t
    ), false);

    try {
      const res = await fetch(`${API_URL}/${id}/completed`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });

      if (!res.ok) throw new Error("Failed to mark completed.");

      const result = await res.json();
      
      // 2. Revalidate to show the final state, especially the new currency amount 
      // (which is a side-effect of this API call).
      mutate(API_URL); 
      
      // Optional: You might want to trigger a revalidation of the user's currency data here as well.
      // mutate('/api/v1/currency'); 

      return result; // Return the success message/new currency from the API

    } catch (err) {
      // 3. Rollback
      mutate(API_URL);
      console.error("Failed to mark completed:", err);
      alert("Failed to complete task. You may have already claimed the reward.");
    }
  };

  return {
    todos,
    isLoading,
    error,
    createTodo,
    deleteTodo,
    updateProgress,
    markCompleted,
    // Helper property to easily access daily quests
    dailyQuests: todos ? todos.filter(t => t.dailyQuest && !t.completed) : [],
    // You can expose the SWR revalidate function if needed for manual refresh
    revalidate: () => mutate(API_URL), 
  };
};