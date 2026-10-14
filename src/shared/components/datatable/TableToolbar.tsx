import { Box, Flex, HStack, Input, Text } from "@chakra-ui/react";
import { Search } from "lucide-react";
import React from "react";

import { DatatableSearchProps, TableHeaderProps } from "@/shared/types";
import { InputGroup } from "@/shared/components/ui";

interface TableToolbarProps {
  header?: TableHeaderProps;
  search?: DatatableSearchProps;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  toolbar?: React.ReactNode;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  header,
  search,
  filters,
  actions,
  toolbar,
}) => {
  // If a full custom toolbar was passed, render it directly
  if (toolbar) {
    return (
      <Box
        px={{ base: 4, md: 6 }}
        pt={{ base: 4, md: 5 }}
        pb={{ base: 3, md: 4 }}
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        {toolbar}
      </Box>
    );
  }

  // Derive search configuration from either `search` prop or `header` prop
  const effectiveSearch =
    search ??
    (header?.hasSearch &&
    header?.searchText !== undefined &&
    header?.setSearchText
      ? {
          value: header.searchText,
          onChange: header.setSearchText,
          placeholder: "Search...",
        }
      : undefined);

  const hasSearch = Boolean(effectiveSearch);
  const hasFilters = Boolean(filters);
  const hasActions = Boolean(actions || header?.actionButtonLabel);
  const hasTitle = Boolean(header?.title);

  // If nothing to render in toolbar, return null
  if (!hasSearch && !hasFilters && !hasActions && !hasTitle) {
    return null;
  }

  return (
    <Box
      px={{ base: 4, md: 6 }}
      pt={{ base: 4, md: 5 }}
      pb={{ base: 3, md: 4 }}
      borderBottom="1px solid"
      borderColor="gray.100"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        gap={4}
        w="100%"
      >
        {/* Left side: Search input (takes flexible space) or Title */}
        <Flex
          align="center"
          gap={3}
          flex={{ base: "1", md: hasFilters ? "1" : "0 1 380px" }}
          minW={{ base: "100%", md: "260px" }}
          maxW={{ base: "100%", lg: hasFilters ? "480px" : "420px" }}
        >
          {hasTitle && !hasSearch && (
            <Text
              fontWeight="600"
              fontSize="md"
              color="gray.800"
              letterSpacing="-0.01em"
            >
              {header?.title}
            </Text>
          )}

          {hasSearch && effectiveSearch && (
            <Box flex="1" w="100%">
              <InputGroup
                w="100%"
                startElement={
                  <Box
                    pl={3}
                    color="gray.400"
                    display="flex"
                    alignItems="center"
                  >
                    <Search size={17} />
                  </Box>
                }
              >
                <Input
                  value={effectiveSearch.value}
                  onChange={(e) => effectiveSearch.onChange(e.target.value)}
                  placeholder={
                    effectiveSearch.placeholder ??
                    "Search by name, email, or username..."
                  }
                  bg="white"
                  borderRadius="10px"
                  borderColor="gray.200"
                  height="42px"
                  fontSize="sm"
                  color="gray.800"
                  pl="38px !important"
                  _placeholder={{ color: "gray.400" }}
                  _hover={{ borderColor: "gray.300" }}
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px #3B82F6",
                  }}
                />
              </InputGroup>
            </Box>
          )}
        </Flex>

        {/* Right side: Filter dropdowns and Action buttons */}
        {(hasFilters || hasActions) && (
          <HStack
            gap={3}
            align="center"
            justify={{ base: "flex-start", md: "flex-end" }}
            flexWrap="wrap"
            flexShrink={0}
          >
            {filters}

            {actions}

            {header?.actionButtonLabel && (
              <Box
                as="button"
                onClick={header.onActionButtonClick}
                px={4}
                height="40px"
                borderRadius="10px"
                bg="blue.600"
                color="white"
                fontSize="sm"
                fontWeight="600"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                transition="background-color 0.15s ease"
                _hover={{ bg: "blue.700" }}
              >
                {header.actionButtonLabel}
              </Box>
            )}
          </HStack>
        )}
      </Flex>
    </Box>
  );
};
