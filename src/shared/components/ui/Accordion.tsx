import { Accordion, Box, HStack } from "@chakra-ui/react";
import * as React from "react";

import { ArrowDownIcon } from "@/shared/assets";
import {
  AccordionItemContentProps,
  AccordionItemTriggerProps,
} from "@/shared/types";

export const AccordionItemTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionItemTriggerProps
>(function AccordionItemTrigger(props, ref) {
  const {
    children,
    indicatorPlacement = "end",
    hasIndicator = true,
    ...rest
  } = props;
  return (
    <Accordion.ItemTrigger ref={ref} position="relative" {...rest}>
      <HStack gap="4" flex="1" width="full" textAlign="start">
        {children}
      </HStack>

      {hasIndicator && (
        <Box
          position="absolute"
          top="1/2"
          right={indicatorPlacement === "end" ? "1" : undefined}
          transform="translateY(-50%)"
        >
          <Accordion.ItemIndicator>
            <ArrowDownIcon />
          </Accordion.ItemIndicator>
        </Box>
      )}
    </Accordion.ItemTrigger>
  );
});

export const AccordionItemContent = React.forwardRef<
  HTMLDivElement,
  AccordionItemContentProps
>(function AccordionItemContent(props, ref) {
  return (
    <Accordion.ItemContent>
      <Accordion.ItemBody {...props} ref={ref} />
    </Accordion.ItemContent>
  );
});

export const AccordionRoot = Accordion.Root;
export const AccordionItem = Accordion.Item;
