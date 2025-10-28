import React from 'react';
import { Todo } from '@/types/timer'; // Add this import (adjust path if needed)

interface TimerControlsProps {
  totalTime: number;
  setTotalTime: (time: number) => void;
  isRunning: boolean;
  isPaused: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  todos: Todo[]; 
  linkedTodoId: string | null;
  setLinkedTodoId: (id: string | null) => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  totalTime,
  setTotalTime,
  isRunning,
  isPaused,
  startTimer,
  pauseTimer,
  todos,
  linkedTodoId,
  setLinkedTodoId,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const parseTime = (value: string) => {
    const parts = value.split(':').map(Number);
    if (parts.length === 2) {
      const [mins, secs] = parts;
      return (mins || 0) * 60 + (secs || 0);
    }
    return 0; // Default to 0 if invalid format
  };

  return (
    <>
      <div className="mb-4">
        <label htmlFor="total-time" className="text-white">Total Time (MM:SS):</label>
        <input
          id="total-time"
          type="text"
          value={formatTime(totalTime)}
          onChange={(e) => setTotalTime(parseTime(e.target.value))}
          className="w-full p-2 mt-1 bg-gray-700 text-white rounded"
          placeholder="20:00"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="linked-todo" className="text-white">Link to Todo:</label>
        <select
          id="linked-todo"
          value={linkedTodoId || ''}
          onChange={(e) => setLinkedTodoId(e.target.value || null)}
          className="w-full p-2 mt-1 bg-gray-700 text-white rounded"
        >
          <option value="">None</option>
          {todos?.map((todo: Todo) => ( // Fixed: Explicitly type 'todo' as Todo
            <option key={todo.id} value={todo.id}>{todo.title}</option>
          ))}
        </select>
      </div>

      <div className="text-center mb-4">
        <button onClick={startTimer} disabled={isRunning} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
          {isRunning ? 'Running' : 'Start Timer'}
        </button>
        {isRunning && (
          <button onClick={pauseTimer} className="bg-yellow-500 text-white px-4 py-2 rounded">
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
      </div>
    </>
  );
};
