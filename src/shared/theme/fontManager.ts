import { useEffect, useState } from "react";

import {
  AVAILABLE_FONTS,
  DEFAULT_FONT,
  type FontKey,
} from "./tokens/fonts";

const FONT_STORAGE_KEY = "nepalcrm.active-font.v1";
const FONT_CHANGE_EVENT = "app-font-changed";

/**
 * Get the currently stored active font key from localStorage or fallback to default.
 */
export const getStoredFont = (): FontKey => {
  try {
    const saved = localStorage.getItem(FONT_STORAGE_KEY);
    if (saved && saved in AVAILABLE_FONTS) {
      return saved as FontKey;
    }
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_FONT;
};

/**
 * Apply the selected font family to the DOM root and document body.
 */
export const applyFontToDOM = (fontKey: FontKey): void => {
  const fontCssValue = AVAILABLE_FONTS[fontKey] || AVAILABLE_FONTS[DEFAULT_FONT];
  document.documentElement.style.setProperty("--app-font-family", fontCssValue);
  if (document.body) {
    document.body.style.setProperty("font-family", fontCssValue);
  }
};

/**
 * Set and persist active font across the entire application.
 */
export const setAppFont = (fontKey: FontKey): void => {
  if (!(fontKey in AVAILABLE_FONTS)) return;
  try {
    localStorage.setItem(FONT_STORAGE_KEY, fontKey);
  } catch {
    // localStorage unavailable
  }
  applyFontToDOM(fontKey);
  window.dispatchEvent(
    new CustomEvent(FONT_CHANGE_EVENT, { detail: fontKey })
  );
};

/**
 * Initialize font on initial application load.
 */
export const initAppFont = (): FontKey => {
  const font = getStoredFont();
  applyFontToDOM(font);
  return font;
};

/**
 * React hook to read current active font and switch between available fonts.
 */
export const useAppFont = () => {
  const [activeFont, setActiveFontState] = useState<FontKey>(getStoredFont);

  useEffect(() => {
    // Initial DOM paint
    applyFontToDOM(activeFont);

    const handleFontChange = (e: Event) => {
      const customEvent = e as CustomEvent<FontKey>;
      if (customEvent.detail && customEvent.detail in AVAILABLE_FONTS) {
        setActiveFontState(customEvent.detail);
      }
    };

    window.addEventListener(FONT_CHANGE_EVENT, handleFontChange);
    return () => {
      window.removeEventListener(FONT_CHANGE_EVENT, handleFontChange);
    };
  }, [activeFont]);

  const changeFont = (newFont: FontKey) => {
    setAppFont(newFont);
  };

  return {
    activeFont,
    activeFontFamily: AVAILABLE_FONTS[activeFont],
    setFont: changeFont,
    availableFonts: AVAILABLE_FONTS,
  };
};
