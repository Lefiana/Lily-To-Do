import React from 'react';
import { Clock } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  duration: number;
  sound?: string;
  rest_after?: number;
}

interface TimerDisplayProps {
  tasks: Task[];
  currentTaskIndex: number;
  timeLeft: number;
  isResting: boolean;
  sessionTimeElapsed: number;
  totalTime: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  tasks,
  currentTaskIndex,
  timeLeft,
  isResting,
  sessionTimeElapsed,
  totalTime,
}) => {
  const currentTask = tasks[currentTaskIndex];
  const totalSessionProgress = (sessionTimeElapsed / totalTime) * 100;
  const taskDuration = isResting ? currentTask?.rest_after || 0 : currentTask?.duration || 0;
  const taskProgress = taskDuration
    ? ((taskDuration - timeLeft) / taskDuration) * 100
    : 0;

  return (
    <div className="text-center bg-gray-800/60 rounded-2xl p-6 shadow-lg border border-gray-700">
      <div className="flex items-center justify-center mb-3 gap-2 text-blue-400">
        <Clock size={22} />
        <span className="font-semibold text-lg">Workout Timer</span>
      </div>

      <p className="text-white text-3xl font-bold mb-2">
        {isResting ? 'Rest' : currentTask?.name || 'Ready'}
      </p>

      <p className="text-gray-300 text-xl mb-4">
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </p>

      {/* Current Task Progress */}
      {currentTask && (
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isResting ? 'bg-yellow-400' : 'bg-blue-500'
            }`}
            style={{ width: `${taskProgress}%` }}
          ></div>
        </div>
      )}

      {/* Session Progress */}
      <div className="w-full bg-gray-700 rounded-full h-1.5 mb-3">
        <div
          className="h-1.5 bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${totalSessionProgress}%` }}
        ></div>
      </div>

      {/* Session Summary */}
      <p className="text-gray-400 text-sm">
        Session: {Math.floor(sessionTimeElapsed / 60)}:
        {(sessionTimeElapsed % 60).toString().padStart(2, '0')} /{' '}
        {Math.floor(totalTime / 60)}:
        {(totalTime % 60).toString().padStart(2, '0')}
      </p>

      {currentTaskIndex < tasks.length - 1 && (
        <p className="text-gray-500 text-xs mt-2">
          Next: {tasks[currentTaskIndex + 1]?.name || '—'}
        </p>
      )}
    </div>
  );
};
