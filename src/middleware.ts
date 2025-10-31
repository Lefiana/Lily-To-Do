import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTokenFromNextRequest } from "@/lib/getTokenEdge";

export async function middleware(req: NextRequest) {
  const token = await getTokenFromNextRequest(req);
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/v1/:path*", "/dashboard/:path*"],
};
