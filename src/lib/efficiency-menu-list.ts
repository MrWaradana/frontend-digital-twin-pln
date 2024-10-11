import {
  LayoutGrid,
  LucideIcon,
  ThermometerSun,
  ChartCandlestick,
  DiamondPlus,
  Gauge,
  CircleDollarSign,
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
      groupLabel: "Efficiency App Navigation",
      menus: [
        {
          href: "/efficiency-app",
          label: "All Efficiency Data",
          active: pathname === "/efficiency-app" ? true : false,
          icon: DiamondPlus,
          submenus: [],
        },
        // {
        //   href: "/efficiency-app/heat-loss-trending",
        //   label: "Heat Loss Trending",
        //   active:
        //     pathname === "/efficiency-app/heat-loss-trending" ? true : false,
        //   icon: ThermometerSun,
        //   submenus: [],
        // },
        {
          href: "/efficiency-app/nett-plant-heat-rate",
          label: "Nett Plant Heat Rate",
          active:
            pathname === "/efficiency-app/nett-plant-heat-rate" ? true : false,
          icon: ChartCandlestick,
          submenus: [],
        },
        // {
        //   href: "/efficiency-app/cost-benefit-analysis",
        //   label: "Cost Benefit Analysis",
        //   active:
        //     pathname === "/efficiency-app/cost-benefit-analysis" ? true : false,
        //   icon: CircleDollarSign,
        //   submenus: [],
        // },
        // {
        //   href: "/efficiency-app/performance-test",
        //   label: "Performance Test",
        //   active:
        //     pathname === "/efficiency-app/performance-test" ? true : false,
        //   icon: Gauge,
        //   submenus: [],
        // },
      ],
    },
  ];
}
