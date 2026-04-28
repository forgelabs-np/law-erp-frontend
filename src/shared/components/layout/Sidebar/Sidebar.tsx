import { Box, Image, VStack } from "@chakra-ui/react";
import { useState } from "react";

import { LogoImage } from "@/shared/assets";
import { SIDEBAR_ITEMS } from "@/shared/constants";
import { getInitialExpandedSidebarMenu } from "@/shared/utils";

import { SidebarItem } from "./SidebarItem";
import { AccordionRoot } from "../../ui";

export const Sidebar = () => {
  const [value, setValue] = useState(getInitialExpandedSidebarMenu);

  return (
    <VStack
      alignItems="stretch"
      flexShrink="0"
      gap="4"
      borderRight="sm"
      borderRightColor="gray.200"
      width="64"
      py="6"
      px="2"
    >
      <Box px="6">
        <Image src={LogoImage} boxSize="20" />
      </Box>

      <AccordionRoot
        value={value}
        onValueChange={(event) => setValue(event.value)}
        multiple
      >
        <VStack alignItems="stretch" gap="1">
          {SIDEBAR_ITEMS.map((sidebarItem) => (
            <SidebarItem key={sidebarItem.name} {...sidebarItem} />
          ))}
        </VStack>
      </AccordionRoot>
    </VStack>
  );
};
