import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("adminToken")?.value;
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/login"];
  const isPublicRoute = publicRoutes.includes(pathname);

  const protectedRoutes = [
    "/users",
    "/content",
    "/categories",
    "/settings",
    "/templates",
    "/subscriptions",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect unauthenticated users away from root
  if (pathname === "/" && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔒 Block protected routes if no token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If logged in and trying login page → go dashboard
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/users/:path*",
    "/content/:path*",
    "/categories/:path*",
    "/settings/:path*",
    "/templates/:path*",
    "/subscriptions/:path*",
    "/login",
  ],
};