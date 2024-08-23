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
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const linkItems = [
    {
      name: "All Apps",
      url: "/",
    },
    {
      name: "Admin",
      url: "/admin/users",
    },
  ];

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
    "Log Out",
  ];

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
      <NavbarLinks
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className="sticky top-0 z-[999]"
      >
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

        <NavbarContent className="sm:hidden pr-3" justify="center">
          <NavbarBrand>
            <Image
              src={PlnLogo}
              height={64}
              width={64}
              alt="pln logo"
              className="mx-4"
            />
            <p className="font-bold text-inherit hidden lg:inline">
              Digital Twin
            </p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarBrand>
            <Image
              src={PlnLogo}
              height={64}
              width={64}
              alt="pln logo"
              className="mx-4"
            />
            <p className="font-bold text-inherit">Digital Twin</p>
          </NavbarBrand>
          {linkItems.map((item, index) => (
            <NavbarItem key={`${item}-${index}`}>
              <Link color="foreground" href={item.url}>
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Avatar
              name={session?.user.user.name}
              color="primary"
              isBordered
              className="uppercase"
            />
          </NavbarItem>
          <NavbarItem>
            <Button onPress={onOpen} color="danger" variant="flat">
              Log Out
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu className="z-[999]">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full"
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
