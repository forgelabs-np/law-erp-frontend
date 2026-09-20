import { ReactNode } from "react";

/** Chakra palettes used across dashboard surfaces. */
export type StatTone =
  | "primary"
  | "green"
  | "red"
  | "amber"
  | "purple"
  | "orange"
  | "teal"
  | "blue"
  | "gray";

/** A metric that is guaranteed to have a real numeric value. */
export interface StatTileModel {
  label: string;
  value: number;
  icon: ReactNode;
  tone: StatTone;
  hint?: string;
  /** Renders the metric as a link/button that the user can act on. */
  onClick?: () => void;
  /**
   * Real series used for the tile sparkline. Only pass values derived from an
   * API response — the tile renders nothing when this is omitted.
   */
  spark?: number[];
  /** Signed change derived from real trend data. Omitted when unknown. */
  delta?: number;
}

interface StatTileInput {
  label: string;
  value: number | undefined | null;
  icon: ReactNode;
  tone: StatTone;
  hint?: string;
  onClick?: () => void;
  spark?: number[];
  delta?: number;
}

/**
 * Drop metrics the backend did not return, so dashboards only render values
 * that actually exist in the response (never fabricated zeros).
 */
export const toStatTiles = (models: StatTileInput[]): StatTileModel[] =>
  models.filter(
    (model): model is StatTileModel =>
      typeof model.value === "number" && Number.isFinite(model.value)
  );

/**
 * A signed change derived from a real series. Returns `undefined` when there
 * are fewer than two finite points, so nothing is ever fabricated.
 */
export const seriesDelta = (
  series: number[] | undefined
): number | undefined => {
  if (!series || series.length < 2) return undefined;
  const first = series[0];
  const last = series[series.length - 1];
  if (!Number.isFinite(first) || !Number.isFinite(last)) return undefined;
  return last - first;
};

/** Trailing sparkline series from a trend field that is genuinely numeric. */
export const trendSeries = <T>(
  points: T[],
  pick: (point: T) => number | undefined,
  max = 12
): number[] | undefined => {
  const values = points
    .map(pick)
    .filter((value): value is number => typeof value === "number");
  if (values.length < 2) return undefined;
  return values.slice(-max);
};

// ─── Chart primitives ──────────────────────────────────────────────────────

export interface ChartSlice {
  label: string;
  value: number;
  /** CSS color for the slice — dashboards map semantics to the brand palette. */
  color: string;
}

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
}

/**
 * Brand-aligned palette shared by every dashboard chart.
 * Values are widened to `string` so chart data stays assignable to
 * `ChartSlice` regardless of which colour a dashboard picks.
 */
export interface ChartPalette {
  primary: string;
  green: string;
  amber: string;
  red: string;
  purple: string;
  teal: string;
  gray: string;
}

/** View modes available inside a panel; dashboards extend this with their own. */
export type PanelView = string;

export const CHART_COLORS: ChartPalette = {
  primary: "#0056FF",
  green: "#10b981",
  amber: "#f59e0b",
  red: "#ef4444",
  purple: "#8b5cf6",
  teal: "#14b8a6",
  gray: "#9ca3af",
};

/**
 * Raw hex per tone. Used for gradients and glows that cannot be expressed with
 * Chakra colour tokens (gradients need concrete colour stops).
 */
export const TONE_HEX: Record<StatTone, string> = {
  primary: "#0056FF",
  green: "#10b981",
  red: "#ef4444",
  amber: "#f59e0b",
  purple: "#8b5cf6",
  orange: "#f97316",
  teal: "#14b8a6",
  blue: "#3b82f6",
  gray: "#94a3b8",
};

/** `label` slug safe for use inside a DOM id (sparkline gradient ids). */
export const toDomId = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
