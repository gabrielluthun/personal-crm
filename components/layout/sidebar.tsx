"use client";

import { NAV_ITEMS } from "@/lib/navigation/nav-items";
import { SidebarNavLink } from "@/components/layout/sidebar-nav-link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Separator } from "@/components/ui/separator";

export function Sidebar() {
  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <nav
        className="flex flex-1 flex-col gap-0.5 p-2"
        aria-label="Navigation principale"
      >
        {NAV_ITEMS.map((item) => (
          <SidebarNavLink key={item.href} item={item} />
        ))}
      </nav>

      <Separator />

      <div className="flex items-center justify-between gap-2 p-3">
        <span className="text-xs text-muted-foreground">Thème</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
