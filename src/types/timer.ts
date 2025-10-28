// src/types/timer.ts
export interface Task {
  id: string;
  name: string;
  duration: number; // Assuming tasks have a duration in minutes or seconds
  // Add other properties as needed
}

export interface TimerPreset {
  id: string;
  name: string;
  tasks: Task[];
  totalTime: number;
}

export interface Todo {
  id: string;
  title: string;
  // Add other properties as needed (e.g., completed, description)
}