import type { SystemStyleObject } from "@chakra-ui/react";

/** Shared presentation tokens for the large pill inputs used on the
 * authentication screens.
 */
export const AUTH_PILL_INPUT_PROPS = {
  height: "56px",
  fontSize: "15px",
  px: "24px",
  borderRadius: "9999px",
  bg: "white",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "#E2E8F0",
  _placeholder: { color: "#94A3B8" },
  _hover: { borderColor: "#CBD5E1" },
  _disabled: { opacity: "0.6", cursor: "not-allowed", bg: "gray.50" },
  endElementProps: { me: "3" },
};

export const AUTH_PILL_INPUT_STYLE: SystemStyleObject = {
  borderColor: "primary.500",
  boxShadow: "0 0 0 4px rgba(0, 82, 255, 0.12)",
};

export const AUTH_PILL_INVALID_STYLE: SystemStyleObject = {
  borderColor: "red.500",
};

export const AUTH_PILL_BUTTON_PROPS = {
  width: "full",
  height: "56px",
  borderRadius: "9999px",
  fontSize: "18px",
  fontWeight: "700",
  boxShadow: "0 10px 25px -4px rgba(0, 82, 255, 0.4)",
};

export const AUTH_PILL_BUTTON_STYLE: SystemStyleObject = {
  bg: "primary.500",
  color: "white",
  boxShadow: "0 10px 25px -4px rgba(0, 82, 255, 0.4)",
  _hover: {
    bg: "primary.600",
    boxShadow: "0 12px 28px -4px rgba(0, 82, 255, 0.5)",
  },
  _active: { opacity: "0.9", bg: "primary.700" },
  _focusVisible: { boxShadow: "0 0 0 4px rgba(0, 82, 255, 0.35)" },
};
