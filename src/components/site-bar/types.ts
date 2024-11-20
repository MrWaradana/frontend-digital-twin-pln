import { LucideIcon } from "lucide-react";

// Type definitions
export interface Submenu {
    href: string;
    label: string;
    active: boolean;
    icon?: LucideIcon;
}

export interface Menu {
    href: string;
    label: string;
    icon: LucideIcon;
    submenus: Submenu[];
    active: boolean; // Optional: to specify if path should match exactly
    
} 

export interface MenuGroup {
    groupLabel: string;
    menus: Menu[];
}

export interface MenuConfig {
    groups: {
        groupLabel: string;
        menus: {
            href: string;
            label: string;
            icon: LucideIcon;
            submenus: Submenu[];
            exactMatch?: boolean;
        }[];
    }[];
}
