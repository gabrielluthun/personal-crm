"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/navigation/nav-items";

type SidebarNavLinkProps = {
  readonly item: NavItem;
  /** When true, always show the label (e.g. mobile drawer). */
  readonly forceExpanded?: boolean;
  /** Called when the link is activated, so a drawer can close itself. */
  readonly onNavigate?: () => void;
};

function normalizePath(path: string): string {
  if (path === "/") {
    return "/";
  }
  return path.endsWith("/") ? path : `${path}/`;
}

export function SidebarNavLink({
  item,
  forceExpanded = false,
  onNavigate,
}: SidebarNavLinkProps) {
  const pathname = usePathname();
  const current = normalizePath(pathname);
  const target = normalizePath(item.href);
  const isActive = current === target;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
      title={forceExpanded ? undefined : item.label}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-medium transition-colors",
        // Explicit clamp+vw so sidebar type scales with the window (max 16px).
        "text-[length:clamp(0.875rem,0.75rem+0.4vw,1rem)]",
        "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        !forceExpanded && "justify-center lg:justify-start",
        isActive &&
          "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm",
      )}
    >
      <Icon className="size-[1.1em] shrink-0" aria-hidden="true" />
      <span className={cn(forceExpanded ? "inline" : "hidden lg:inline")}>
        {item.label}
      </span>
    </Link>
  );
}
