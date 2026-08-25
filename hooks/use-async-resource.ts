"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

import type { DomainError } from "@/lib/domain/shared/errors";
import type { Result } from "@/lib/domain/shared/result";

export type AsyncResourceStatus = "idle" | "loading" | "success" | "error";

export type AsyncResource<T> = {
  readonly data: T | null;
  readonly error: DomainError | null;
  readonly status: AsyncResourceStatus;
  readonly isLoading: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
  readonly reload: () => void;
};

type Settled<T> = {
  readonly generation: number;
  readonly data: T | null;
  readonly error: DomainError | null;
};

/**
 * Loads a Result-returning async resource.
 * Stale responses are ignored when deps change or the component unmounts.
 * Pass `deps` for anything that should trigger a refetch (search, page, …).
 */
export function useAsyncResource<T>(
  loader: () => Promise<Result<T, DomainError>>,
  deps: readonly unknown[] = [],
): AsyncResource<T> {
  const [reloadToken, setReloadToken] = useState(0);
  const [generation, setGeneration] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);
  const generationRef = useRef(0);
  const runLoader = useEffectEvent(loader);

  useEffect(() => {
    let cancelled = false;
    generationRef.current += 1;
    const current = generationRef.current;

    void (async () => {
      // Yield so loading state is not set synchronously inside the effect
      // (react-hooks/set-state-in-effect).
      await Promise.resolve();
      if (cancelled) {
        return;
      }
      setGeneration(current);

      const result = await runLoader();
      if (cancelled) {
        return;
      }

      if (result.ok) {
        setSettled({ generation: current, data: result.value, error: null });
        return;
      }

      setSettled((previous) => ({
        generation: current,
        data: previous?.data ?? null,
        error: result.error,
      }));
    })();

    return () => {
      cancelled = true;
    };
    // Caller-owned deps: refetch when any of them change, plus manual reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [reloadToken, ...deps]);

  const isLoading = settled === null || settled.generation !== generation;
  const matches = settled !== null && settled.generation === generation;
  const error = matches ? settled.error : null;

  let status: AsyncResourceStatus = "idle";
  if (isLoading) {
    status = "loading";
  } else if (error !== null) {
    status = "error";
  } else if (settled !== null) {
    status = "success";
  }

  return {
    data: settled?.data ?? null,
    error,
    status,
    isLoading,
    isSuccess: status === "success",
    isError: status === "error",
    reload: () => {
      setReloadToken((token) => token + 1);
    },
  };
}
