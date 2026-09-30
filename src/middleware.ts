import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { authKey } from "./lib";

const authRoutes = [
  "/",
  "/forgot-password",
  "/reset-password",
  "/new-password",
  "/verify-otp",
  "/privacy-policy",
  "/support",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookiesStore = await cookies();
  const token = cookiesStore.get(authKey)?.value;
  const decoded: any = token && jwtDecode(token as string);
  const roleKey = decoded?.user?.role as string;

  if (!token) {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  const isAuthRoute = authRoutes.some((route) => pathname === route);

  if (roleKey == "admin") {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (/^\/dashboard\/*/.test(pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/forgot-password",
    "/reset-password",
    "/new-password",
    "/verify-otp",
    "/privacy-policy",
    "/support",
  ],
};
