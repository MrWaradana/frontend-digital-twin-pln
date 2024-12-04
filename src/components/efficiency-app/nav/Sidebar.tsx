import Link from "next/link";
import Image from "next/image";
import { PanelsTopLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/efficiency-app/nav/Menu";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { SidebarToggle } from "@/components/efficiency-app/nav/SidebarToggle";

import PlnLogo from "../../../../public/Logo_PLN.svg";
import PlnLogoVertical from "../../../../public/Logo_PLN.png";
import PlnLogoBlack from "../../../../public/Logo_Black.png";

export default function Sidebar({ className }: { className?: string }) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        "w-[90px]",
        `${className}`
      )}
    >
      {/* <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} /> */}
      <div className="relative h-full flex flex-col px-3 py-4 mt-6 overflow-y-auto bg-transparent">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            "translate-x-1"
          )}
          variant="link"
          asChild
        >
          <Link href="#" className="flex items-center gap-2 !p-0 !m-0">
            <Image
              src={PlnLogoVertical}
              alt="Logo PLN"
              width={90}
              height={90}
            />
          </Link>
        </Button>
        {/* <Menu isListOpen={sidebar?.isOpen} /> */}
        <Menu isListOpen={false} />
      </div>
    </aside>
  );
}
