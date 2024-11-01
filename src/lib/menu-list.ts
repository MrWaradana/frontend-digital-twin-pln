import {
  Tag,
  Users,
  AppWindowMac,
  LayoutGrid,
  SearchCheck,
  LucideIcon,
  DiamondPlus,
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
      groupLabel: "User Management",
      menus: [
        {
          href: "/admin/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: [],
        },
        {
          href: "/admin/commision",
          label: "Commision Data",
          active: pathname.includes("/commision"),
          icon: DiamondPlus,
          submenus: [],
        },
        {
          href: "/admin/root-cause",
          label: "Root Cause Data",
          active: pathname.includes("/root-cause"),
          icon: SearchCheck,
          submenus: [],
        },
        // {
        //   href: "/admin/roles",
        //   label: "Roles",
        //   active: pathname.includes("/roles"),
        //   icon: Tag,
        //   submenus: [],
        // },
        // {
        //   href: "/admin/resources",
        //   label: "Resources",
        //   active: pathname.includes("/resources"),
        //   icon: AppWindowMac,
        //   submenus: [],
        // },
      ],
    },
  ];
}
