import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PLNLogo from "../../../../public/Logo_PLN.svg";

import { Menu } from "@/components/pfi-app/nav/Menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link href="#" className="flex items-center gap-2">
              <Link href="#" className="flex items-center gap-2">
                <Image src={PLNLogo} alt={`pln-logo`} width={84} />
              </Link>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isListOpen />
      </SheetContent>
    </Sheet>
  );
}
