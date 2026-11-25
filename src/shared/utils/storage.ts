/** 1 GB expressed in bytes, as used by the plan/storage contracts. */
export const BYTES_PER_GB = 1073741824;

/** Converts a byte count to whole/fractional GB (2 decimal places max). */
export const bytesToGb = (bytes: number): number => {
  return Math.round((bytes / BYTES_PER_GB) * 100) / 100;
};

/** Converts a GB value (as entered by a Super Admin) into bytes. */
export const gbToBytes = (gb: number): number => {
  return Math.round(gb * BYTES_PER_GB);
};

/**
 * Human-readable storage label for a byte quota.
 * Returns `null` when the quota is unlimited (`null`/`undefined`) so callers
 * decide the wording — never render `0` for unlimited storage.
 */
export const formatStorageBytes = (
  bytes: number | null | undefined
): string | null => {
  if (bytes === null || bytes === undefined) return null;
  const gb = bytesToGb(bytes);
  return `${Number.isInteger(gb) ? gb : gb.toFixed(2)} GB`;
};
