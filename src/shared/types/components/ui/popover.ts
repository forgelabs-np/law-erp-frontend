import { Popover as ChakraPopover } from "@chakra-ui/react";

export type PopoverContentProps = ChakraPopover.ContentProps & {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
};
