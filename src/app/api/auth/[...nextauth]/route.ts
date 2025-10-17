// src/app/api/auth/[...nextauth]/route.ts

// 🎯 FIX: Import handlers directly from your main config file
import { handlers } from "@/lib/auth";

// Re-export them as the GET and POST methods for the dynamic route
export const { GET, POST } = handlers;
