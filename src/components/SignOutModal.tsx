"use client";
import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOutModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      // localStorage.setItem("user", JSON.stringify(session.user));
      console.log("User saved to cookie", session.user);
    }
  }, [session]);

  return (
    <>
      <Button onPress={onOpen}>Open Modal</Button>
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
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={async () => {
                    try {
                      await signOut();
                      router.push("/login");
                    } catch (err) {
                      alert({
                        title: "Unable to sign out",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Yes, Log Out
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
