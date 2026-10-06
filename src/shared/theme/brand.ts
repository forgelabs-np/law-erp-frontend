import { THEME_COLORS } from "./tokens";

// ============================================================
// Firm brand colors
//
// The `/me` API returns `brandColorPrimary` / `brandColorSecondary` per law
// firm. This module validates those values and derives the full token scales
// (primary 50-900, secondary, lavender accents, select states) that the rest
// of the theme consumes — so every component already using `primary.*` /
// `secondary.*` / `lavender.*` tokens re-brands with zero component changes.
//
// Defaults are NEVER touched: when a value is missing/invalid we fall back to
// the existing THEME_COLORS entries, byte for byte.
// ============================================================

export interface BrandColorInput {
  primary?: string | null;
  secondary?: string | null;
}

export interface BrandSelectColors {
  selected: string;
  hover: string;
  focus: string;
}

type ColorToken = { value: string };

type PrimaryScale = Record<
  "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900",
  ColorToken
>;
type SecondaryScale = Record<
  "50" | "100" | "200" | "300" | "400" | "500",
  ColorToken
>;
type LavenderScale = Record<"50" | "100" | "200", ColorToken>;

// ------------------------------------------------------------
// Validation — only hex colors (#RGB or #RRGGBB) from the API are accepted.
// Anything else (null, "", "redish", rgb(...), 4-digit/alpha hex) is invalid
// and falls back to the default theme color.
// ------------------------------------------------------------
const HEX_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const isValidBrandColor = (value: unknown): value is string =>
  typeof value === "string" && HEX_PATTERN.test(value.trim());

/** `#abc` → `#ABCABC`, keeps the token format uppercase like the defaults. */
const normalizeHex = (value: string): string => {
  const hex = value.trim().replace(/^#/, "");
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((char) => char + char)
          .join("")
      : hex;
  return `#${full.toUpperCase()}`;
};

// ------------------------------------------------------------
// Color math (sRGB)
// ------------------------------------------------------------
interface Rgb {
  r: number;
  g: number;
  b: number;
}

const hexToRgb = (hex: string): Rgb => {
  const normalized = normalizeHex(hex).slice(1);
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
};

const rgbToHex = ({ r, g, b }: Rgb): string =>
  `#${[r, g, b]
    .map((channel) =>
      Math.max(0, Math.min(255, Math.round(channel)))
        .toString(16)
        .padStart(2, "0")
    )
    .join("")
    .toUpperCase()}`;

/** Linear-interpolate two colors. `amount` is the weight of `a`. */
const mix = (a: Rgb, b: Rgb, amount: number): Rgb => ({
  r: a.r * amount + b.r * (1 - amount),
  g: a.g * amount + b.g * (1 - amount),
  b: a.b * amount + b.b * (1 - amount),
});

const WHITE: Rgb = { r: 255, g: 255, b: 255 };
const BLACK: Rgb = { r: 0, g: 0, b: 0 };

/** WCAG relative luminance, 0 (black) → 1 (white). */
const relativeLuminance = ({ r, g, b }: Rgb): number => {
  const linear = (channel: number) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
};

/**
 * Guarantee the primary can carry readable text both ways:
 * - white text ON primary backgrounds (buttons, badges, sidebar — dozens of
 *   existing `bg="primary.500" color="white"` usages)
 * - primary text ON white backgrounds (outline buttons, links)
 *
 * Both hold when luminance ≤ ~0.183 (WCAG AA 4.5:1). A firm color darker than
 * that (the common case — e.g. `#1A237E`) is returned EXACTLY as provided.
 * A too-light color is darkened toward black — multiplicative, so hue and
 * saturation are preserved and it still reads as the firm's color family.
 */
const ensureReadablePrimary = (hex: string): string => {
  let current = hexToRgb(hex);
  let guard = 0;
  while (relativeLuminance(current) > 0.175 && guard++ < 24) {
    current = mix(current, BLACK, 0.85);
  }
  return rgbToHex(current);
};

// ------------------------------------------------------------
// Scale generation
//
// Tint stops: the given base mixed toward white (amount = share of base).
// Shade stops: the base mixed toward black (600-900 always darker than 500,
// so `_hover`/`_active` states that darken stay legible under white text).
// 500 IS the firm's color.
// ------------------------------------------------------------
const TINT_STOPS = [
  { key: "50", amount: 0.05 },
  { key: "100", amount: 0.12 },
  { key: "200", amount: 0.26 },
  { key: "300", amount: 0.44 },
  { key: "400", amount: 0.7 },
] as const;

const SHADE_STOPS = [
  { key: "600", black: 0.15 },
  { key: "700", black: 0.3 },
  { key: "800", black: 0.45 },
  { key: "900", black: 0.6 },
] as const;

const buildPrimaryScale = (hex: string): PrimaryScale => {
  const base = hexToRgb(hex);
  const scale = {} as PrimaryScale;
  for (const stop of TINT_STOPS) {
    scale[stop.key as keyof PrimaryScale] = {
      value: rgbToHex(mix(base, WHITE, stop.amount)),
    };
  }
  scale["500"] = { value: hex };
  for (const stop of SHADE_STOPS) {
    scale[stop.key as keyof PrimaryScale] = {
      value: rgbToHex(mix(base, BLACK, 1 - stop.black)),
    };
  }
  return scale;
};

/** Same ramp, but the existing `secondary` token only defines 50 → 500. */
const buildSecondaryScale = (hex: string): SecondaryScale => {
  const base = hexToRgb(hex);
  const scale = {} as SecondaryScale;
  for (const stop of TINT_STOPS) {
    scale[stop.key as keyof SecondaryScale] = {
      value: rgbToHex(mix(base, WHITE, stop.amount)),
    };
  }
  scale["500"] = { value: hex };
  return scale;
};

/** Soft accent tints (badges / hover fills) — same ratios as the defaults. */
const buildLavenderScale = (hex: string): LavenderScale => {
  const base = hexToRgb(hex);
  return {
    "50": { value: rgbToHex(mix(base, WHITE, 0.05)) },
    "100": { value: rgbToHex(mix(base, WHITE, 0.12)) },
    "200": { value: rgbToHex(mix(base, WHITE, 0.26)) },
  };
};

// ------------------------------------------------------------
// Active select colors — snapshot consumed by the react-select styles
// (plain JS, outside the Chakra runtime). Kept in sync by
// `createBrandSystem` every time a system is built, so a Super Admin
// session or a default-fallback session always reads the default values.
// ------------------------------------------------------------
let activeSelectColors: BrandSelectColors = {
  selected: THEME_COLORS.system.select.option.selected.value,
  hover: THEME_COLORS.system.select.option.hover.value,
  focus: THEME_COLORS.system.select.option.focus.value,
};

export const getActiveBrandSelectColors = (): BrandSelectColors =>
  activeSelectColors;

// ------------------------------------------------------------
// Entry point — merge brand input over the default colors.
// Per-field fallback: an invalid primary keeps the default primary even when
// the secondary is valid, and vice versa.
// ------------------------------------------------------------
export const applyBrandColors = (
  brand?: BrandColorInput | null
): typeof THEME_COLORS => {
  const rawPrimary = brand?.primary;
  const rawSecondary = brand?.secondary;

  const primary = isValidBrandColor(rawPrimary)
    ? ensureReadablePrimary(normalizeHex(rawPrimary))
    : null;
  const secondary = isValidBrandColor(rawSecondary)
    ? normalizeHex(rawSecondary)
    : null;

  if (!primary && !secondary) {
    activeSelectColors = {
      selected: THEME_COLORS.system.select.option.selected.value,
      hover: THEME_COLORS.system.select.option.hover.value,
      focus: THEME_COLORS.system.select.option.focus.value,
    };
    return THEME_COLORS;
  }

  const primaryScale = primary ? buildPrimaryScale(primary) : THEME_COLORS.primary;
  const secondaryScale = secondary
    ? buildSecondaryScale(secondary)
    : THEME_COLORS.secondary;
  const lavender = primary
    ? buildLavenderScale(primary)
    : THEME_COLORS.lavender;
  const selectOption = primary
    ? {
        hover: { value: primaryScale["100"].value },
        focus: { value: primaryScale["100"].value },
        selected: { value: primaryScale["500"].value },
      }
    : THEME_COLORS.system.select.option;

  activeSelectColors = {
    selected: selectOption.selected.value,
    hover: selectOption.hover.value,
    focus: selectOption.focus.value,
  };

  return {
    ...THEME_COLORS,
    primary: primaryScale,
    secondary: secondaryScale,
    lavender,
    system: {
      ...THEME_COLORS.system,
      select: {
        ...THEME_COLORS.system.select,
        option: selectOption,
      },
    },
  };
};
