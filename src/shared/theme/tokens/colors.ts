export const THEME_COLORS = {
  primary: {
    50: { value: "#E8F5EE" },
    100: { value: "#C5E6D5" },
    200: { value: "#9ED0B8" },
    300: { value: "#75B99B" },
    400: { value: "#4CA27E" },
    500: { value: "#0D6944" },
    600: { value: "#0A5235" },
    700: { value: "#073B26" },
    800: { value: "#052418" },
    900: { value: "#020D0A" },
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
