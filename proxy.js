
import {withAuth} from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextResponse } from "next/server";

const publicroutes = ["/", "/catalog", "/product", "/about", "/cookies", "/terms", "/privacy", "/faq", "/how-it-works"];


const apiAuthPrefix = "/api/auth";

const DEFAULT_LOGIN_REDIRECT = "/";



export default function proxy(req) {
    const { nextUrl } = req;
    const isauthenticated = !!req.auth


  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  // Check if route is public - handle home page and other routes
  const isPublicRoute =
    nextUrl.pathname === "/" ||
    publicroutes.some((route) => {
      if (route === "/") return nextUrl.pathname === "/";
      return nextUrl.pathname.startsWith(route);
    });

  if (isApiAuthRoute) {
    if (isauthenticated){
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    }
    return NextResponse.next();
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  return withAuth(req, {
    isReturnToCurrentPage: true
  });
}




export const config = {
  matcher: ["/(api|trpc)(.*)", "/", "/:path*"],
};