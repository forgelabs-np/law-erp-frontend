import { defineSlotRecipe } from "@chakra-ui/react";
import { drawerAnatomy } from "@chakra-ui/react/anatomy";

export const drawerSlotRecipe = defineSlotRecipe({
  slots: drawerAnatomy.keys(),
  className: "chakra-drawer",
  base: {
    backdrop: {},
    positioner: {},
    content: {},
    header: {
      display: "flex",
      justifyContent: "space-between",
      borderBottom: "sm",
      borderBottomColor: "gray.200",
      "& > .close-icon": {
        cursor: "pointer",
      },
    },
    body: {},
    footer: {},
    title: {
      textStyle: "lg",
    },
    description: {},
  },
  variants: {
    size: {
      xs: {
        content: {
          maxW: "xs",
        },
      },
    },
  },
});
