"use client";

import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar";

type AppShellProps = {
  readonly children: ReactNode;
};

/**
 * Persistent desktop chrome: left sidebar + scrollable main pane.
 * Bounded to the viewport height (`h-screen overflow-hidden`).
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="grid h-screen grid-cols-[auto_1fr] overflow-hidden bg-background">
      <Sidebar />
      <main className="min-h-0 overflow-y-auto">{children}</main>
    </div>
  );
}
