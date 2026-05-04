export const THEME_COLORS = {
  primary: {
    50: { value: "" },
    100: { value: "" },
    200: { value: "green.800" },
    300: { value: "" },
    400: { value: "" },
    500: { value: "#08545e" },
  },

  secondary: {
    50: { value: "" },
    100: { value: "" },
    200: { value: "" },
    300: { value: "" },
    400: { value: "" },
    500: { value: "" },
  },

  system: {
    field: {
      label: { value: "#292828" },
    },
    input: {
      border: { value: "#9e9e9e" },
      text: { value: "#292828" },
    },
    inputGroup: {
      element: { value: "#292828" },
    },
    select: {
      option: {
        hover: { value: "#d6e7ff" }, // make sure the hover and focus colors are same so that flicker is not being displayed
        focus: { value: "#d6e7ff" },
        selected: { value: "#0e53b3" },
      },
    },
  },
};
