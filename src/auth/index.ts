import NextAuth, { DefaultSession } from "next-auth";
import { authConfig } from "@/auth/config";
import { JWT } from "next-auth/jwt";
import { AUTH_API_URL } from "../lib/api-url";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { db } from "@/lib/db";
// import { getUserById, updateUserById } from "@/services/user";
// import { getTwoFactorConfirmationByUserId } from "@/services/two-factor-confirmation";
// import { isExpired } from "@/lib/utils";
// import { getAccountByUserId } from "@/services/account";

declare module "next-auth" {
  interface User {
    access_token: string;
    refresh_token: string;
    user: object;
    token_expires: number;
  }

  interface Session {
    user: {
      access_token: string;
      refresh_token: string;
      token_expires: number;
      user: any;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    user: object;
    access_token: string;
    refresh_token: string;
    token_expires: number;
  }
}

async function refreshAccessToken(token: any) {
  try {
    // const url =
    //     "https://oauth2.googleapis.com/token?" +
    //     new URLSearchParams({
    //         client_id: process.env.GOOGLE_CLIENT_ID,
    //         client_secret: process.env.GOOGLE_CLIENT_SECRET,
    //         grant_type: "refresh_token",
    //         refresh_token: token.refreshToken,
    //     })

    const response = await fetch(`${AUTH_API_URL}/refresh-token`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token.refreshToken}`,
      },
      method: "GET",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 Day
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      return {
        ...token,
        ...user,
      };
    },
    async session({ session, token }) {
      if (token) {
        // session.user.id = token.id
        session.user.access_token = token.access_token;
        session.user.refresh_token = token.refresh_token;
        session.user.user = token.user;
        session.user.token_expires = token.token_expires;
      }
      // Save to local storage
      // console.log(session.user, "=============================");
      // console.log(token, "token");
      // console.log(session, "session");
      return session;
    },
    // async signIn({ user, account }) {
    //   if (account?.provider !== "credentials") return true;

    //   const existingUser = await getUserById(user.id);
    //   // Prevent sign in without email verification
    //   if (!existingUser?.emailVerified) return false;

    //   // If user's 2FA checked
    // //   if (existingUser.isTwoFactorEnabled) {
    // //     const existingTwoFactorConfirmation = await getTwoFactorConfirmationByUserId(
    // //       existingUser.id
    // //     );
    // //     // If two factor confirmation doesn't exist, then prevent to login
    // //     if (!existingTwoFactorConfirmation) return false;
    // //     // If two factor confirmation is expired, then prevent to login
    // //     const hasExpired = isExpired(existingTwoFactorConfirmation.expires);
    // //     if (hasExpired) return false;
    // //   }

    //   return true;
    // },
  },
  ...authConfig,
});
