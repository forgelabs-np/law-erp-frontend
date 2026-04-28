import { defineSlotRecipe } from "@chakra-ui/react";
import { switchAnatomy } from "@chakra-ui/react/anatomy";

export const switchSlotRecipe = defineSlotRecipe({
  slots: switchAnatomy.keys(),
  className: "chakra-switch",
  base: {
    root: {
      width: "fit",
    },
    label: {},
    indicator: {},
    control: {},
    thumb: {},
  },

  variants: {
    variant: {
      solid: {
        control: {
          borderRadius: "full",
          bg: "gray.200",
          focusVisibleRing: "outside",
          _checked: {
            bg: "green.600",
          },
        },
        thumb: {},
      },
    },

    size: {
      xs: {},
      sm: {
        root: {},
        thumb: {},
      },
      md: {
        root: {},
        thumb: {},
      },
      lg: {},
    },
  },

  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});
