import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
  base: {},
  variants: {
    variant: {
      primary: {},
      outline: {},
      ghost: {},
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});
