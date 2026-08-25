import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
// Tauri sets TAURI_DEV_HOST when running `tauri dev`. Plain `pnpm dev` in a
// browser must not use an absolute assetPrefix — Turbopack HMR then fails to
// find CSS <link> elements ("No link element found for chunk …").
const tauriDevHost = process.env.TAURI_DEV_HOST;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  assetPrefix:
    !isProd && tauriDevHost
      ? `http://${tauriDevHost}:3000`
      : undefined,
  reactStrictMode: true,
};

export default nextConfig;
