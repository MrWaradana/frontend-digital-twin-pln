"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
// import { Footer } from "@/components/efficiency-app/nav-panel/footer";
import Sidebar from "@/components/efficiency-app/nav/Sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";



export default function LCCALayout({
  children,
  className = "bg-gradient-to-b from-[#FFFAB4] to-[#FFFFFF] to-[45%]",
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
