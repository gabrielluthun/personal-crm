/**
 * Result of a Bright Data credential probe (no secrets included).
 */
export type BrightDataProbeResult = {
  readonly ok: true;
  readonly zoneCount: number | null;
};
