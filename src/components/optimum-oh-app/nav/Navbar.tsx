"use client";

import { UserNav } from "@/components/efficiency-app/nav/UserNav";
import { SheetMenu } from "@/components/efficiency-app/nav/SheetMenu";
import {
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={true}>
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
                <Button variant="light" onPress={onClose} radius="full">
                  Cancel
                </Button>
                <Button
                  radius="full"
                  className={`bg-[#1C9EB6] text-white`}
                  onPress={async () => {
                    try {
                      await signOut();
                      router.push("/login");
                    } catch (err) {
                      console.error("Unable to sign out!");
                    }
                  }}
                >
                  Yes, Sign Out
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <header className="z-10 w-full ">
        <div className="mx-4 sm:mx-8 flex items-center h-[12dvh]">
          <div className="flex items-center space-x-4 lg:space-x-0">
            <SheetMenu />
            <h1 className="font-semibold text-3xl text-[#0099AD]">{title}</h1>
          </div>
          <div className="flex flex-1 items-center space-x-2 justify-end">
            <UserNav />
            {/* <Button
              variant={`bordered`}
              radius="full"
              className="border-[#D4CA2F] "
            >
              Apps Library
            </Button> */}
            <Button
              variant={`solid`}
              radius="full"
              className="bg-[#1C9EB6] text-white"
              onClick={onOpen}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
