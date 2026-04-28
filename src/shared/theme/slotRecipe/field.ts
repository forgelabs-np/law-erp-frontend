import { defineSlotRecipe } from "@chakra-ui/react";
import { fieldAnatomy } from "@chakra-ui/react/anatomy";

export const fieldSlotRecipe = defineSlotRecipe({
  slots: fieldAnatomy.keys(),
  base: {
    // root: {
    //   width: "full",
    // },
    label: {
      color: "system.field.label",
    },
  },
});
