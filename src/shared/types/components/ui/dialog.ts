import { Dialog as ChakraDialog } from "@chakra-ui/react";

export type DialogContentProps = ChakraDialog.ContentProps & {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  backdrop?: boolean;
};
