import { auth } from "@/lib/auth"; // Import the NextAuth session getter
import { NextResponse } from "next/server";
import { Session } from "next-auth";

/**
 * Ensures the request is authenticated and authorized with the required role.
 *
 * @param requiredRole The role string required to access the resource (e.g., 'admin').
 * @returns The user's session if authorized.
 * @throws An unauthorized or forbidden response if checks fail.
 */
export async function getRequiredAuth(requiredRole: string): Promise<{ session: Session }> {
    // 1. Get the session using the Auth.js helper
    const session = await auth();

    // 2. Check Authentication
    if (!session || !session.user) {
        throw NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    // 3. Check Authorization (Role)
    // We assume 'session.user.role' is populated by your callbacks in @/lib/auth.ts
    const userRole = session.user.role;
    
    // NOTE: Using 'as any' is a temporary cast to access the custom 'role' property.
    // If your project has correctly set up next-auth.d.ts, this cast won't be needed.
    
    if (userRole !== requiredRole) {
        throw NextResponse.json({ 
            error: "Forbidden. Insufficient permissions." 
        }, { status: 403 });
    }

    // 4. Return the session if all checks pass
    return { session };
}
