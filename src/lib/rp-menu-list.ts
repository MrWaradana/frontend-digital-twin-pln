import {
  LayoutGrid,
  LucideIcon,
  Briefcase,
  LayoutDashboard,
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
      groupLabel: "Reliability App Navigation",
      menus: [
        {
          href: "/reliability-app",
          label: "Dashboard",
          active: pathname === "/reliability-app" ? true : false,
          icon: LayoutDashboard,
          submenus: [],
        },
      ],
    },
  ];
}
