import {
  LayoutGrid,
  LucideIcon,
  Briefcase,
  LayoutDashboard
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
          label: "Dashboard",
          active: pathname === "/pfi-app" ? true : false,
          icon: LayoutDashboard,
          submenus: [],
        },
        {
          href: "/pfi-app/equipments",
          label: "Equipment Lists",
          active: pathname === "/pfi-app/equipments" ? true : false,
          icon: Briefcase,
          submenus: [],
        },
        {
          href: "/pfi-app/tags",
          label: "Tags Lists",
          active: pathname === "/pfi-app/tags" ? true : false,
          icon: Briefcase,
          submenus: [],
        },
      ],
    },
  ];
}
