// src/components/notes/Toast.tsx
"use client";

import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

export const Toast: React.FC<{ toast: ToastProps | null }> = ({ toast }) => {
  if (!toast) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-60 p-4 rounded-md text-white ${
        toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      {toast.message}
    </div>
  );
};