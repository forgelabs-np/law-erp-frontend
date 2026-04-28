import { Drawer as ChakraDrawer } from "@chakra-ui/react";

export type DrawerContentProps = ChakraDrawer.ContentProps & {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  offset?: ChakraDrawer.ContentProps["padding"];
};
