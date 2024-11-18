"use client";

import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/pfi-app/nav/Sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";

export default function EfficiencyLayout({
  children,
  className = "bg-gradient-to-b from-[#FFD9D3] to-[#FFFFFF] to-[45%]",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <Sidebar className={className} />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)]  dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
          `${className}`
        )}
      >
        {children}
      </main>
    </>
  );
}
