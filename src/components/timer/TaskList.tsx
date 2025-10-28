import React from 'react';
import { Trash2, GripVertical, PlusCircle } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Task {
  id: string;
  name: string;
  duration: number;
  sound?: string;
  rest_after?: number;
}

interface TaskListProps {
  tasks: Task[];
  completedTasks: Set<string>;
  addTask: () => void;
  updateTask: (id: string, field: keyof Task, value: Task[keyof Task]) => void; 
  removeTask: (id: string) => void;
  reorderTasks: (newOrder: Task[]) => void;
  activeTaskId?: string;
  progressMap?: Record<string, number>; // per-task % progress
}

const SOUND_OPTIONS = [
  { value: 'ding', label: 'Ding' },
  { value: 'beep', label: 'Beep' },
  { value: 'bell', label: 'Bell' },
  { value: 'whistle', label: 'Whistle' },
];

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  completedTasks,
  addTask,
  updateTask,
  removeTask,
  reorderTasks,
  activeTaskId,
  progressMap = {},
}) => {
  // Handle drag-and-drop reorder
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(tasks);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    reorderTasks(reordered);
  };

  const totalDuration = tasks.reduce((sum, t) => sum + t.duration + (t.rest_after || 0), 0);

  return (
    <div className="mb-4 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-semibold">Tasks</h3>
        <p className="text-gray-400 text-sm">
          Total Duration: {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
        </p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="task-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
              {tasks.map((task, index) => {
                const isCompleted = completedTasks.has(task.id);
                const progress = progressMap[task.id] || 0;
                const isActive = task.id === activeTaskId;

                return (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`relative p-4 rounded-2xl border border-gray-700 transition-colors ${
                          isCompleted
                            ? 'opacity-50 line-through bg-gray-700'
                            : isActive
                            ? 'bg-blue-800/70 border-blue-500 shadow-lg shadow-blue-500/20'
                            : 'bg-gray-800/70 hover:bg-gray-700/70'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2 flex-grow">
                            <span {...provided.dragHandleProps}>
                              <GripVertical className="text-gray-500 cursor-grab" size={18} />
                            </span>
                            <input
                              type="text"
                              placeholder="Task name"
                              value={task.name}
                              onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                              className="text-lg font-semibold bg-transparent text-white outline-none flex-grow"
                              disabled={isCompleted}
                            />
                          </div>

                          <button
                            onClick={() => removeTask(task.id)}
                            className="text-red-400 hover:text-red-300 transition"
                            title="Remove Task"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Inputs Row */}
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div className="flex flex-col">
                            <label htmlFor={`duration-${task.id}`} className="text-gray-400 text-xs mb-1">⏱ Duration (s)</label>
                            <input
                              id={`duration-${task.id}`}
                              type="number"
                              value={task.duration}
                              onChange={(e) => updateTask(task.id, 'duration', parseInt(e.target.value))}
                              className="p-1.5 bg-gray-900 text-white rounded-md border border-gray-600 focus:border-blue-500"
                              disabled={isCompleted}
                            />
                          </div>

                          <div className="flex flex-col">
                            <label htmlFor={`sound-${task.id}`} className="text-gray-400 text-xs mb-1">🔔 Sound</label>
                            <select
                              id={`sound-${task.id}`}
                              value={task.sound || ''}
                              onChange={(e) => updateTask(task.id, 'sound', e.target.value)}
                              className="p-1.5 bg-gray-900 text-white rounded-md border border-gray-600 focus:border-blue-500"
                              disabled={isCompleted}
                            >
                              <option value="">None</option>
                              {SOUND_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex flex-col">
                            <label htmlFor={`rest-${task.id}`} className="text-gray-400 text-xs mb-1">💤 Rest After (s)</label>
                            <input
                              id={`rest-${task.id}`}
                              type="number"
                              placeholder="e.g., 30"
                              value={task.rest_after || ''}
                              onChange={(e) =>
                                updateTask(task.id, 'rest_after', parseInt(e.target.value) || 0) // Fixed: Complete the fallback to 0
                              }
                              className="p-1.5 bg-gray-900 text-white rounded-md border border-gray-600 focus:border-blue-500"
                              disabled={isCompleted}
                            />
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {isActive && (
                          <div className="mt-3 h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-2 bg-blue-500 transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button
        onClick={addTask}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg mt-3 mx-auto transition"
      >
        <PlusCircle size={18} /> Add Task
      </button>
    </div>
  );
};