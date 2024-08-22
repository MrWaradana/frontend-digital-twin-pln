// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider as NextAuthProvider } from "next-auth/react";
import { Session } from "next-auth";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <NextAuthProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </NextAuthProvider>
  );
}
