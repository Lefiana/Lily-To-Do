// src/components/dashboard/TimerModal.tsx
"use client";

import React, { useState } from 'react';
import { GlassCard } from '@/components/dashboard/GlassCard';
import useSWR from 'swr';
import { useTimer } from '@/hooks/useTimer';
import { useTodos } from '@/hooks/useTodos'; // 🎯 Import your hook
import { PresetSelector } from './PresetSelector';
import { TaskList } from './TaskList';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import toast from 'react-hot-toast'; // 🎯 Import toast

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface TimerModalProps {
  onClose: () => void;
}

export const TimerModal: React.FC<TimerModalProps> = ({ onClose }) => {
  const { data: todos } = useSWR('/api/v1/todo', fetcher);
  const { markCompleted } = useTodos(); // 🎯 Use your hook for todo updates
  const [linkedTodoId, setLinkedTodoId] = useState<string | null>(null);

  const handleReward = async () => {
    if (linkedTodoId) {
      try {
        await markCompleted(linkedTodoId, true, true); // 🎯 Pass true for timer completion
        toast.success('Todo completed and timer reward earned!');
      } catch (err) {
        console.error('Todo completion failed:', err);
        toast.error('Failed to complete todo.');
      }
    } else {
      toast.success('Session complete!');
    }
  };
  
  const {
    tasks,
    setTasks,
    totalTime,
    setTotalTime,
    currentTaskIndex,
    timeLeft,
    isRunning,
    isPaused,
    isResting,
    sessionTimeElapsed,
    completedTasks,
    activeTaskId,
    progressMap,
    startTimer,
    pauseTimer,
    addTask,
    updateTask,
    removeTask,
    reorderTasks,
    handlePreset,
  } = useTimer(handleReward);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <GlassCard className="w-full max-w-xl h-3/4 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Timer</h2>
          <button onClick={onClose} className="text-white hover:text-pink-400 text-2xl">×</button>
        </div>

        <div className="flex-grow overflow-y-auto">
          <PresetSelector
            onPresetChange={(preset) => {
              if (typeof preset === 'string') {
                handlePreset(preset as 'workout' | 'study');
              } else {
                setTasks(preset.tasks); // Now works
                setTotalTime(preset.totalTime);
              }
            }}
            currentTasks={tasks}
            currentTotalTime={totalTime}
            setTasks={setTasks} // 🎯 Pass setTasks
            setTotalTime={setTotalTime} // 🎯 Pass setTotalTime
          />
          <TaskList
            tasks={tasks}
            completedTasks={completedTasks}
            addTask={addTask}
            updateTask={updateTask}
            removeTask={removeTask}
            reorderTasks={reorderTasks}
            activeTaskId={activeTaskId}
            progressMap={progressMap}
          />
            <TimerControls
            totalTime={totalTime}
            setTotalTime={setTotalTime}
            isRunning={isRunning}
            isPaused={isPaused}
            startTimer={startTimer}
            pauseTimer={pauseTimer}
            todos={todos}
            linkedTodoId={linkedTodoId}
            setLinkedTodoId={setLinkedTodoId}
          />
          <TimerDisplay
            tasks={tasks}
            currentTaskIndex={currentTaskIndex}
            timeLeft={timeLeft}
            isResting={isResting}
            sessionTimeElapsed={sessionTimeElapsed}
            totalTime={totalTime}
          />
        </div>
      </GlassCard>
    </div>
  );
};
