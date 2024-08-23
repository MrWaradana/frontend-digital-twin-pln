import NextAuth, { DefaultSession } from "next-auth";
import { authConfig } from "@/auth/config";
import { JWT } from "next-auth/jwt";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { db } from "@/lib/db";
// import { getUserById, updateUserById } from "@/services/user";
// import { getTwoFactorConfirmationByUserId } from "@/services/two-factor-confirmation";
// import { isExpired } from "@/lib/utils";
// import { getAccountByUserId } from "@/services/account";

declare module "next-auth" {
  interface User {
    accessToken: string;
    refreshToken: string;
    user: object;
  }

  interface Session {
    user: {
      accessToken: string;
      refreshToken: string;
      user: any;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    user: object;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}

// async function refreshAccessToken(token) {
//     try {
//         // const url =
//         //     "https://oauth2.googleapis.com/token?" +
//         //     new URLSearchParams({
//         //         client_id: process.env.GOOGLE_CLIENT_ID,
//         //         client_secret: process.env.GOOGLE_CLIENT_SECRET,
//         //         grant_type: "refresh_token",
//         //         refresh_token: token.refreshToken,
//         //     })

//         const response = await fetch(url, {
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded",
//             },
//             method: "POST",
//         })

//         const refreshedTokens = await response.json()

//         if (!response.ok) {
//             throw refreshedTokens
//         }

//         return {
//             ...token,
//             accessToken: refreshedTokens.access_token,
//             accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
//             refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
//         }
//     } catch (error) {
//         console.log(error)

//         return {
//             ...token,
//             error: "RefreshAccessTokenError",
//         }
//     }
//}

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
    async jwt({ token, user }) {
      if (user) {
        token.user = user.user;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 5 * 1000;

        // return token;
      }

      // Return previous token if the access token has not expired yet
      //   if (Date.now() < token.accessTokenExpires) {
      //     return token;
      //   }
      //   console.log(token, "TOKENNNNNNNNNNNNNNNNNN");
      // Access token has expired, try to update it
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // session.user.id = token.id
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.user = token.user;
      }
      // Save to local storage
      // console.log(session.user, "=============================");
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
