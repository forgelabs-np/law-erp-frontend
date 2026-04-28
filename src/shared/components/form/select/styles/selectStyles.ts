import { StylesConfig } from "react-select";

import { THEME_COLORS } from "@/shared/theme/tokens";

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

  option: (styles, { isSelected, isFocused }) => ({
    ...styles,
    height: "36px",
    fontSize: "14px",
    backgroundColor: isSelected
      ? THEME_COLORS.system.select.option.selected.value
      : isFocused
        ? THEME_COLORS.system.select.option.focus.value
        : "white",

    ":hover": {
      backgroundColor: isSelected
        ? THEME_COLORS.system.select.option.selected.value
        : THEME_COLORS.system.select.option.hover.value,
    },
  }),

  input: (styles) => ({ ...styles, fontSize: "14px" }),
  placeholder: (styles) => ({ ...styles, fontSize: "14px" }),
  singleValue: (styles) => ({ ...styles, fontSize: "14px", cursor: "pointer" }),
};
