"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
// import { Footer } from "@/components/admin-panel/footer";
import Sidebar from "@/components/admin/Sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)]  dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          // sidebar?.isOpen === false ? 'lg:ml-[90px]' : 'lg:ml-72'
          "lg:ml-72",
          "bg-gradient-to-b from-[#D9E9EE] to-[#FFFFFF] to-[45%]"
        )}
      >
        {children}
      </main>
    </>
  );
}
