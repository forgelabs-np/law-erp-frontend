import {
  Badge,
  Box,
  Button,
  HStack,
  Input,
  NativeSelect,
  Text,
} from "@chakra-ui/react";
import { FilterX, Search, X } from "lucide-react";
import React from "react";

import { InputGroup } from "@/shared/components/ui";

interface CasePositioningToolbarProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  totalCount: number;
  filteredCount: number;
}

export const CasePositioningToolbar = ({
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  searchQuery,
  onSearchQueryChange,
  onResetFilters,
  hasActiveFilters,
  totalCount,
  filteredCount,
}: CasePositioningToolbarProps) => {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={{ base: 3, md: 3.5 }}
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.03)"
      w="100%"
      minW={0}
    >
      <HStack
        justify="space-between"
        align="center"
        flexWrap="wrap"
        gap={3}
        w="100%"
      >
        {/* Left Filter & Search Controls */}
        <HStack
          gap={2.5}
          flexWrap="wrap"
          flex={{ base: "1 1 100%", md: "1 1 auto" }}
          minW={0}
        >
          {/* Status Dropdown */}
          <Box
            position="relative"
            minW="120px"
            maxW={{ base: "100%", sm: "140px" }}
          >
            <NativeSelect.Root size="sm" width="100%">
              <NativeSelect.Field
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                aria-label="Filter cases by status"
                fontSize="xs"
                fontWeight="500"
                color="gray.700"
                bg="gray.50"
                borderColor="gray.200"
                borderRadius="lg"
                h="36px"
                _hover={{ borderColor: "gray.300", bg: "white" }}
                _focus={{
                  borderColor: "primary.500",
                  bg: "white",
                  boxShadow: "0 0 0 1px var(--chakra-colors-primary-500)",
                }}
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="DORMANT">Dormant</option>
                <option value="CLOSED">Closed</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Box>

          {/* Type Dropdown */}
          <Box
            position="relative"
            minW="120px"
            maxW={{ base: "100%", sm: "130px" }}
          >
            <NativeSelect.Root size="sm" width="100%">
              <NativeSelect.Field
                value={typeFilter}
                onChange={(e) => onTypeFilterChange(e.target.value)}
                aria-label="Filter cases by type"
                fontSize="xs"
                fontWeight="500"
                color="gray.700"
                bg="gray.50"
                borderColor="gray.200"
                borderRadius="lg"
                h="36px"
                _hover={{ borderColor: "gray.300", bg: "white" }}
                _focus={{
                  borderColor: "primary.500",
                  bg: "white",
                  boxShadow: "0 0 0 1px var(--chakra-colors-primary-500)",
                }}
              >
                <option value="ALL">All Types</option>
                <option value="CIVIL">Civil</option>
                <option value="CRIMINAL">Criminal</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Box>

          {/* Search Input */}
          <Box
            flex={{ base: "1 1 100%", sm: "1 1 200px" }}
            maxW={{ base: "100%", md: "260px" }}
          >
            <InputGroup
              startElement={<Search size={14} color="#9ca3af" />}
              endElement={
                searchQuery ? (
                  <Box
                    as="button"
                    onClick={() => onSearchQueryChange("")}
                    cursor="pointer"
                    p={1}
                    color="gray.400"
                    _hover={{ color: "gray.600" }}
                    display="flex"
                    alignItems="center"
                    aria-label="Clear search"
                  >
                    <X size={12} />
                  </Box>
                ) : undefined
              }
            >
              <Input
                size="sm"
                h="36px"
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                fontSize="xs"
                placeholder="Search cases, ref, court..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                _placeholder={{ color: "gray.400" }}
                _focus={{
                  borderColor: "primary.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-primary-500)",
                }}
              />
            </InputGroup>
          </Box>

          {/* Clear Filters Button (shown only when filters or search are active) */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="xs"
              h="36px"
              px={2.5}
              color="gray.600"
              onClick={onResetFilters}
              _hover={{ bg: "gray.100", color: "gray.900" }}
            >
              <FilterX size={13} />
              Reset
            </Button>
          )}
        </HStack>

        {/* Right Info Count */}
        <HStack gap={2} flexShrink={0}>
          <Badge
            variant="subtle"
            colorPalette="gray"
            px={2.5}
            py={1}
            borderRadius="md"
            fontSize="xs"
            fontWeight="500"
          >
            {hasActiveFilters ? (
              <Text as="span">
                <Text as="span" fontWeight="700">
                  {filteredCount}
                </Text>{" "}
                of {totalCount} cases
              </Text>
            ) : (
              <Text as="span">
                <Text as="span" fontWeight="700">
                  {totalCount}
                </Text>{" "}
                {totalCount === 1 ? "case" : "cases"}
              </Text>
            )}
          </Badge>
        </HStack>
      </HStack>
    </Box>
  );
};
