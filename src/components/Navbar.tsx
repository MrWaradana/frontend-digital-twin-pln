"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Avatar,
  Button as NextButton,
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
import { Button } from "@/components/ui/button";
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
import { LayoutGrid, LockIcon, LogOut, User } from "lucide-react";

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
      <NavbarLinks
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        classNames={{
          base: ["w-full"],
          wrapper: ["w-full"],
        }}
        position={`sticky`}
        maxWidth={`full`}
        isBlurred={false}
        isBordered={false}
        className="z-[999] bg-transparent flex flex-row !w-full justify-center px-4 fixed top-2"
      >
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

        <NavbarContent className="sm:hidden pr-3 w-full" justify="center">
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

        {/* <NavbarContent
          justify={"center"}
          className={`flex w-full justify-center`}
        >
          <ModeToggle />
        </NavbarContent> */}
        <NavbarContent justify={"end"} className={`flex justify-around`}>
          <NavbarItem>
            {/* <Button
              variant="bordered"
              as={Link}
              href={session?.user.user.role === "Admin" ? "/admin/users" : "#"}
              className={`text-white rounded-full`}
            >
              {!session
                ? "..."
                : session?.user.user.name.length > 8
                ? `${session?.user.user.name.slice(0, 8)}...`
                : session?.user.user.name}
            </Button> */}
            <DropdownMenu>
              <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="relative bg-transparent border-[#1C9EB6] rounded-full text-white"
                      >
                        {/* <Avatar
                    name={session?.user.user.name}
                    isBordered
                    className="uppercase"
                  /> */}
                        {session?.user.user.name}
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
                      {session?.user.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session?.user.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="hover:cursor-pointer" asChild>
                    <Link href="/" className="flex items-center text-black">
                      <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
                      All Apps
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`hover:cursor-pointer ${
                      session?.user.user.role === "Admin" ? "" : "hidden"
                    }`}
                    asChild
                  >
                    <Link
                      href="/admin/users"
                      className="flex items-center text-black"
                    >
                      <LockIcon className="w-4 h-4 mr-3 text-muted-foreground" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem className="hover:cursor-pointer" asChild>
              <Link href="/account" className="flex items-center">
                <User className="w-4 h-4 mr-3 text-muted-foreground" />
                Account
              </Link>
            </DropdownMenuItem> */}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="hover:cursor-pointer"
                  onClick={onOpen}
                >
                  <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavbarItem>
          <NavbarItem>
            <NextButton
              onPress={onOpen}
              color="default"
              className={`rounded-full`}
              variant="solid"
            >
              Sign Out
            </NextButton>
          </NavbarItem>
        </NavbarContent>

        {/* <NavbarMenu className="z-[9999] text-white">
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
        </NavbarMenu> */}
      </NavbarLinks>
    </>
  );
}
