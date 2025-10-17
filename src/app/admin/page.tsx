// src/app/admin/page.tsx
import { auth } from "@/lib/auth"; // 🎯 Use the 'auth' helper from your config
import { redirect } from 'next/navigation';
import { Role } from "@prisma/client";

export default async function AdminPage() {
    // 1. Get the session using the modern 'auth()' helper
    const session = await auth();

    // 2. Perform the Authorization check
    // Note: The session.user.role check is safe because of your custom next-auth.d.ts file.
    if (!session || session.user.role !== Role.ADMIN) {
        // Redirect non-admin users to the home page or a 403 Forbidden page
        redirect('/');
    }

    // 3. Render the Admin Dashboard
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <p className="mb-2">User: {session.user.name || session.user.email}</p>
            <p className="mb-4">User ID: {session.user.id}</p>
            
            {/* 🎯 Placeholder for Admin Content */}
            <div className="mt-6 p-4 border rounded shadow">
                <h2>Item Management</h2>
                <p>Use this area to manage item rarity, images, and creation.</p>
                {/* Add components here to interact with your /api/admin/items route */}
            </div>
        </div>
    );
}