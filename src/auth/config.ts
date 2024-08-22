import { CredentialsProvider } from "@/auth/providers";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [CredentialsProvider],
} satisfies NextAuthConfig;