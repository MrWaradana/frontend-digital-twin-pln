import { auth } from "@/auth";
import { AUTH_API_URL } from "./lib/api-url";

export default auth(async (req) => {
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
    req.auth.user.accessToken = res.data.data.access_token;
    req.auth.user.token_expires = res.data.data.token_expires;

    // Redirect back to the current page with a notification query parameter
    const newUrl = new URL(req.nextUrl.pathname, req.nextUrl.origin);
    newUrl.searchParams.set("notification", "Token refreshed");

    return Response.redirect(newUrl);
  }
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
