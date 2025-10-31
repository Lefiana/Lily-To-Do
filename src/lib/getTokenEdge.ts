// src/lib/getTokenEdge.ts
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function getTokenFromNextRequest(req: NextRequest) {
  try {
    const token = await getToken({
      req: {
        headers: Object.fromEntries(req.headers),
      },
      secret: process.env.NEXTAUTH_SECRET,
      cookieName:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
    });

    if (!token) {
      console.warn("⚠️ No token found in request cookies");
    }

    return token;
  } catch (error) {
    console.error("❌ Token extraction failed:", error);
    return null;
  }
}
