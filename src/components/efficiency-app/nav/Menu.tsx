"use client";

import { useState } from "react";
import Link from "next/link";
import { Ellipsis, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/efficiency-menu-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "@/components/admin/CollapseMenuButton";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ModeToggle } from "@/components/ModeToggle";
import toast from "react-hot-toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button as NextButton,
} from "@nextui-org/react";
import { signOut } from "next-auth/react";
import router from "next/router";

interface MenuProps {
  isListOpen: boolean | undefined;
}

export function Menu({ isListOpen }: MenuProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const menuList = getMenuList(pathname);

  return (
    <>
      {" "}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Sign Out Confirmation
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to Sign Out?</p>
              </ModalBody>
              <ModalFooter>
                <NextButton color="danger" variant="light" onPress={onClose}>
                  Cancel
                </NextButton>
                <NextButton
                  color="primary"
                  onPress={async () => {
                    try {
                      setIsLoading(true);
                      await signOut();
                      setIsLoading(false);
                      router.push("/login");
                    } catch (err) {
                      console.error("Unable to sign out!");
                    }
                  }}
                  isLoading={isLoading}
                >
                  Yes, Sign Out
                </NextButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* <ScrollArea className="[&>div>div[style]]:!block !bg-transparent"> */}
      <nav className="mt-8 h-full w-full overflow-hidden">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2 pb-12">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isListOpen && groupLabel) || isListOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isListOpen && isListOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, index) =>
                  submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? "secondary" : "ghost"}
                              className="w-full justify-start h-10 mb-1"
                              asChild
                            >
                              <Link href={href}>
                                <span
                                  className={cn(
                                    isListOpen === false ? "" : "mr-4"
                                  )}
                                >
                                  <Icon size={22} className="text-[#D4CA2F]" />
                                </span>
                                <p
                                  className={cn(
                                    "max-w-[200px] truncate",
                                    isListOpen === false
                                      ? "-translate-x-96 opacity-0"
                                      : "translate-x-0 opacity-100"
                                  )}
                                >
                                  {label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isListOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        isOpen={isListOpen}
                      />
                    </div>
                  )
              )}
            </li>
          ))}
          {/* <li className="w-full grow flex items-end">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onOpen}
                    variant="outline"
                    className="w-full justify-center h-10 mt-5"
                  >
                    <span className={cn(isListOpen === false ? "" : "mr-4")}>
                      <LogOut size={18} />
                    </span>
                    <p
                      className={cn(
                        "whitespace-nowrap",
                        isListOpen === false
                          ? "opacity-0 hidden"
                          : "opacity-100"
                      )}
                    >
                      Sign out
                    </p>
                  </Button>
                </TooltipTrigger>
                {isListOpen === false && (
                  <TooltipContent side="right">Sign out</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li> */}
          <li className="w-full grow flex items-end">
            <ModeToggle />
          </li>
        </ul>
      </nav>
      {/* </ScrollArea> */}
    </>
  );
}
