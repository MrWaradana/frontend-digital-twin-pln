"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Avatar,
  Button,
  Navbar as NavbarLinks,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import PlnLogo from "../../public/Logo_PLN.svg";
import PlnLogoNoText from "../../public/Logo_No_Text.png";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Sign Out",
  ];

  return (
    <>
      <Toaster />
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
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
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
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <NavbarLinks
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className="z-[999] backdrop-blur-xl bg-black/80"
      >
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

        <NavbarContent className="sm:hidden pr-3" justify="center">
          <NavbarBrand>
            <Image
              src={PlnLogoNoText}
              height={24}
              width={24}
              alt="pln logo"
              className="mx-4"
            />
            <p className="font-semibold text-[20px] hidden lg:inline">
              PLN Digital Twin
            </p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          className="hidden sm:flex gap-4 text-white"
          justify="center"
        >
          <NavbarBrand>
            <Image
              src={PlnLogoNoText}
              height={24}
              width={24}
              alt="pln logo"
              className="mx-4"
            />
            <p className="font-semibold text-[20px]">PLN Digital Twin</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          justify={"center"}
          className={`flex w-full justify-center`}
        >
          <ModeToggle />
        </NavbarContent>
        <NavbarContent justify={"end"} className={`flex justify-around`}>
          <NavbarItem>
            <Button
              variant="bordered"
              as={Link}
              href={session?.user.user.role === "Admin" ? "/admin/users" : "#"}
              className={`text-white rounded-full`}
            >
              {session?.user.user.name.length > 8
                ? `${session?.user.user.name.slice(0, 8)}...`
                : session?.user.user.name}
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              onPress={onOpen}
              color="default"
              className={`rounded-full`}
              variant="solid"
            >
              Sign Out
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu className="z-[9999] text-white">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full bg-white"
                color={
                  index === 2
                    ? "warning"
                    : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
                }
                href="#"
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </NavbarLinks>
    </>
  );
}
