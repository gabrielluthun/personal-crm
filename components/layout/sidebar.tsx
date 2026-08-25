"use client";

import { NAV_ITEMS } from "@/lib/navigation/nav-items";
import { SidebarNavLink } from "@/components/layout/sidebar-nav-link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Separator } from "@/components/ui/separator";

/**
 * Desktop / tablet rail.
 * - md–lg: icon-only compact rail
 * - lg+: full labels
 * - below md: hidden (mobile uses MobileNav)
 */
export function Sidebar() {
  return (
    <aside
      className="hidden h-full w-16 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex lg:w-[clamp(15rem,13rem+2.5vw,17.5rem)]"
      aria-label="Barre latérale"
    >
      <nav
        className="flex flex-1 flex-col gap-1 p-2.5"
        aria-label="Navigation principale"
      >
        {NAV_ITEMS.map((item) => (
          <SidebarNavLink key={item.href} item={item} />
        ))}
      </nav>

      <Separator />

      <div className="flex items-center justify-center gap-2 p-2.5 lg:justify-between lg:px-3.5 lg:py-3.5">
        <span className="hidden text-[length:clamp(0.8rem,0.55rem+0.7vw,1rem)] text-muted-foreground lg:inline">
          Thème
        </span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
