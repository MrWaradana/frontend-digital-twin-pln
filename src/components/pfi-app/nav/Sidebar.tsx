import Image from "next/image";
import Link from "next/link";

import { Menu } from "@/components/pfi-app/nav/Menu";
import { SidebarToggle } from "@/components/pfi-app/nav/SidebarToggle";
import { Button } from "@/components/ui/button";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

import PlnLogo from "../../../../public/Logo_PLN.svg";

export default function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300 bg-gradient-to-b from-[#FFD9D3] to-white",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72"
      )}
    >
      <Menu isListOpen={sidebar?.isOpen} />
    </aside>
  );
}
