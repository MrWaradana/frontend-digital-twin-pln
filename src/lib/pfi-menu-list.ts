
import { StaticImageData } from "next/image";

import Book from "../../public/i-PFI/book.png";
import Dashboard from "../../public/i-PFI/dashboard.png";

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: StaticImageData;
  submenus: Submenu[];
};


type Submenu = {
  href: string;
  label: string;
  active: boolean;
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
          icon: Dashboard,
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
          icon: Dashboard,
          submenus: [],
        },
        {
          href: "/pfi-app/equipments",
          label: "Equipment Lists",
          active: pathname === "/pfi-app/equipments" ? true : false,
          icon: Book,
          submenus: [],
        },
        {
          href: "/pfi-app/tags",
          label: "Tags Lists",
          active: pathname === "/pfi-app/tags" ? true : false,
          icon: Dashboard,
          submenus: [],
        },
      ],
    },
  ];
}
