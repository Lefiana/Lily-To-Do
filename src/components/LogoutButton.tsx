// src/components/LogoutButton.tsx (Client Component)
'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react'; // Example icon library

export function LogoutButton() {
  const handleLogout = () => {
    // Calling signOut() removes the session cookie and redirects the user
    // (usually to the home page or the specified signIn page).
    signOut({ callbackUrl: '/login' }); // Redirect back to the home page after logout
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-3 px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
    >
      <LogOut className="w-4 h-4" />
      <span>Logout</span>
    </button>
  );
}