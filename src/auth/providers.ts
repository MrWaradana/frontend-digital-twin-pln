import { loginSchema } from "@/schemas";
import Credentials from "next-auth/providers/credentials";
import { AUTH_API_URL } from "../lib/api-url";
import toast from "react-hot-toast";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */

export const CredentialsProvider = Credentials({
  async authorize(credentials) {
    const validatedFields = loginSchema.safeParse(credentials);

    if (validatedFields.success) {
      const { username, password } = validatedFields.data;

      const res = await fetch(`${AUTH_API_URL}/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error(
          JSON.stringify({ status: res.status, message: res.statusText })
        );
      }

      const data = await res.json();
      // eslint-disable-next-line no-console
      return {
        access_token: data.data.access_token,
        refresh_token: data.data.refresh_token,
        token_expires: data.data.token_expires,
        user: data.data.user,
      };
    }

    return null;
  },
});

// export const GithubProvider = Github({
//   clientId: process.env.GITHUB_ID as string,
//   clientSecret: process.env.GITHUB_SECRET as string,
// });

// export const GoogleProvider = Google({
//   clientId: process.env.GOOGLE_ID as string,
//   clientSecret: process.env.GOOGLE_SECRET as string,
//   authorization: {
//     params: {
//       prompt: "consent",
//       access_type: "offline",
//       response_type: "code",
//     },
//   },
// });
