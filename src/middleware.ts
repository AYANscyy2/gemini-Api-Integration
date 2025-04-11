// middleware.ts (create this file in your root directory)
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const publicPaths = ["/", "/api/auth"];

  const isPublicPath = publicPaths.some(
    (publicPath) => path === publicPath || path.startsWith(publicPath + "/")
  );

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  if (!token && !isPublicPath) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(loginUrl);
  }

  if (token && (path === "/" || path === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"]
};
