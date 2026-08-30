export const THEME_COLORS = {
  // ═══════════════════════════════════════════════════════════════════════════
  // Legacy Brand Identity (Green)
  // primary.50:  '#E8F5EE'
  // primary.100: '#C5E6D5'
  // primary.200: '#9ED0B8'
  // primary.300: '#75B99B'
  // primary.400: '#4CA27E'
  // primary.500: '#0D6944'
  // primary.600: '#0A5235'
  // primary.700: '#073B26'
  // primary.800: '#052418'
  // primary.900: '#020D0A'
  // ═══════════════════════════════════════════════════════════════════════════

  // Current Brand Identity (Royal Blue)
  primary: {
    50: { value: "#E3E7FC" }, // Soft Lavender
    100: { value: "#C0CBF8" },
    200: { value: "#8AA5F3" },
    300: { value: "#5B83ED" },
    400: { value: "#2277FF" }, // Azure Blue (secondary)
    500: { value: "#0056FF" }, // Royal Blue (primary)
    600: { value: "#0048D9" },
    700: { value: "#003AB3" },
    800: { value: "#002C8C" },
    900: { value: "#001E66" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Legacy Secondary (was empty)
  // ═══════════════════════════════════════════════════════════════════════════
  secondary: {
    50: { value: "#E3E7FC" },
    100: { value: "#C0CBF8" },
    200: { value: "#8AA5F3" },
    300: { value: "#5B83ED" },
    400: { value: "#2277FF" },
    500: { value: "#2277FF" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Lavender accent (Soft Lavender for backgrounds / badges / selected states)
  // ═══════════════════════════════════════════════════════════════════════════
  lavender: {
    50: { value: "#F4F6FE" },
    100: { value: "#E3E7FC" },
    200: { value: "#C0CBF8" },
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
        hover: { value: "#C0CBF8" }, // lavender-100
        focus: { value: "#C0CBF8" },
        selected: { value: "#0056FF" }, // primary-500
      },
    },
  },
};
