// src/app/admin/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { Role } from "@prisma/client";
import { AdminItemManager } from '@/components/admin/AdminItemManager'; // 🎯 Import the component

export default async function AdminPage() {
    const session = await auth();

    if (!session || session.user.role !== Role.ADMIN) {
        redirect('/');
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <p className="mb-2">User: {session.user.name || session.user.email}</p>
            <p className="mb-4">User ID: {session.user.id}</p>
            
            {/* 🎯 Replace placeholder with the component */}
            <AdminItemManager />
        </div>
    );
}