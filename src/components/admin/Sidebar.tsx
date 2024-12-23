import Link from "next/link";
import Image from "next/image";
import { PanelsTopLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/admin/Menu";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { SidebarToggle } from "@/components/admin/SidebarToggle";

import PlnLogo from "../../../public/Logo_PLN.svg";
import PlnLogoVertical from "../../../public/Logo_PLN.png";

export default function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        // sidebar?.isOpen === false ? "w-[90px]" : "w-72"
        "w-72",
        "bg-gradient-to-b from-[#D9E9EE] to-[#FFFFFF] to-[45%]"
      )}
    >
      {/* <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} /> */}
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1 p-0",
            // sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
            "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={PlnLogoVertical}
              alt="Logo PLN"
              width={48}
              height={48}
            />
          </Link>
        </Button>
        <Menu isListOpen={true} />
      </div>
    </aside>
  );
}
