"use client";

import React, { useState, useEffect } from "react";
import { useTodos, Todo } from "@/hooks/useTodos";
import { GlassCard } from "@/components/dashboard/GlassCard";
import toast from "react-hot-toast";

interface EditTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo | null;
}

export const EditTodoModal: React.FC<EditTodoModalProps> = ({
  isOpen,
  onClose,
  todo,
}) => {
  const { updateTodo, deleteTodo } = useTodos();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isDailyQuest, setIsDailyQuest] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || "");
      setIsDailyQuest(todo.dailyQuest);
      setShowConfirmDelete(false);
    }
  }, [todo]);

  if (!isOpen || !todo) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSaving(true);
    try {
      await updateTodo(todo.id, {
        title,
        description,
        dailyQuest: isDailyQuest,
        category: isDailyQuest ? "dailyquest" : "default",
      });
      toast.success("Task updated successfully!");
      onClose();
    } catch (err) {
      console.error("Error updating todo:", err);
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    await deleteTodo(todo.id);
    toast.success("Task deleted successfully!");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Main Edit Modal */}
      <GlassCard
        className="w-full max-w-lg p-6 relative"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/20 pb-2">
          Edit Task: {todo.title}
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label
              htmlFor="edit-todo-title" // Added htmlFor to link the label
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Title
            </label>
            <input
              id="edit-todo-title" // Added id for association
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 text-sm bg-white/10 rounded-md border border-white/20 text-white"
              placeholder="Enter task title" // Added placeholder for accessibility and user hint
              title="Enter the title of the task" // Added title for tooltip
              required
            />
          </div>

          <div>
            <label
              htmlFor="edit-todo-description" // Added htmlFor to link the label
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Description
            </label>
            <textarea
              id="edit-todo-description" // Added id for association
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-2 text-sm bg-white/10 rounded-md border border-white/20 text-white resize-none"
              placeholder="Enter task description" // Added placeholder for accessibility and user hint
              title="Enter a detailed description of the task" // Added title for tooltip
            />
          </div>

          <label className="flex items-center space-x-3 text-sm text-white/80">
            <input
              type="checkbox"
              checked={isDailyQuest}
              onChange={(e) => setIsDailyQuest(e.target.checked)}
              className="w-5 h-5 text-pink-400 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
              title="Mark this task as a Urgent" 
            />
            <span>
              Mark as <strong>Urgent</strong>
            </span>
          </label>

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              className="px-4 py-2 text-sm font-bold text-white bg-red-700/80 rounded-md hover:bg-red-600 transition"
            >
              Delete Task
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-white/10 rounded-md hover:bg-white/20 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || isSaving}
                className="px-4 py-2 text-sm font-bold text-white bg-green-600/80 rounded-md hover:bg-green-500 transition disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </GlassCard>

      {/* Delete Confirmation GlassCard */}
      {showConfirmDelete && (
        <div
          className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setShowConfirmDelete(false)}
        >
          <GlassCard
            className="w-full max-w-sm p-6 text-center border border-red-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-3">
              Confirm Deletion
            </h3>
            <p className="text-gray-300 mb-5">
              Are you sure you want to delete{" "}
              <span className="text-red-400 font-semibold">{todo.title}</span>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md text-sm font-semibold"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};