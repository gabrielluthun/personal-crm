"use client";

import { useState } from "react";

export type HeaderSelectionState = "none" | "some" | "all";

export type RowSelection<TId extends string> = {
  readonly selectedIds: ReadonlySet<TId>;
  readonly selectedCount: number;
  readonly isSelected: (id: TId) => boolean;
  readonly toggle: (id: TId) => void;
  readonly setSelected: (id: TId, selected: boolean) => void;
  readonly clear: () => void;
  readonly selectAll: (ids: readonly TId[]) => void;
  readonly toggleAll: (ids: readonly TId[]) => void;
  readonly headerState: (ids: readonly TId[]) => HeaderSelectionState;
};

/**
 * Multi-row selection for data tables.
 * Header checkbox: none / some (indeterminate) / all for the visible id set.
 */
export function useRowSelection<TId extends string>(): RowSelection<TId> {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<TId>>(
    () => new Set(),
  );

  function isSelected(id: TId): boolean {
    return selectedIds.has(id);
  }

  function setSelected(id: TId, selected: boolean): void {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  function toggle(id: TId): void {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function clear(): void {
    setSelectedIds(new Set());
  }

  function selectAll(ids: readonly TId[]): void {
    setSelectedIds(new Set(ids));
  }

  function headerState(ids: readonly TId[]): HeaderSelectionState {
    if (ids.length === 0) {
      return "none";
    }
    let selectedVisible = 0;
    for (const id of ids) {
      if (selectedIds.has(id)) {
        selectedVisible += 1;
      }
    }
    if (selectedVisible === 0) {
      return "none";
    }
    if (selectedVisible === ids.length) {
      return "all";
    }
    return "some";
  }

  function toggleAll(ids: readonly TId[]): void {
    setSelectedIds((prev) => {
      const allSelected =
        ids.length > 0 && ids.every((id) => prev.has(id));
      const next = new Set(prev);
      for (const id of ids) {
        if (allSelected) {
          next.delete(id);
        } else {
          next.add(id);
        }
      }
      return next;
    });
  }

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    isSelected,
    toggle,
    setSelected,
    clear,
    selectAll,
    toggleAll,
    headerState,
  };
}
