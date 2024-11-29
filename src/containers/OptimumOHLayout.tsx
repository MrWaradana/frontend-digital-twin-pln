// ? This is the template container layout for the content and sidebar layout for reuse purposes
// ? You can reuse this template layout and rename with your own app name, ex: [appname]Layout.tsx
// ? For the sidebar menu list and others, you can follow the efficiency-app Sidebar and see inside
// ? the nav folder for efficiency-app. You can change your own menu-list for the nav links

"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
// import { Footer } from "@/components/efficiency-app/nav-panel/footer";
import Sidebar from "@/components/optimum-oh-app/nav/Sidebar"; //? follow the efficiency layout, templates and components
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";

export default function TemplateLayout({
  children,
  className = "bg-gradient-to-b from-[#D9E9EE] to-[#FFFFFF] to-[45%]",
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
