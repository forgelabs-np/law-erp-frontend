import { Box, Image, VStack, Spinner, Text } from "@chakra-ui/react";
import { useState } from "react";

import { LogoImage } from "@/shared/assets";
import { SIDEBAR_ITEMS } from "@/shared/constants";
import { useModules } from "@/shared/hooks/useModules";
import { getInitialExpandedSidebarMenu } from "@/shared/utils";

import { SidebarItem } from "./SidebarItem";
import { AccordionRoot } from "../../ui";

export const Sidebar = () => {
  const [value, setValue] = useState(getInitialExpandedSidebarMenu);
  const { sidebarItems, loading, error } = useModules();

  // Use dynamic items if available, fallback to static SIDEBAR_ITEMS
  const itemsToDisplay = sidebarItems.length > 0 ? sidebarItems : SIDEBAR_ITEMS;

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

      {error && (
        <Text fontSize="xs" color="red.500" px="4" textAlign="center">
          Error loading modules
        </Text>
      )}

      {loading ? (
        <VStack justifyContent="center" flex="1">
          <Spinner size="sm" />
        </VStack>
      ) : (
        <AccordionRoot
          value={value}
          onValueChange={(event) => setValue(event.value)}
          multiple
        >
          <VStack alignItems="stretch" gap="1">
            {itemsToDisplay.map((sidebarItem) => (
              <SidebarItem key={sidebarItem.name} {...sidebarItem} />
            ))}
          </VStack>
        </AccordionRoot>
      )}
    </VStack>
  );
};
