import { useState, useEffect, useCallback } from 'react'; // Add useCallback
import toast from 'react-hot-toast';

interface Task {
  id: string;
  name: string;
  duration: number;
  sound?: string;
  rest_after?: number;
}

const presets = {
  workout: [
    { id: '1', name: 'Push-ups', duration: 120, sound: 'ding', rest_after: 30 },
    { id: '2', name: 'Squats', duration: 120, sound: 'ding', rest_after: 30 },
    { id: '3', name: 'Plank', duration: 60, sound: 'beep', rest_after: 60 },
    { id: '4', name: 'Burpees', duration: 90, sound: 'bell', rest_after: 30 },
  ],
  study: [
    { id: '1', name: 'Focus Reading', duration: 600, sound: 'beep', rest_after: 60 },
    { id: '2', name: 'Note Taking', duration: 300, sound: 'ding', rest_after: 30 },
    { id: '3', name: 'Review', duration: 300, sound: 'bell' },
  ],
};

export const useTimer = (onSessionComplete?: () => void) => {
  const [totalTime, setTotalTime] = useState(1200);
  const [tasks, setTasks] = useState<Task[]>(presets.workout);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [sessionTimeElapsed, setSessionTimeElapsed] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const activeTaskId = tasks[currentTaskIndex]?.id;

  const playSound = (sound: string) => {
    // Fallback to browser beep if sound file missing
    if (typeof window !== 'undefined') { // Fixed: Check for 'undefined' instead of ''
      const audio = new Audio(`/sounds/${sound}.mp3`);
      audio.play().catch(() => {
        // Fallback: Simple beep using Web Audio API
        const context = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)(); // Fixed: Use proper type assertion instead of 'any'
        const oscillator = context.createOscillator();
        oscillator.frequency.setValueAtTime(800, context.currentTime);
        oscillator.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.2);
      });
    }
  };

  const nextTask = useCallback(() => { // Stabilize with useCallback
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setTimeLeft(tasks[currentTaskIndex + 1].duration);
    } else {
      setIsRunning(false);
      setSessionCompleted(true);
      toast.success('Session complete!');
      playSound('session_complete');
      onSessionComplete?.();
    }
  }, [currentTaskIndex, tasks, onSessionComplete]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      const interval = setInterval(() => {
        setSessionTimeElapsed(prev => prev + 1);
        if (sessionTimeElapsed >= totalTime && !sessionCompleted) {
          setIsRunning(false);
          setSessionCompleted(true);
          toast.success('Session complete!');
          onSessionComplete?.();
          return;
        }

        const currentTask = tasks[currentTaskIndex];
        if (currentTask) {
          const taskDuration = isResting ? currentTask.rest_after || 0 : currentTask.duration;
          const progress = taskDuration ? ((taskDuration - timeLeft) / taskDuration) * 100 : 0;
          setProgressMap(prev => ({ ...prev, [currentTask.id]: Math.min(progress, 100) }));
        }

        if (timeLeft > 0) {
          setTimeLeft(timeLeft - 1);
        } else if (timeLeft === 0 && !isResting) {
          const task = tasks[currentTaskIndex];
          setCompletedTasks(prev => new Set(prev).add(task.id));
          if (task.rest_after) {
            setIsResting(true);
            setTimeLeft(task.rest_after);
            playSound(task.sound || 'default_task_complete');
          } else {
            nextTask();
          }
        } else if (timeLeft === 0 && isResting) {
          setIsResting(false);
          nextTask();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, isPaused, timeLeft, isResting, sessionTimeElapsed, totalTime, tasks, currentTaskIndex, onSessionComplete, sessionCompleted, nextTask]); // Added 'nextTask'

  const startTimer = () => {
    setSessionTimeElapsed(0);
    setCurrentTaskIndex(0);
    setTimeLeft(tasks[0].duration);
    setIsRunning(true);
    setIsPaused(false);
    setIsResting(false);
    setCompletedTasks(new Set());
    setSessionCompleted(false);
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const handlePreset = (preset: keyof typeof presets) => {
    setTasks(presets[preset]);
    setCompletedTasks(new Set());
  };

  const addTask = () => {
    setTasks([...tasks, { id: Date.now().toString(), name: '', duration: 60 }]);
  };

  const updateTask = (id: string, field: keyof Task, value: Task[keyof Task]) => { // Fixed: Use proper type instead of 'any'
    setTasks(tasks.map(task => task.id === id ? { ...task, [field]: value } : task));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const reorderTasks = (newOrder: Task[]) => {
    setTasks(newOrder);
  };

  return {
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
    activeTaskId,
    progressMap,
    completedTasks,
    startTimer,
    pauseTimer,
    addTask,
    updateTask,
    removeTask,
    reorderTasks,
    handlePreset,
  };
};