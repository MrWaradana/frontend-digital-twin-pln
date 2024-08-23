// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider as NextAuthProvider } from "next-auth/react";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </NextAuthProvider>
  );
}
