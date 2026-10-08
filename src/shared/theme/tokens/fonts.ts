export const AVAILABLE_FONTS = {
  Poppins: "'Poppins', sans-serif",
  Roboto: "'Roboto', sans-serif",
  Nunito: "'Nunito', sans-serif",
  Inter: "'Inter', 'Inter-Regular', sans-serif",
} as const;

export type FontKey = keyof typeof AVAILABLE_FONTS;

export const DEFAULT_FONT: FontKey = "Poppins";

export const THEME_FONTS = {
  heading: { value: "var(--app-font-family, 'Poppins', sans-serif)" },
  body: { value: "var(--app-font-family, 'Poppins', sans-serif)" },
};
