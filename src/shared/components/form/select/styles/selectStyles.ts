import { StylesConfig } from "react-select";

import { getActiveBrandSelectColors } from "@/shared/theme/brand";

export const selectStyles: StylesConfig = {
  container: (styles, { isDisabled }) => ({
    ...styles,
    width: "100%",
    minHeight: "40px",
    opacity: isDisabled ? 0.5 : 1,
    pointerEvents: "auto",
  }),

  control: (styles, { isDisabled, isFocused }) => ({
    ...styles,
    borderRadius: "10px",
    borderColor: isFocused ? "#3B82F6" : "#E2E8F0",
    boxShadow: isFocused ? "0 0 0 1px #3B82F6" : "none",
    minHeight: "40px",
    height: "40px",
    padding: "0 4px",
    backgroundColor: "white",
    cursor: isDisabled ? "not-allowed" : "pointer",
    transition: "all 0.15s ease",
    ":hover": {
      borderColor: isFocused ? "#3B82F6" : "#CBD5E1",
    },
  }),

  valueContainer: (styles) => ({
    ...styles,
    padding: "0 8px",
  }),

  dropdownIndicator: (styles) => ({
    ...styles,
    color: "#64748B",
    padding: "6px 8px",
    ":hover": {
      color: "#334155",
    },
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  menu: (styles) => ({
    ...styles,
    borderRadius: "12px",
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
    border: "1px solid #E2E8F0",
    overflow: "hidden",
    zIndex: 9999,
  }),

  option: (styles, { isSelected, isFocused }) => {
    const brand = getActiveBrandSelectColors();
    return {
      ...styles,
      minHeight: "36px",
      fontSize: "13px",
      fontWeight: isSelected ? 600 : 400,
      color: isSelected ? "#0056FF" : "#1E293B",
      backgroundColor: isSelected ? "#EFF6FF" : isFocused ? "#F8FAFC" : "white",
      cursor: "pointer",
      ":hover": {
        backgroundColor: isSelected ? "#EFF6FF" : brand.hover || "#F1F5F9",
      },
    };
  },

  input: (styles) => ({ ...styles, fontSize: "13px", color: "#1E293B" }),
  placeholder: (styles) => ({
    ...styles,
    fontSize: "13px",
    color: "#64748B",
    fontWeight: 500,
  }),
  singleValue: (styles) => ({
    ...styles,
    fontSize: "13px",
    color: "#1E293B",
    fontWeight: 500,
    cursor: "pointer",
  }),
};
