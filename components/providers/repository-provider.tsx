"use client";

import * as React from "react";

import {
  getRepositories,
  type AppRepositories,
} from "@/lib/container";

const RepositoryContext = React.createContext<AppRepositories | null>(null);

type RepositoryProviderProps = {
  readonly children: React.ReactNode;
  /** Optional override for tests; defaults to the composition-root singleton. */
  readonly value?: AppRepositories;
};

export function RepositoryProvider({
  children,
  value,
}: RepositoryProviderProps) {
  const repositories = value ?? getRepositories();

  return (
    <RepositoryContext.Provider value={repositories}>
      {children}
    </RepositoryContext.Provider>
  );
}

/** For entity hooks only — components must not call repositories directly. */
export function useRepositories(): AppRepositories {
  const context = React.useContext(RepositoryContext);
  if (context === null) {
    throw new Error(
      "useRepositories must be used within a RepositoryProvider",
    );
  }
  return context;
}
