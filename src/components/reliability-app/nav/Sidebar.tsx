import Image from "next/image";
import Link from "next/link";

import { Menu } from "@/components/reliability-app/nav/Menu";
import { Button } from "@/components/ui/button";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

import PlnLogoBlack from "../../../../public/Logo_Black.png";

export default function Sidebar({ className }: { className?: string }) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72",
        `${className}`
      )}
    >
      {/* <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} /> */}
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto bg-transparent">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1 p-3",
            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link href="#" className="flex items-center gap-2">
            <Image src={PlnLogoBlack} alt="Logo PLN" />
          </Link>
        </Button>
        <Menu isListOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}
