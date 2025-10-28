
// src/middleware.ts
import { auth } from "@/lib/auth"; // 1. Import the 'auth' object you exported in src/lib/auth.ts
import { NextResponse } from "next/server";

export default auth((req) => {
    return NextResponse.next();
});

// 3. Keep your matcher config
export const config = {
    // This matcher tells Next.js which paths should run through this middleware
    matcher: [
        "/api/v1/:path*",
        "/dashboard/:path*",
    ],
};