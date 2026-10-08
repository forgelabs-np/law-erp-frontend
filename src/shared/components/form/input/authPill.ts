import type { SystemStyleObject } from "@chakra-ui/react";

/** Shared presentation tokens for the large pill inputs used on the
 * authentication screens.
 */
export const AUTH_PILL_INPUT_PROPS = {
  height: "50px",
  fontSize: "18px",
  px: "28px",
  borderRadius: "28px",
  bg: "white",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "#B8B8B8",
  _placeholder: { color: "gray.400" },
  _hover: { borderColor: "#8F8F8F" },
  _disabled: { opacity: "0.6", cursor: "not-allowed", bg: "gray.50" },
  endElementProps: { me: "4" },
};

export const AUTH_PILL_INPUT_STYLE: SystemStyleObject = {
  borderColor: "primary.500",
  boxShadow: "0 0 0 3px rgba(0, 86, 255, 0.15)",
};

export const AUTH_PILL_INVALID_STYLE: SystemStyleObject = {
  borderColor: "red.500",
};

export const AUTH_PILL_BUTTON_PROPS = {
  width: "full",
  height: "64px",
  borderRadius: "9999px",
  fontSize: "19px",
  fontWeight: "600",
  boxShadow: "none",
};

export const AUTH_PILL_BUTTON_STYLE: SystemStyleObject = {
  bg: "primary.500",
  color: "white",
  boxShadow: "none",
  _hover: {
    bg: "primary.500", opacity: "0.92",
    borderColor: "primary.500",
  },
  _active: { opacity: "0.88", bg: "primary.500" },
  _focusVisible: { boxShadow: "0 0 0 3px rgba(0, 86, 255, 0.35)" },
};