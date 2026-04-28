import { defineSlotRecipe } from "@chakra-ui/react";
import { radioGroupAnatomy } from "@chakra-ui/react/anatomy";

import { radiomarkRecipe } from "../recipes";

export const radioGroupSlotRecipe = defineSlotRecipe({
  slots: radioGroupAnatomy.keys(),
  base: {
    itemControl: radiomarkRecipe.base,
  },
  variants: {
    variant: {
      outline: {
        itemControl: radiomarkRecipe.variants?.variant?.outline,
      },

      subtle: {
        itemControl: radiomarkRecipe.variants?.variant?.subtle,
      },

      solid: {
        itemControl: radiomarkRecipe.variants?.variant?.solid,
      },
    },

    size: {
      xs: {
        item: { textStyle: "xs", gap: "1.5" },
        itemControl: radiomarkRecipe.variants?.size?.xs,
      },

      sm: {
        item: { textStyle: "sm", gap: "2" },
        itemControl: radiomarkRecipe.variants?.size?.sm,
      },

      md: {
        item: { textStyle: "sm", gap: "2.5" },
        itemControl: radiomarkRecipe.variants?.size?.md,
      },

      lg: {
        item: { textStyle: "md", gap: "3" },
        itemControl: radiomarkRecipe.variants?.size?.lg,
      },
    },
  },

  defaultVariants: {
    size: "md",
    variant: "solid",
  },
});
