// lib/getTokenEdge.ts
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function getTokenFromNextRequest(req: NextRequest) {
  return await getToken({
    req: req as any,
    secret: process.env.NEXTAUTH_SECRET,
  });
}
