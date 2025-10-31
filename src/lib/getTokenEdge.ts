// src/lib/getTokenEdge.ts
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

/**
 * Securely extracts and verifies a NextAuth JWT token inside Middleware or Edge functions.
 * Fully typed — no 'any', compatible with strict TypeScript & Vercel Edge Runtime.
 */
export async function getTokenFromNextRequest(req: NextRequest) {
  return await getToken({
    req: {
      headers: Object.fromEntries(req.headers), // Convert NextRequest headers to plain object
    },
    secret: process.env.NEXTAUTH_SECRET,
  });
}
