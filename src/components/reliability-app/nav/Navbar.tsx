import { SheetMenu } from "@/components/pfi-app/nav/SheetMenu";
import { UserNav } from "@/components/pfi-app/nav/UserNav";
import { useRouter } from "next/navigation";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { signOut } from "@/auth";

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
                  className={`bg-[#F49C38] text-white`}
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
      <header className="sticky top-0 z-10 w-full bg-transparent">
        <div className="mx-4 sm:mx-8 flex items-center h-[16dvh]">
          <div className="flex items-center space-x-4 lg:space-x-0">
            <SheetMenu />
            <h1 className="font-semibold text-sm md:text-4xl sm:text-xl">
              {title}
            </h1>
          </div>
          <div className="flex flex-1 items-center space-x-2 justify-end">
            <UserNav />
            <Button
              variant={`bordered`}
              radius="full"
              className="border-[#F49C38] "
            >
              Apps Library
            </Button>
            <Button
              variant={`solid`}
              radius="full"
              className="bg-[#F49C38] text-white"
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
