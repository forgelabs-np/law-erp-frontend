import { Box, HStack, Text } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

import { SidebarItemProps } from "@/shared/types";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
} from "../../ui";

export const LinkItem = ({
  name,
  href,
  icon,
  isChild,
  isActive,
  isCollapsed,
  onClick,
  hasSubItems,
  isExpanded,
}: SidebarItemProps & { 
  isCollapsed?: boolean; 
  hasSubItems?: boolean; 
  isExpanded?: boolean;
}) => {
  const location = useLocation();

  // Prefer an explicit `isActive` override (used for module-level
  // highlighting); otherwise fall back to an exact pathname match.
  const active = isActive ?? location.pathname === href;

  if (href && !hasSubItems) {
    return (
      <Link
        to={href}
        style={{
          width: "100%",
          textDecoration: "none",
        }}
      >
        <LinkItem
          name={name}
          icon={icon}
          isChild={isChild}
          isActive={active}
          isCollapsed={isCollapsed}
          onClick={onClick}
          hasSubItems={hasSubItems}
          isExpanded={isExpanded}
        />
      </Link>
    );
  }

  return (
    <HStack
      px={isCollapsed ? "2" : "3"}
      py="2"
      pl={isChild ? "8" : undefined}
      userSelect="none"
      width="full"
      position="relative"
      _hover={{
        background: !isActive ? "gray.100" : undefined,
      }}
      background={isActive ? "primary.50" : undefined}
      color={isActive ? "primary.600" : "gray.700"}
      cursor="pointer"
      transition="all 0.2s"
      justify={isCollapsed ? "center" : "flex-start"}
      onClick={onClick}
    >
      {isActive && (
        <Box
          position="absolute"
          left="0"
          top="0"
          bottom="0"
          width="3px"
          background="primary.500"
          borderRadius="0 4px 4px 0"
        />
      )}
      <Box
        css={{
          "&>svg": {
            width: 4,
            height: 4,
          },
        }}
      >
        {icon}
      </Box>

      {!isCollapsed && (
        <Text fontSize="sm" fontWeight={isActive ? "600" : "400"} flex="1">
          {name}
        </Text>
      )}

      {!isCollapsed && hasSubItems && (
        <Box transition="transform 0.2s">
          {isExpanded ? (
            <ChevronDown size={14} color="black" />
          ) : (
            <ChevronRight size={14} color="black" />
          )}
        </Box>
      )}
    </HStack>
  );
};

export const SidebarItem = (
  props: SidebarItemProps & { 
    isCollapsed?: boolean; 
    moduleCode?: string;
    expandedModules?: string[];
  }
) => {
  const location = useLocation();
  const subItems = props.subItems;
  const hasSubItems = Array.isArray(subItems) && subItems.length > 0;
  const isExpanded = props.expandedModules?.includes(props.moduleCode || props.name) ?? false;

  // When collapsed, don't use accordion - just show the icon
  if (props.isCollapsed) {
    return <LinkItem {...props} hasSubItems={false} isExpanded={false} />;
  }

  return (
    <AccordionItem value={props.moduleCode || props.name} borderWidth="0">
      <AccordionItemTrigger 
        hasIndicator={false} 
        py="0" 
        cursor="pointer"
        disabled={!hasSubItems && !props.href}
      >
        <LinkItem {...props} hasSubItems={hasSubItems} isExpanded={isExpanded} />
      </AccordionItemTrigger>

      {hasSubItems && (
        <AccordionItemContent py="0">
          {/* Relatively-positioned wrapper so the connector line/dots can be
              absolutely positioned against the submenu list without
              affecting layout, spacing, or any existing submenu styling. */}
          <Box position="relative">
            {subItems?.map((subItem) => (
              <LinkItem key={subItem.name} {...subItem} isChild />
            ))}

            {isExpanded && subItems && subItems.length > 0 && (
              <>
                {/* Vertical connector line, spanning from the center of the
                    first dot to the center of the last dot. Using
                    percentage-based offsets (derived from the item count)
                    means it automatically adjusts to any number of
                    submenus with no hardcoded pixel math. Rendered after the
                    items (and given a zIndex) so it stacks above each row's
                    background, including the active row's highlight, rather
                    than being painted underneath it. */}
                <Box
                  position="absolute"
                  left="19px"
                  top={`${100 / (2 * subItems.length)}%`}
                  bottom={`${100 / (2 * subItems.length)}%`}
                  width="1px"
                  background="gray.300"
                  pointerEvents="none"
                  zIndex="1"
                />
                {/* Dots overlay: one equal flex slot per submenu item, each
                    centering a dot vertically within that slot. Since every
                    submenu row renders the same LinkItem markup (equal
                    height), this keeps each dot aligned with its
                    corresponding item without measuring row heights. */}
                <Box
                  position="absolute"
                  left="19px"
                  top="0"
                  bottom="0"
                  display="flex"
                  flexDirection="column"
                  pointerEvents="none"
                  zIndex="1"
                >
                  {subItems.map((subItem) => {
                    // Mirror LinkItem's own active-detection logic (explicit
                    // `isActive` override, falling back to an exact
                    // pathname match) so the dot's color always matches
                    // whether its row is currently highlighted.
                    const subItemActive =
                      subItem.isActive ?? location.pathname === subItem.href;

                    return (
                      <Box
                        key={subItem.name}
                        flex="1"
                        display="flex"
                        alignItems="center"
                      >
                        <Box
                          width="5px"
                          height="5px"
                          borderRadius="full"
                          background={subItemActive ? "primary.500" : "gray.400"}
                          transform="translateX(-2.5px)"
                        />
                      </Box>
                    );
                  })}
                </Box>
              </>
            )}
          </Box>
        </AccordionItemContent>
      )}
    </AccordionItem>
  );
};