import { createSystem, defaultConfig } from "@chakra-ui/react";

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

const chakraSystem = createSystem(defaultConfig, {
  theme: {
    tokens: {
      borders: THEME_BORDERS,
      borderStyles: THEME_BORDER_STYLES,
      borderWidths: THEME_BORDER_WIDTHS,
      colors: THEME_COLORS,
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

export default chakraSystem;
