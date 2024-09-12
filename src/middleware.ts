import { auth } from "@/auth";
import { AUTH_API_URL } from "./lib/api-url";
import { encode, getToken } from "next-auth/jwt";
import { signOut } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

export default auth(async (req) => {
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
  const nowDate = Date.now();

  // If user is authenticated but the token is expired
  if (req.auth?.user && req.auth?.user.token_expires * 1000 <= nowDate) {
    const response = await fetch(`${AUTH_API_URL}/refresh-token`, {
      headers: {
        Authorization: `Bearer ${req.auth.user.refresh_token}`,
      },
    });

    const res = await response.json();
    // Verify the token and expiration
    const resVerify = await fetch(`${AUTH_API_URL}/verify-token`, {
      headers: {
        Authorization: `Bearer ${req.auth.user.refresh_token}`,
      },
    });

    if (resVerify.ok) {
      console.log("verify test");
      return NextResponse.next();
    }

    const newSessionToken = await encode({
      secret: process.env.AUTH_SECRET,
      token: {
        ...req.cookies.get("authjs.session-token"),
        accessToken: res.data.access_token,
      },
      maxAge: 30 * 24 * 60 * 60, // 30 days, or get the previous token's exp
      salt: "123",
    });

    // console.log(
    //   req.cookies.get("authjs.session-token")?.value,
    //   "session cookie token"
    // );
    // console.log(newSessionToken, "session2");
    const resp = NextResponse.next();

    resp.cookies.set(
      req.cookies.get("authjs.session-token").value,
      newSessionToken
    );
    // console.log(resp, "resp");
    return resp;
  }

  // Proceed if the request is authenticated or is for the login page
  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
