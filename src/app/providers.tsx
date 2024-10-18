// app/providers.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import {
  Button,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NextUIProvider,
  useDisclosure,
} from "@nextui-org/react";
import { SessionProvider as NextAuthProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Modal, ModalBody } from "@nextui-org/react";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { Session } from "next-auth";

const timeout = 900_000;
const promptBeforeIdle = 60_000;

export function Providers({
  session,
  children,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [state, setState] = useState<string>("Active");
  const [remaining, setRemaining] = useState<number>(timeout);
  const [open, setOpen] = useState<boolean>(false);

  const onIdle = () => {
    setState("Idle");
    // setOpen(false);
  };

  const onActive = () => {
    setState("Active");
    setOpen(false);
  };

  const onPrompt = () => {
    setState("Prompted");
    setOpen(true);
  };

  const { getRemainingTime, activate } = useIdleTimer({
    onIdle,
    onActive,
    onPrompt,
    timeout,
    promptBeforeIdle,
    throttle: 500,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });

  const handleStillHere = () => {
    activate();
  };

  const timeTillPrompt = Math.max(remaining - promptBeforeIdle / 1000, 0);
  const seconds = timeTillPrompt > 1 ? "seconds" : "second";

  return (
    <>
      <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
        <NextAuthProvider>
          <NextUIProvider>
            {/* <h1>React Idle Timer</h1>
            <h2>Confirm Prompt</h2>
            <br />
            <p>Current State: {state}</p> */}
            {/* {timeTillPrompt > 0 && (
              <p>
                {timeTillPrompt} {seconds} until prompt
              </p>
            )} */}
            <Modal
              isOpen={open}
              hideCloseButton={true}
              isDismissable={false}
              isKeyboardDismissDisabled
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Idle Confirmation
                    </ModalHeader>
                    <ModalBody>
                      <p>Are you still here?</p>
                    </ModalBody>
                    <ModalFooter>
                      {/* <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button> */}
                      <Button color="primary" onPress={handleStillHere}>
                        Yes, I am still here
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
            {children}
          </NextUIProvider>
        </NextAuthProvider>
      </NextThemesProvider>
    </>
  );
}
