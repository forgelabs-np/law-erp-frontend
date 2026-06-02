import { Box, HStack, Text } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

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
}: SidebarItemProps & { isCollapsed?: boolean }) => {
  const location = useLocation();

  const active = location.pathname === href;

  if (href) {
    return (
      <Link
        to={href}
        style={{
          width: "100%",
          textDecoration: "none",
        }}
      >
        <LinkItem name={name} icon={icon} isChild={isChild} isActive={active} isCollapsed={isCollapsed} />
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

      {!isCollapsed && <Text fontSize="sm" fontWeight={isActive ? "600" : "400"}>{name}</Text>}
    </HStack>
  );
};

export const SidebarItem = (props: SidebarItemProps & { isCollapsed?: boolean }) => {
  const subItems = props.subItems;
  const hasSubItems = Array.isArray(subItems);

  return (
    <AccordionItem value={props.name} borderWidth="0">
      <AccordionItemTrigger hasIndicator={hasSubItems} py="0" cursor="pointer">
        <LinkItem {...props} />
      </AccordionItemTrigger>

      {hasSubItems && (
        <AccordionItemContent py="0">
          {props.subItems?.map((subItem) => (
            <LinkItem key={subItem.name} {...subItem} isChild />
          ))}
        </AccordionItemContent>
      )}
    </AccordionItem>
  );
};
