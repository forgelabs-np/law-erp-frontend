import { defineRecipe } from "@chakra-ui/react";

export const radiomarkRecipe = defineRecipe({
  variants: {
    variant: {
      solid: {
        borderWidth: "1",
        borderColor: "border",
        _checked: {
          bg: "colorPalette.solid",
          color: "colorPalette.contrast",
          borderColor: "colorPalette.solid",
        },
      },

      subtle: {
        borderWidth: "1",
        bg: "colorPalette.muted",
        borderColor: "colorPalette.muted",
        color: "transparent",
        _checked: {
          color: "colorPalette.fg",
        },
      },

      outline: {
        borderWidth: "1",
        borderColor: "transparent",
        _checked: {
          color: "colorPalette.fg",
          borderColor: "colorPalette.solid",
        },
        "& .dot": {
          scale: "0.6",
        },
      },
    },

    size: {
      xs: {
        boxSize: "3",
      },

      sm: {
        boxSize: "4",
      },

      md: {
        boxSize: "5",
      },

      lg: {
        boxSize: "6",
      },
    },
  },

  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});
