import { StylesConfig } from "react-select";

import { THEME_COLORS } from "@/shared/theme/tokens";
import { getActiveBrandSelectColors } from "@/shared/theme/brand";

export const selectStyles: StylesConfig = {
  container: (styles, { isDisabled }) => ({
    ...styles,
    width: "100%",
    height: "40px",
    opacity: isDisabled ? 0.5 : 1,
    pointerEvents: "auto",
  }),

  control: (styles, { isDisabled }) => ({
    ...styles,
    borderColor: THEME_COLORS.system.input.border.value,
    boxShadow: "none",
    height: "100%",
    padding: "0",
    backgroundColor: "white",
    cursor: isDisabled ? "not-allowed" : undefined,
  }),

  option: (styles, { isSelected, isFocused }) => {
    // Read the ACTIVE brand colors at render time (not module load): the
    // firm theme swaps them after `/me` resolves, and react-select styles
    // live outside the Chakra runtime.
    const brand = getActiveBrandSelectColors();
    return {
      ...styles,
      height: "36px",
      fontSize: "14px",
      backgroundColor: isSelected
        ? brand.selected
        : isFocused
          ? brand.focus
          : "white",

      ":hover": {
        backgroundColor: isSelected ? brand.selected : brand.hover,
      },
    };
  },

  input: (styles) => ({ ...styles, fontSize: "14px" }),
  placeholder: (styles) => ({ ...styles, fontSize: "14px" }),
  singleValue: (styles) => ({ ...styles, fontSize: "14px", cursor: "pointer" }),
};
