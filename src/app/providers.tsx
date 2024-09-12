// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider as NextAuthProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { Session } from "next-auth";

export function Providers({
  session,
  children,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
      <NextAuthProvider>
        <NextUIProvider>{children}</NextUIProvider>
      </NextAuthProvider>
    </NextThemesProvider>
  );
}
