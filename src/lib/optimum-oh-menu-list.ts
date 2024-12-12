import {
  LayoutGrid,
  LucideIcon,
  CalendarClock,
  LayoutDashboard,
  Target,
  Calculator,
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
      groupLabel: "Optimum OH App Navigation",
      menus: [
        {
          href: "/optimum-oh-app",
          label: "Dashboard",
          active: pathname === "/optimum-oh-app" ? true : false,
          icon: LayoutDashboard,
          submenus: [],
        },
        // {
        //   href: "/optimum-oh-app/chart",
        //   label: "Optimum Overhaul Chart",
        //   active: pathname === "/optimum-oh-app/chart" ? true : false,
        //   icon: CalendarClock,
        //   submenus: [],
        // },
        {
          href: "/optimum-oh-app/target-reliability",
          label: "Target Reliability",
          active:
            pathname === "/optimum-oh-app/target-reliability" ? true : false,
          icon: Target,
          submenus: [],
        },
        {
          href: "/optimum-oh-app/budget-constraint",
          label: "Budget Constraint",
          active:
            pathname === "/optimum-oh-app/budget-constraint" ? true : false,
          icon: Calculator,
          submenus: [],
        },
      ],
    },
  ];
}
