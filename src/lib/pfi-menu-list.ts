import {
  LayoutGrid,
  LucideIcon,
  Briefcase
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: "All Apps",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "PFI App Navigation",
      menus: [
        {
          href: "/pfi-app",
          label: "Equipment Lists",
          active: pathname === "/pfi-app" ? true : false,
          icon: Briefcase,
          submenus: [],
        },
      ],
    },
  ];
}
