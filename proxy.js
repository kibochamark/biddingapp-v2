
import {withAuth} from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextResponse } from "next/server";

const publicroutes = ["/", "/catalog", "/product", "/about", "/cookies", "/terms", "/privacy", "/faq", "/how-it-works"];


const apiAuthPrefix = "/api/auth";

const DEFAULT_LOGIN_REDIRECT = "/";



export default function proxy(req) {
    const { nextUrl } = req;
    const isauthenticated = !!req.auth


  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicroutes.includes(nextUrl.pathname ) || publicroutes.some((route) => nextUrl.pathname.startsWith(route + "/"));

  




  if (isApiAuthRoute) {
    if (isauthenticated){
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    }
    return null;
  }

  if (isPublicRoute) {
    return null;
  }

  return withAuth(req, {
    isReturnToCurrentPage: true
  });
}




export const config = {
  matcher: ["/(api|trpc)(.*)", "/", "/:path*"],
};