import { defineRecipe } from "@chakra-ui/react";

export const inputRecipe = defineRecipe({
  base: {
    color: "gray.600",
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
