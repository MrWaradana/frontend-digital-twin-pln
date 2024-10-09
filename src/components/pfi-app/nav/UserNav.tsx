"use client";

import Link from "next/link";
import { LayoutGrid, LogOut, User } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button as NextButton,
} from "@nextui-org/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import router from "next/router";

export function UserNav() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const session = useSession();

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Log Out Confirmation
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to Log Out?</p>
              </ModalBody>
              <ModalFooter>
                <NextButton color="danger" variant="light" onPress={onClose}>
                  Cancel
                </NextButton>
                <NextButton
                  color="primary"
                  onPress={async () => {
                    try {
                      await signOut();
                      router.push("/login");
                    } catch (err) {
                      console.error("Unable to sign out!");
                    }
                  }}
                >
                  Yes, Log Out
                </NextButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <DropdownMenu>
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="relative bg-transparent border-none p-0 rounded-full"
                >
                  <Avatar
                    name={session.data?.user.user.name}
                    color="primary"
                    isBordered
                    className="uppercase"
                  />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Profile</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.data?.user.user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.data?.user.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="hover:cursor-pointer" asChild>
              <Link href="/" className="flex items-center">
                <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
                All Apps
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:cursor-pointer" onClick={onOpen}>
            <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
