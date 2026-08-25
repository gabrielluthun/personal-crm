/**
 * Detects whether the frontend is running inside a Tauri webview.
 * Use this guard before any window / localStorage / invoke call so that
 * `pnpm dev` in a regular browser does not crash.
 */
export function isTauri(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    "__TAURI_INTERNALS__" in window ||
    "__TAURI__" in window ||
    navigator.userAgent.includes("Tauri")
  );
}
