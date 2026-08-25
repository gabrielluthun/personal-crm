"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

import { NAV_ITEMS } from "@/lib/navigation/nav-items";
import { SidebarNavLink } from "@/components/layout/sidebar-nav-link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Mobile-only navigation: hamburger + left sheet.
 * Visible below the `md` breakpoint.
 */
export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Ouvrir le menu de navigation"
            />
          }
        >
          <MenuIcon className="size-5" aria-hidden="true" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 sm:max-w-72">
          <SheetHeader className="border-b border-border px-4 py-3.5">
            <SheetTitle className="text-base">Navigation</SheetTitle>
          </SheetHeader>
          <nav
            className="flex flex-col gap-1 p-2.5"
            aria-label="Navigation principale"
          >
            {NAV_ITEMS.map((item) => (
              <SidebarNavLink key={item.href} item={item} forceExpanded />
            ))}
          </nav>
          <Separator />
          <div className="flex items-center justify-between gap-2 p-3.5">
            <span className="text-fluid-meta text-muted-foreground">Thème</span>
            <ThemeToggle />
          </div>
        </SheetContent>
      </Sheet>
      <span className="truncate text-fluid-nav font-medium text-foreground">
        Personal CRM
      </span>
    </div>
  );
}
