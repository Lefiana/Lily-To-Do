// src/components/dashboard/ToDoListCard.tsx
"use client";

import React, { useState } from 'react';
import { GlassCard } from '@/components/dashboard/GlassCard';
import { useTodos, Todo } from '@/hooks/useTodos'; 
import { CreateTodoModal } from './CreateTodoModal';
import { EditTodoModal } from './EditTodoModal';
export const ToDoListCard: React.FC = () => {
    // 🎯 Call the hook to access data and mutations hooks and modal
    const { todos, isLoading, error, markCompleted} = useTodos(); 
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

    const handleToggleCompleted = (todo: Todo) => {
        // 🎯 Use the markCompleted function to toggle completion status
        markCompleted(todo.id, !todo.completed); 
    };

    // Filter and sort for display: incomplete tasks first, then completed ones
    const sortedTodos = (todos || []).sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1; // Incomplete (false) comes first
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
    });

    const handleEditClick = (todo: Todo) => {
        setSelectedTodo(todo);
        setIsEditModalOpen(true);
    };

 return (
        <>
            <GlassCard className="h-full w-full flex flex-col min-w-0"> 
                <h2 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2 readable-text">
                    To Do 📝
                </h2>
                                {/* Add Task Button */}
                <div className="mt-4">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full bg-pink-600/80 hover:bg-pink-500 text-white 
                        font-bold py-2 rounded-lg transition duration-150 shadow-lg"
                    >
                        + Add Task
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto overflow-x-hidden space-y-2 text-gray-300 pr-2">
                    {isLoading && <p>Loading tasks...</p>}
                    {error && <p className="text-red-400">Error loading tasks.</p>}
                    
                    {sortedTodos.map(todo => (
                        // Parent Wrapper
                        <div 
                            key={todo.id} 
                            className="flex items-center 
                            justify-between p-2 min-h-[3.5rem] bg-white/5 rounded-lg 
                            transition duration-150 hover:bg-white/10 group readable-text" 
                        >
                            {/* 1. LEFT DOORS: Toggle Complete */}
                            <label 
                                className="flex items-center space-x-3 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleToggleCompleted(todo);
                                }}
                            >
                                <div 
                                    // Main container for the Checkbox Doors
                                    className="w-8 h-8 relative [perspective:100px] shrink-0"
                                >
                                    {/* Left Door (Pink Accent) */}
                                    <div 
                                        className={`absolute w-1/2 h-full top-0 bg-gray-700 border border-gray-900 
                                                    transition-transform duration-600 
                                                    [transform-origin:left] ${todo.completed ? '[transform:rotateY(-110deg)]' : ''}`}
                                    />
                                    {/* Right Door (Pink Accent) */}
                                    <div 
                                        className={`absolute w-1/2 h-full top-0 right-0 bg-gray-700 
                                            border border-gray-900 transition-transform duration-600 
                                                    [transform-origin:right] ${todo.completed ? '[transform:rotateY(110deg)]' : ''}`}
                                    />
                                    {/* Checkmark (Pink) */}
                                    <span 
                                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 
                                            -translate-y-1/2 text-lg text-pink-400 drop-shadow-lg transition-transform duration-400 
                                                    ${todo.completed ? 'scale-100' : 'scale-0'}`}
                                    >
                                        ✓
                                    </span>
                                </div>
                            </label>
                            
                            {/* 2. Middle Section: Task Title and Badge (Hover for Description) */}
                            <div 
                                className={`flex-grow mx-4 flex flex-col justify-center relative min-w-0 
                                            ${todo.completed ? 'opacity-60 text-gray-400' : 'text-white'}`}
                            >
                                <p className="text-base font-medium break-words">
                                    {todo.title}
                                </p>
                                
                                {/* DESCRIPTION ON HOVER (Simple Popup) */}
                                {todo.description && (
                                    <div className="absolute left-1/2 top-0 mt-8 w-64 p-3 bg-gray-800 border border-gray-600 rounded-lg shadow-xl text-xs text-gray-200 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <p className="font-semibold mb-1">Description:</p>
                                        {todo.description}
                                    </div>
                                )}
                            </div>

                            {/* RIGHT SIDE: DAILY + EDIT DOORS */}
                            <div className="flex items-center space-x-2">
                                {todo.dailyQuest && (
                                <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-700/50 
                                rounded-full text-yellow-100 whitespace-nowrap">
                                    Urgent
                                </span>
                                )}

                                <label
                                className="flex items-center cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(todo);
                                }}
                                >
                                <div
                                    className={`w-8 h-8 relative [perspective:100px] shrink-0 
                                        edit-doors ${isEditModalOpen && selectedTodo?.id === todo.id ? 'open' : ''}`}
                                >
                                    <div className="absolute w-1/2 h-full top-0 bg-yellow-700 
                                    border border-yellow-900 transition-transform duration-600 [transform-origin:left] 
                                    hover:[transform:rotateY(-110deg)]" />
                                    <div className="absolute w-1/2 h-full top-0 right-0 bg-yellow-700 
                                    border border-yellow-900 transition-transform duration-600 [transform-origin:right] 
                                    hover:[transform:rotateY(110deg)]" />
                                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 
                                    -translate-y-1/2 text-sm text-white drop-shadow-lg">
                                        ✎
                                    </span>
                                </div>
                                </label>
                            </div>
                        </div>
                    ))}
                    
                </div>
        
            </GlassCard>

            {/* Render Modals */}
            <CreateTodoModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
            <EditTodoModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                todo={selectedTodo}
            />
        </>
    );
};