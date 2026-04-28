import { Tooltip as ChakraTooltip } from "@chakra-ui/react";

export type TooltipProps = ChakraTooltip.RootProps & {
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  content: React.ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  disabled?: boolean;
};
