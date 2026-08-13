import { Box, HStack, Button, Image, VStack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LogoImage } from "@/shared/assets";
import { getInitialExpandedSidebarMenu } from "@/shared/utils";
import TokenService from "@/shared/service/service-token";
import { SidebarItem } from "./SidebarItem";
import { SidebarSection } from "./SidebarSection";
import { AccordionRoot } from "../../ui";
import { useModules } from "@/shared/hooks/useAuth";
import {
  getModuleConfig,
  groupSidebarItemsBySection,
  mapEnabledModulesToSidebarData,
  SIDEBAR_SECTION_ORDER,
} from "@/shared/constants/moduleRegistry";

const handleLogout = () => {
  TokenService.clearToken();
  window.location.href = "/auth/login";
};

const SUPPORT_MODULE_CODES = [
  "TEMPLATES",
  "HELP_DOCS",
  "SETTINGS",
  "LOGOUT",
] as const;

// Path prefixes that belong to the Case Management module. The sidebar item
// stays highlighted while the user browses any of these pages.
const CASE_MANAGEMENT_ACTIVE_PREFIXES = [
  "/case-management",
  "/cases",
  "/firm-activity",
  "/stale-matters",
];

const buildSupportSidebarItems = () => {
  return SUPPORT_MODULE_CODES.map((moduleCode) => {
    const config = getModuleConfig(moduleCode);
    if (!config) {
      return null;
    }

    const Icon = config.icon;

    return {
      moduleCode,
      name: config.label,
      href: config.path,
      icon: <Icon size={16} />,
      section: config.section,
      order: config.order,
      ...(moduleCode === "LOGOUT" ? { onClick: handleLogout } : {}),
    };
  })
    .filter((item) => item !== null)
    .sort((a, b) => a.order - b.order);
};

export const Sidebar = () => {
  const [value, setValue] = useState(getInitialExpandedSidebarMenu);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const modules = useModules();

  const moduleItems = useMemo(() => {
    return mapEnabledModulesToSidebarData(modules).map((item) => {
      const Icon = item.icon;

      const isCaseManagementActive =
        item.moduleCode === "CASE_MANAGEMENT" &&
        CASE_MANAGEMENT_ACTIVE_PREFIXES.some((prefix) =>
          location.pathname.startsWith(prefix)
        );

      return {
        moduleCode: item.moduleCode,
        name: item.label,
        href: item.path,
        icon: <Icon size={16} />,
        section: item.section,
        order: item.order,
        ...(isCaseManagementActive ? { isActive: true } : {}),
      };
    });
  }, [modules, location.pathname]);

  const itemsBySection = useMemo(
    () => groupSidebarItemsBySection(moduleItems),
    [moduleItems]
  );

  const bottomItems = useMemo(() => buildSupportSidebarItems(), []);

  return (
    <VStack
      alignItems="stretch"
      flexShrink="0"
      gap="0"
      borderRight="sm"
      borderRightColor="gray.200"
      // width={isCollapsed ? "16" : "56"}
      width={isCollapsed ? "16" : "66"}
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
      {isCollapsed ? (
        <VStack align="center" gap="3" mb="4" px="2">
          <Image src={LogoImage} boxSize="6" />
          <Button
            aria-label="Expand sidebar"
            onClick={() => setIsCollapsed(!isCollapsed)}
            variant="ghost"
            size="sm"
            color="gray.500"
            p="2"
            minW="32px"
            minH="32px"
            borderRadius="md"
            _hover={{ bg: "gray.100" }}
          >
            <ChevronRight size={16} />
          </Button>
        </VStack>
      ) : (
        <Box px="3" mb="3">
          <HStack justify="space-between" align="center">
            <HStack gap="2">
              <Image src={LogoImage} boxSize="8" />
              <Text fontWeight="bold" fontSize="md" color="gray.800">
                Law CRM
              </Text>
            </HStack>
            <Button
              aria-label="Collapse sidebar"
              onClick={() => setIsCollapsed(!isCollapsed)}
              variant="ghost"
              size="xs"
              color="gray.500"
              p="1"
            >
              <ChevronLeft size={14} />
            </Button>
          </HStack>
        </Box>
      )}

      {/* Divider */}
      <Box borderBottom="sm" borderBottomColor="gray.200" mb="2" />

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
        {/* Top + Main + Administration — scrollable middle */}
        <VStack alignItems="stretch" gap="0" flex="1" overflowY="auto">
          {SIDEBAR_SECTION_ORDER.map((section) => {
            const sectionItems = itemsBySection[section] ?? [];
            if (sectionItems.length === 0) {
              return null;
            }

            return (
              <SidebarSection
                key={section}
                title={!isCollapsed ? section : ""}
                items={sectionItems.map((sidebarItem) => (
                  <SidebarItem
                    key={sidebarItem.moduleCode}
                    {...sidebarItem}
                    isCollapsed={isCollapsed}
                  />
                ))}
              />
            );
          })}
        </VStack>

        {/* Support items — pinned to bottom */}
        <Box borderTop="sm" borderTopColor="gray.200" pt="2" mt="2">
          <VStack alignItems="stretch" gap="0">
            {bottomItems.map((sidebarItem) => (
              <SidebarItem
                key={sidebarItem.moduleCode}
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
