import { auth } from "@/auth";
import { AUTH_API_URL } from "./lib/api-url";
import { encode, getToken } from "next-auth/jwt";
import { signOut } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

export default auth(async (req) => {
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    // Check if the current URL has any parameters or if the path is longer than '/login'
    if (
      req.nextUrl.pathname.startsWith("/login") &&
      req.nextUrl.searchParams.toString()
    ) {
      const newUrl = new URL("/login", process.env.NEXT_AUTH_URL); // clean URL without parameters
      return Response.redirect(newUrl);
    }
    const newUrl = new URL("/login", process.env.NEXT_AUTH_URL);
    return Response.redirect(newUrl);
  }

  const nowDate = Date.now();

  // If user is authenticated but the token is expired
  if (req.auth?.user && req.auth?.user.token_expires * 1000 <= nowDate) {
    try {
      const response = await fetch(`${AUTH_API_URL}/refresh-token`, {
        headers: {
          Authorization: `Bearer ${req.auth.user.refresh_token}`,
        },
      });

      if (!response.ok) {
        const newUrl = new URL("/login", process.env.NEXT_AUTH_URL);
        return Response.redirect(newUrl);
      }

      const res = await response.json();
      // Verify the token and expiration
      const resVerify = await fetch(`${AUTH_API_URL}/verify-token`, {
        headers: {
          Authorization: `Bearer ${req.auth.user.refresh_token}`,
        },
      });

      // console.log(res);

      if (resVerify.ok) {
        console.log("verify test");
        return NextResponse.next();
      }

      const newSessionToken = await encode({
        //@ts-ignore
        secret: process.env.AUTH_SECRET,
        token: {
          ...req.cookies.get("authjs.session-token"),
          accessToken: res.data.access_token,
        },
        maxAge: 30 * 24 * 60 * 60, // 30 days, or get the previous token's exp
        salt: "123",
      });
    } catch (e) {
      console.log(e);
    }

    // console.log(
    //   req.cookies.get("authjs.session-token")?.value,
    //   "session cookie token"
    // );
    // console.log(newSessionToken, "session2");
    const resp = NextResponse.next();

    // resp.cookies.set(
    //   req.cookies.get("authjs.session-token").value,
    //   newSessionToken
    // );
    // console.log(resp, "resp");
    return resp;
  }

  // Proceed if the request is authenticated or is for the login page
  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
