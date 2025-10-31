import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Token missing or invalid → block access
  if (!token) {
    const url = new URL(req.url);

    if (url.pathname.startsWith("/api/")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Token is valid → continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/v1/:path*", "/dashboard/:path*"],
};
