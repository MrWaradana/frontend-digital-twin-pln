import {
  LayoutGrid,
  LucideIcon,
  ThermometerSun,
  ChartCandlestick,
  DiamondPlus,
  Gauge,
} from "lucide-react";
import path from "path";

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
      groupLabel: "Risk Matrix App Navigation",
      menus: [
        {
          href: "/risk-matrix-app",
          label: "Risk Matrix Data",
          active: pathname === "/risk-matrix-app" ? true : false,
          icon: DiamondPlus,
          submenus: [],
        },
        {
          href: "/risk-matrix-app/bar-chart",
          label: "Risk Matrix Bar Chart",
          active: pathname === "/risk-matrix-app/bar-chart" ? true : false,
          icon: DiamondPlus,
          submenus: [],
        },
      ],
    },
  ];
}
