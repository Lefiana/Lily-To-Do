// src/components/dashboard/CreateTodoModal.tsx
"use client";

import React, { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { GlassCard } from '@/components/dashboard/GlassCard';
import toast from 'react-hot-toast';
interface CreateTodoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateTodoModal: React.FC<CreateTodoModalProps> = ({ isOpen, onClose }) => {
    const { createTodo, todos, revalidate } = useTodos();  // Add 'todos' to the destructured hook
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isDailyQuest, setIsDailyQuest] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        // Rate limiting check: Prevent creating more than 3 active daily quests
        if (isDailyQuest) {
            await revalidate();
            const existingDailyQuests = todos?.filter(t => t.dailyQuest && !t.completed) || [];
            if (existingDailyQuests.length >= 3) {
                toast.error("You already have 3 active daily quests today."); 
                return;  // Prevent submission
            }
        }

        createTodo({
            title: title.trim(),
            description: description.trim() || null, // Allow null if empty
            category: isDailyQuest ? 'dailyquest' : 'default',
            dailyQuest: isDailyQuest,
            repeatDaily: false,
        });

        // Reset and close
        setTitle('');
        setDescription('');
        setIsDailyQuest(false);
        onClose();
    };

    return (
        // Modal Backdrop
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
            {/* Modal Content - Prevent closing when clicking inside */}
            <GlassCard className="w-full max-w-md p-6 relative" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/20 pb-2">
                    Create New Task
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title Input */}
                    <div>
                        <label htmlFor="modalTitle" className="block text-sm font-medium text-gray-300 mb-1">Title <span className="text-red-400">*</span></label>
                        <input
                            id="modalTitle"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 text-sm bg-white/10 rounded-md border border-white/20 text-white focus:ring-pink-500 focus:border-pink-500"
                            required
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label htmlFor="modalDescription" className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
                        <textarea
                            id="modalDescription"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full p-2 text-sm bg-white/10 rounded-md border border-white/20 text-white focus:ring-pink-500 focus:border-pink-500 resize-none"
                        />
                    </div>

                    {/* Daily Quest Toggle */}
                    <label htmlFor="modalDailyQuest" className="flex items-center space-x-3 text-sm text-white/80">
                        <input
                            id="modalDailyQuest"
                            type="checkbox"
                            checked={isDailyQuest}
                            onChange={(e) => setIsDailyQuest(e.target.checked)}
                            className="w-4 h-4 text-pink-400 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
                        />
                        <span>Mark as **Urgent** (Bonus Reward)</span>
                    </label>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-300 bg-white/10 rounded-md hover:bg-white/20 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-bold text-white bg-pink-600/80 rounded-md hover:bg-pink-500 transition disabled:opacity-50"
                            disabled={!title.trim()}
                        >
                            Create Task
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};