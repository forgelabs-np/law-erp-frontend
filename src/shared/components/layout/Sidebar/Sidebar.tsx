import { Box, HStack, Button, Image, VStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LogoImage } from "@/shared/assets";
import { SIDEBAR_ITEMS } from "@/shared/constants";
import { getInitialExpandedSidebarMenu } from "@/shared/utils";
import { SidebarItem } from "./SidebarItem";
import { SidebarSection } from "./SidebarSection";
import { AccordionRoot } from "../../ui";

export const Sidebar = () => {
  const [value, setValue] = useState(getInitialExpandedSidebarMenu);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const topItems = SIDEBAR_ITEMS.filter((item) => !item.section);
  const mainItems = SIDEBAR_ITEMS.filter((item) => item.section === "Main");
  const marketingItems = SIDEBAR_ITEMS.filter(
    (item) => item.section === "Marketing & Support"
  );
  const bottomItems = SIDEBAR_ITEMS.filter(
    (item) =>
      item.section === "bottom" &&
      item.name !== "Home" &&
      item.name !== "User Management"
  );

  return (
    <VStack
      alignItems="stretch"
      flexShrink="0"
      gap="0"
      borderRight="sm"
      borderRightColor="gray.200"
      width={isCollapsed ? "16" : "56"}
      py="4"
      px={isCollapsed ? "2" : "2"}
      bg="white"
      transition="width 0.3s ease"
      height="100vh"
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": {
          background: "#CBD5E0",
          borderRadius: "3px",
        },
        "&::-webkit-scrollbar-thumb:hover": { background: "#A0AEC0" },
      }}
    >
      {/* Logo + toggle */}
      <Box px={isCollapsed ? "2" : "3"} mb="3">
        <HStack justify="space-between" align="center">
          <Image src={LogoImage} boxSize={isCollapsed ? "6" : "8"} />
          {!isCollapsed && (
            <Text fontWeight="bold" fontSize="md" color="gray.800">
              Law CRM
            </Text>
          )}
          <Button
            aria-label="Toggle sidebar"
            onClick={() => setIsCollapsed(!isCollapsed)}
            variant="ghost"
            size="xs"
            color="gray.500"
            p="1"
          >
            {isCollapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronLeft size={14} />
            )}
          </Button>
        </HStack>
      </Box>

      {/* Scrollable nav area — grows to fill space */}
      <AccordionRoot
        value={value}
        onValueChange={(event) => setValue(event.value)}
        multiple
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {/* Top + Main + Marketing — scrollable middle */}
        <VStack alignItems="stretch" gap="0" flex="1" overflowY="auto">
          {topItems.map((sidebarItem) => (
            <SidebarItem
              key={sidebarItem.name}
              {...sidebarItem}
              isCollapsed={isCollapsed}
            />
          ))}
          <SidebarSection
            title={mainItems.length === 0 ? "" : !isCollapsed ? "Main" : ""}
            items={mainItems.map((sidebarItem) => (
              <SidebarItem
                key={sidebarItem.name}
                {...sidebarItem}
                isCollapsed={isCollapsed}
              />
            ))}
          />
          <SidebarSection
            title={
              marketingItems.length === 0
                ? ""
                : !isCollapsed
                  ? "Marketing & Support"
                  : ""
            }
            items={marketingItems.map((sidebarItem) => (
              <SidebarItem
                key={sidebarItem.name}
                {...sidebarItem}
                isCollapsed={isCollapsed}
              />
            ))}
          />
        </VStack>

        {/* Bottom items — pinned to bottom */}
        <Box borderTop="sm" borderTopColor="gray.200" pt="2" mt="2">
          <VStack alignItems="stretch" gap="0">
            {bottomItems.map((sidebarItem) => (
              <SidebarItem
                key={sidebarItem.name}
                {...sidebarItem}
                isCollapsed={isCollapsed}
              />
            ))}
          </VStack>
        </Box>
      </AccordionRoot>
    </VStack>
  );
};
