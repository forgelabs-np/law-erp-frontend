import { createSystem, defaultConfig } from "@chakra-ui/react";

import { applyBrandColors, type BrandColorInput } from "./brand";

export type { BrandColorInput } from "./brand";
export * from "./fontManager";
export * from "./tokens/fonts";
import {
  buttonRecipe,
  checkmarkRecipe,
  inputRecipe,
  radiomarkRecipe,
} from "./recipes";
import {
  checkboxSlotRecipe,
  dialogSlotRecipe,
  drawerSlotRecipe,
  fieldSlotRecipe,
  radioGroupSlotRecipe,
  switchSlotRecipe,
} from "./slotRecipe";
import {
  THEME_BORDERS,
  THEME_BORDER_STYLES,
  THEME_BORDER_WIDTHS,
  THEME_COLORS,
  THEME_CURSORS,
  THEME_FONTS,
  THEME_OPACITY,
  THEME_SIZES,
  THEME_SPACING,
} from "./tokens";

const buildConfig = (colors: typeof THEME_COLORS) => ({
  theme: {
    tokens: {
      borders: THEME_BORDERS,
      borderStyles: THEME_BORDER_STYLES,
      borderWidths: THEME_BORDER_WIDTHS,
      colors,
      cursor: THEME_CURSORS,
      fonts: THEME_FONTS,
      opacity: THEME_OPACITY,
      sizes: THEME_SIZES,
      spacing: THEME_SPACING,
    },
    recipes: {
      button: buttonRecipe,
      checkmark: checkmarkRecipe,
      input: inputRecipe,
      radiomark: radiomarkRecipe,
    },
    slotRecipes: {
      checkbox: checkboxSlotRecipe,
      dialog: dialogSlotRecipe,
      drawer: drawerSlotRecipe,
      field: fieldSlotRecipe,
      radioGroup: radioGroupSlotRecipe,
      switch: switchSlotRecipe,
    },
  },
  conditions: {},
});

/** The un-branded system — the default (and Super Admin) theme. */
const defaultSystem = createSystem(defaultConfig, buildConfig(THEME_COLORS));

export type BrandSystem = ReturnType<typeof createBrandSystem>;

/**
 * Build a Chakra system for a firm's brand colors.
 *
 * - `null`/`undefined` brand, or both fields invalid → the default system is
 *   returned (same instance, no re-render churn, defaults never modified).
 * - Otherwise `applyBrandColors` validates each field (falling back per-field
 *   to the defaults) and derives the primary/secondary/lavender/select scales
 *   from the firm's colors, so every existing `primary.*` token usage —
 *   buttons, sidebar, tabs, focus rings, badges, pagination — re-brands.
 *
 * Also refreshes the active select-color snapshot consumed by the plain
 * react-select styles that live outside the Chakra runtime.
 */
export const createBrandSystem = (brand?: BrandColorInput | null) => {
  const colors = applyBrandColors(brand);
  return colors === THEME_COLORS ? defaultSystem : createSystem(defaultConfig, buildConfig(colors));
};

const chakraSystem = createBrandSystem();

export default chakraSystem;
