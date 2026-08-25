import { isTauri } from "@/lib/tauri/is-tauri";

/**
 * Opens an external URL in the system browser.
 * Inside Tauri: plugin-opener (never navigates the webview).
 * In a regular browser: window.open with noopener.
 */
export async function openExternal(url: string): Promise<void> {
  const trimmed = url.trim();
  if (trimmed.length === 0) {
    return;
  }

  if (isTauri()) {
    const { openUrl } = await import("@tauri-apps/plugin-opener");
    await openUrl(trimmed);
    return;
  }

  window.open(trimmed, "_blank", "noopener,noreferrer");
}
