import { defineRecipe } from "@chakra-ui/react";

export const inputRecipe = defineRecipe({
  base: {
    color: "green.800",
    border: "sm",
  },
  variants: {
    variant: {
      primary: {
        borderColor: "system.input.border",
        color: "system.input.text",
      },
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});
