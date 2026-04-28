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
}: SidebarItemProps) => {
  const location = useLocation();

  const active = location.pathname === href;

  if (href) {
    return (
      <Link
        to={href}
        style={{
          width: "100%",
        }}
      >
        <LinkItem name={name} icon={icon} isChild={isChild} isActive={active} />
      </Link>
    );
  }

  return (
    <HStack
      px="6"
      py="2"
      pl={isChild ? "8" : undefined}
      userSelect="none"
      width="full"
      _hover={{
        background: !isActive ? "gray.200" : undefined,
      }}
      background={isActive ? "blue.500" : undefined}
      color={isActive ? "white" : "gray.700"}
    >
      <Box
        css={{
          "&>svg": {
            width: 5,
            height: 5,
          },
        }}
      >
        {icon}
      </Box>

      <Text>{name}</Text>
    </HStack>
  );
};

export const SidebarItem = (props: SidebarItemProps) => {
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
