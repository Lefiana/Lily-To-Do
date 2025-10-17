// src/components/dashboard/MainContentCard.tsx
"use client"; // 🎯 Must be a Client Component

import React from 'react';
import { GlassCard } from '@/components/dashboard/GlassCard';
import { useTodos } from '@/hooks/useTodos'; // 🎯 Import the hook

interface MainContentCardProps {
    currencyAmount: number;
    userName: string;
}

export const MainContentCard: React.FC<MainContentCardProps> = ({ currencyAmount, userName }) => {
    // 🎯 Get the pre-filtered dailyQuests list
    const { dailyQuests, isLoading: todosLoading } = useTodos();

    return (
        <GlassCard className="h-full w-full flex flex-col">
            <div className="flex justify-between items-center mb-6 text-gray-200 border-b border-white/20 pb-2">
                <span className="text-xl font-medium text-pink-400">Currency: {currencyAmount} 🪙</span>
                <span className="text-lg font-light text-white">Welcome, {userName}!</span>
            </div>
            
            <div className="flex-grow overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-4">
                    Daily Quests (Highlights) 🌟
                </h2>
                
                {todosLoading ? (
                    <p className="text-gray-400">Loading daily goals...</p>
                ) : dailyQuests.length > 0 ? (
                    <div className="space-y-4 text-gray-300">
                        {dailyQuests.map(quest => (
                            <div key={quest.id} className="p-4 bg-yellow-700/30 rounded-lg border border-yellow-600/50 shadow-lg">
                                <p className="text-lg font-semibold text-yellow-200">{quest.title}</p>
                                <p className="text-sm mt-1 text-gray-200 opacity-90">
                                    {quest.description || "No detailed description provided."}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic mt-4">
                        All daily quests are complete! Time for a reward roll?
                    </p>
                )}
            </div>
        </GlassCard>
    );
};