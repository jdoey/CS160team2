import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userToken = request.cookies.get("session")?.value;
  if (!userToken) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (
    userToken &&
    (request.nextUrl.pathname.startsWith("/signin") ||
      request.nextUrl.pathname.startsWith("/enroll"))
  ) {
    return NextResponse.redirect(new URL("/user", request.url));
  }
}

export const config = {
  matcher: ["/user/:path*", "/signin", "/enroll"],
};
