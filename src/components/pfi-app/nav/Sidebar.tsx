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
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link href="#" className="flex items-center gap-2">
            <Image src={PlnLogo} alt="Logo PLN" width={64} height={64} />
          </Link>
        </Button>
        <Menu isListOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}