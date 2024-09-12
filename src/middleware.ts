import { auth } from "@/auth";
import { AUTH_API_URL } from "./lib/api-url";
import { encode, getToken } from "next-auth/jwt";
import { signOut } from "next-auth/react";
import { NextResponse } from "next/server";


export default auth(async (req) => {
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
  const nowDate = Date.now();
  // console.log(req.auth?.user, "user middleware");
  if (req.auth?.user && req.auth?.user.token_expires * 1000 <= nowDate) {
    if (!("accessToken" in req.auth?.user)) {
      return Response.redirect("/login");
    }

    const response = await fetch(`${AUTH_API_URL}/refresh-token`, {
      headers: {
        Authorization: `Bearer ${req.auth.user.refreshToken}`,
      },
    });

    const res = await response.json();
    // Update the token and expiration
    // req.auth.user.accessToken = res.data.access_token;
    // req.auth.user.token_expires = res.data.token_expires;

    // req.
    const cookiesList = req.cookies.getAll();
    const sessionCookie = process.env.NEXTAUTH_URL?.startsWith("https://")
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

    // no session token present, remove all next-auth cookies and redirect to sign-in
    if (!cookiesList.some((cookie) => cookie.name.includes(sessionCookie))) {
      const response = NextResponse.redirect(new URL("/sign-in", req.url));

      req.cookies.getAll().forEach((cookie) => {
        if (cookie.name.includes("next-auth"))
          response.cookies.delete(cookie.name);
      });

      return response;
    }


    const session = await getToken({
      req,
      salt: "",
      secret: ""
    })

    const newSessionToken = await encode({
      secret: process.env.AUTH_SECRET,
      token: {
        ...session,
        accessToken: res.data.access_token,
      },
      maxAge: 30 * 24 * 60 * 60, // 30 days, or get the previous token's exp
    })

    const resp = NextResponse.next()

    resp.cookies.set(sessionCookie, newSessionToken)

    return response;

  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
