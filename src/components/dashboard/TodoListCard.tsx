// src/components/dashboard/ToDoListCard.tsx
"use client";

import React, { useState } from 'react';
import { GlassCard } from '@/components/dashboard/GlassCard';
import { useTodos, Todo } from '@/hooks/useTodos'; // 🎯 Import the hook and type

export const ToDoListCard: React.FC = () => {
    // 🎯 Call the hook to access data and mutations
    const { todos, isLoading, error, createTodo, markCompleted, deleteTodo } = useTodos();
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [isDailyQuest, setIsDailyQuest] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodoTitle.trim()) {
            // 🎯 FIX: Provide all required properties, even with default/null values
            createTodo({ 
                title: newTodoTitle.trim(), 
                description: null, // Required by Pick<Todo, ...>
                category: isDailyQuest ? 'dailyquest' : 'default', // Use the toggle state
                dailyQuest: isDailyQuest, // Required by Pick<Todo, ...>
                repeatDaily: false, // Required by Pick<Todo, ...>
            }); 
            
            setNewTodoTitle('');
            setIsDailyQuest(false); // Reset toggle after submission
        }
    };

    const handleToggleCompleted = (todo: Todo) => {
        // 🎯 Use the markCompleted function to toggle completion status
        markCompleted(todo.id, !todo.completed); 
    };

    const handleDelete = (id: string) => {
        // 🎯 Use the deleteTodo function
        if (window.confirm("Are you sure you want to delete this task?")) {
            deleteTodo(id);
        }
    };

    // Filter and sort for display: incomplete tasks first, then completed ones
    const sortedTodos = (todos || []).sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1; // Incomplete (false) comes first
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
    });

    return (
        <GlassCard className="h-full w-full flex flex-col">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2">
                To Do 📝
            </h2>
            
            <div className="flex-grow overflow-y-auto space-y-3 text-gray-300 pr-2">
                {isLoading && <p>Loading tasks...</p>}
                {error && <p className="text-red-400">Error loading tasks.</p>}
                
                {sortedTodos.map(todo => (
                    <div key={todo.id} className="flex items-start justify-between p-2 bg-white/5 rounded-md hover:bg-white/10 transition duration-100">
                        <div className="flex items-center space-x-2 flex-grow">
                            <input 
                                type="checkbox" 
                                checked={todo.completed} 
                                onChange={() => handleToggleCompleted(todo)}
                                // ✅ A11Y FIX: Describe the checkbox purpose for screen readers
                                aria-label={`Mark task "${todo.title}" as complete`} 
                                className="w-5 h-5 text-pink-400 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
                            />
                            <span className={`text-sm ${todo.completed ? "line-through opacity-60 text-gray-400" : "text-white"}`}>
                                {todo.title}
                                {todo.dailyQuest && (
                                    <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-600/50 rounded-full text-yellow-200">
                                        Daily
                                    </span>
                                )}
                            </span>
                        </div>
                        <button 
                            onClick={() => handleDelete(todo.id)} 
                            // ✅ A11Y FIX: Add a title attribute for button context
                            title={`Delete task: ${todo.title}`}
                            className="text-red-400 opacity-70 hover:opacity-100 text-sm ml-2"
                        >
                            ×
                        </button>
                    </div>
                ))}

                {sortedTodos.length === 0 && !isLoading && !error && (
                    <p className="text-center text-gray-500 mt-4">No tasks yet. Add one!</p>
                )}
            </div>

            {/* Input area for new tasks */}
            {/* ✅ Restructured form to include the Daily Quest toggle */}
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-2">
                
                {/* 1. New Task Title Input */}
                <div className="flex space-x-2">
                    <label htmlFor="newTodoTitle" className="sr-only">New task title</label> {/* Hidden label for A11Y */}
                    <input
                        id="newTodoTitle" // ✅ Added ID to associate with the label
                        type="text"
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}
                        placeholder="New task title..." // Placeholder is fine now
                        className="flex-grow !p-2 !text-sm !bg-white/10 !rounded-md !border-none text-white focus:ring-pink-500"
                    />
                    <button 
                        type="submit" 
                        title="Add New Task"
                        className="bg-blue-500/80 hover:bg-blue-600 !p-2 !rounded-md !text-sm text-white font-medium whitespace-nowrap"
                    >
                        Add
                    </button>
                </div>

                {/* 2. Daily Quest Toggle */}
                <label htmlFor="isDailyQuest" className="flex items-center space-x-2 text-sm text-white/80">
                    <input 
                        id="isDailyQuest" // ✅ Added ID
                        type="checkbox" 
                        // Assuming you added: const [isDailyQuest, setIsDailyQuest] = useState(false);
                        checked={isDailyQuest} 
                        onChange={(e) => setIsDailyQuest(e.target.checked)}
                        className="w-4 h-4 text-pink-400 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
                    />
                    <span>Mark as Daily Quest? (Awards bonus currency on completion)</span>
                </label>

            </form>

        </GlassCard>
    );
};