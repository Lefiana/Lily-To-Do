// src/components/dashboard/MainContentCard.tsx
"use client";

import React from "react";
import useSWR from 'swr';
import { GlassCard } from "@/components/dashboard/GlassCard";
import { useTodos } from "@/hooks/useTodos";
import { useCurrency } from "@/hooks/useCurrency";
import { useUser } from "@/hooks/useUser"; // ✅ import the new hook
import { NoteData } from '@/types/note';

interface Note extends NoteData {
  id: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const MainContentCard: React.FC = () => {
  const { dailyQuests, isLoading: todosLoading } = useTodos();
  const { currency, currencyLoading, currencyError } = useCurrency();
  const { userName, userLoading, userError } = useUser(); // ✅ get user name
  const { data: favoriteNotes, error: notesError, isLoading: notesLoading } = useSWR('/api/v1/notes?favorite=true', fetcher);

  return (
    <GlassCard className="h-full w-full flex flex-col">
      <div className="flex justify-between items-center mb-6 text-gray-200 border-b border-white/20 pb-2">
        <span className="text-xl font-medium text-pink-400 ">
          Currency: {currencyLoading ? "Loading..." : `${currency}🪙`}
        </span>
        <span className="text-lg font-light text-white ">
          {userLoading
            ? "Loading user..."
            : userError
            ? "User not found"
            : `Welcome, ${userName}!`}
        </span>
      </div>

      {currencyError && (
        <p className="text-red-400 mb-2">
          Error loading currency data. Please refresh.
        </p>
      )}

      <div className="flex-grow overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4 readable-text">
          Urgent (Highlights) 🌟
        </h2>

        {todosLoading ? (
          <p className="text-gray-400">Loading daily goals...</p>
        ) : dailyQuests.length > 0 ? (
          <div className="space-y-4 text-gray-300">
            {dailyQuests.map((quest) => (
              <div
                key={quest.id}
                className="p-4 bg-yellow-700/30 rounded-lg border border-yellow-600/50 shadow-lg"
              >
                <p className="text-lg font-semibold text-yellow-200">
                  {quest.title}
                </p>
                <p className="text-sm mt-1 text-gray-200 opacity-90">
                  {quest.description || "No detailed description provided."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic mt-4 readable-text">
            All daily quests are complete! Time for a reward roll?
          </p>
        )}

        {/* Pinned Favorite Notes Section */}
        <h2 className="text-2xl font-bold text-white mb-4 mt-8 readable-text">
          Pinned Notes 📌
        </h2>

        {notesLoading ? (
          <p className="text-gray-400">Loading favorite notes...</p>
        ) : notesError ? (
          <p className="text-red-400">Error loading favorite notes.</p>
        ) : favoriteNotes && favoriteNotes.length > 0 ? (
          <div className="space-y-4 text-gray-300">
            {favoriteNotes.map((note: Note) => (
              <div
                key={note.id}
                className="p-4 bg-blue-700/30 rounded-lg border border-blue-600/50 shadow-lg"
              >
                <p className="text-lg font-semibold text-blue-200">
                  {note.title}
                </p>
                <p className="text-sm mt-1 text-gray-200 opacity-90">
                  {note.content}
                </p>
                {note.tags && note.tags.length > 0 && (
                  <p className="text-xs text-gray-400 mt-2">Tags: {note.tags.join(', ')}</p>
                )}
                {note.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">Created: {new Date(note.createdAt).toLocaleDateString()}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic mt-4 readable-text">
            No favorite notes pinned yet. Mark some in the Notes Modal!
          </p>
        )}
      </div>
    </GlassCard>
  );
};
