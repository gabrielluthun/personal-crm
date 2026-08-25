import type { LucideIcon } from "lucide-react";
import {
  Building2Icon,
  FileTextIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

export type NavItem = {
  readonly href: string;
  readonly label: string;
  readonly icon: LucideIcon;
};

/**
 * Single source of truth for the left sidebar navigation.
 * Paths keep a trailing slash to match `trailingSlash: true` in next.config.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/entreprise/", label: "Entreprise", icon: Building2Icon },
  { href: "/contact/", label: "Contact", icon: UsersIcon },
  { href: "/templates/", label: "Templates", icon: FileTextIcon },
  { href: "/settings/", label: "Settings", icon: SettingsIcon },
] as const;
