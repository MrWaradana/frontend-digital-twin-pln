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
import { SessionProvider as NextAuthProvider, signOut } from "next-auth/react";
import { MantineProvider } from "@mantine/core";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Modal, ModalBody } from "@nextui-org/react";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";

const timeout = 600_000; // 10 minutes in milliseconds
// const timeout = 80_000; // 10 minutes in milliseconds
const promptBeforeIdle = 120_000; // 3 minutes in milliseconds
// const promptBeforeIdle = 70_000; // 3 minutes in milliseconds

export function Providers({
  session,
  children,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const pathname = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [state, setState] = useState<string>("Active");
  const [remaining, setRemaining] = useState<number>(timeout);
  const [open, setOpen] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  const onIdle = () => {
    if (pathname != "/login") {
      setState("Idle");
      signOut();
    }
    // setOpen(false);
  };

  const onActive = () => {
    setState("Active");
    setOpen(false);
  };

  const onMessage = () => {
    setCount(count + 1);
  };

  const onPrompt = () => {
    if (pathname != "/login") {
      setState("Prompted");
      setOpen(true);
    }
  };

  const {
    getRemainingTime,
    activate,
    getTabId,
    isLeader,
    isLastActiveTab,
    message,
  } = useIdleTimer({
    onIdle,
    onActive,
    onPrompt,
    onMessage,
    timeout,
    crossTab: true,
    promptBeforeIdle,
    leaderElection: true,
    throttle: 500,
    syncTimers: 500,
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
    setOpen(false);
  };

  const tabId = getTabId() === null ? "loading" : getTabId().toString();
  const lastActiveTab =
    isLastActiveTab() === null ? "loading" : isLastActiveTab().toString();
  const leader = isLeader() === null ? "loading" : isLeader().toString();

  const timeTillIdle = Math.max(remaining, 0);
  const timeTillPrompt = Math.max(remaining - promptBeforeIdle / 1000, 0);

  const formatTime = (seconds: number) => {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} minute${
        minutes > 1 ? "s" : ""
      } ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;
    } else {
      return `${seconds} second${seconds !== 1 ? "s" : ""}`;
    }
  };

  // const seconds = timeTillPrompt > 1 ? "seconds" : "second";
  // const secondsIdle = timeTillIdle > 1 ? "seconds" : "second";

  return (
    <>
      <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
        <NextAuthProvider>
          <MantineProvider>
            <NextUIProvider>
              {/* <h1>React Idle Timer</h1>
            <h2>Confirm Prompt</h2>
            <br />
            <p>Current State: {state}</p>
            {timeTillPrompt > 0 && (
              <p>{formatTime(timeTillPrompt)} until prompt</p>
            )} */}
              <Modal
                isOpen={pathname === "login" ? false : open}
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
                        <p>
                          Are you still here? If not you will be logged out in{" "}
                          {formatTime(timeTillIdle)}
                        </p>
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
          </MantineProvider>
        </NextAuthProvider>
      </NextThemesProvider>
    </>
  );
}
