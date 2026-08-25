"use client";

import type { ReactNode } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";

type AppShellProps = {
  readonly children: ReactNode;
};

/**
 * Persistent desktop chrome bounded to the viewport.
 * Adapts across breakpoints:
 * - mobile: top bar + sheet nav
 * - tablet: icon rail
 * - desktop: full sidebar
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-dvh max-h-dvh overflow-hidden bg-background md:grid md:grid-cols-[auto_minmax(0,1fr)]">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <MobileNav />
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
