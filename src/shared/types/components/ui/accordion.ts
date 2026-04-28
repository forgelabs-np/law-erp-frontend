import { Accordion } from "@chakra-ui/react";

export type AccordionItemTriggerProps = Accordion.ItemTriggerProps & {
  indicatorPlacement?: "start" | "end";
  hasIndicator?: boolean;
};

export type AccordionItemContentProps = Accordion.ItemContentProps & {};
