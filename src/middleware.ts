// src/middleware.ts
import { auth } from "@/lib/auth"; // Import the 'auth' object
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Import Prisma client
import { Role } from "@prisma/client"; // Import Role enum
import { getUserIdFromSession } from "@/lib/session"; // Import session helper

export default auth(async (req) => {
    const userId = await getUserIdFromSession(); // Get user ID from session
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
});

// Keep your matcher config
export const config = {
    matcher: [
        "/api/v1/:path*",
        "/dashboard/:path*",
    ],
};

// // src/middleware.ts
// import { auth } from "@/lib/auth"; // 1. Import the 'auth' object you exported in src/lib/auth.ts
// import { NextResponse } from "next/server";

// // 2. Use the 'auth' object as the default export.
// // It wraps the request and handles session validation based on your config.
// export default auth((req) => {
//     // Optional: Add custom logic here if you need to inspect the session or request before protection.
//     // For example, role-based checks for specific paths that are NOT in the matcher.
    
//     // The default behavior is to redirect unauthenticated users to the signIn page
//     // as defined in your authOptions.
    
//     return NextResponse.next();
// });

// // 3. Keep your matcher config
// export const config = {
//     // This matcher tells Next.js which paths should run through this middleware
//     matcher: [
//         "/api/v1/:path*",
//         "/dashboard/:path*",
//     ],
// };