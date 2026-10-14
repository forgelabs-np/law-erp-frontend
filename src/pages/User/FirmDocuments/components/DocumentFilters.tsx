import {
  Box,
  Button,
  Grid,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Search, X } from "lucide-react";
import { ChangeEvent, ReactNode } from "react";

import { FieldSelect } from "@/pages/User/CaseManagement/components/ui";
import { InputGroup } from "@/shared/components/ui";
import { DocumentStatus, DocumentVisibility } from "@/shared/types/documents";

export interface DocumentFiltersValue {
  status: DocumentStatus | "";
  visibility: DocumentVisibility | "";
}

interface DocumentFiltersProps extends DocumentFiltersValue {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onStatusChange: (value: DocumentStatus | "") => void;
  onVisibilityChange: (value: DocumentVisibility | "") => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  /** Scope-specific action (e.g. the Upload Document button). */
  actions?: ReactNode;
}

/**
 * Search + status + visibility toolbar shared by the firm library and the
 * Matter/Project document tabs. Every filter maps to a server-side query
 * parameter — "All" omits the parameter entirely rather than sending "ALL".
 *
 * Restyled to a clean, elevated white toolbar card matching the CRM design system.
 */
export const DocumentFilters = ({
  searchInput,
  onSearchInputChange,
  status,
  onStatusChange,
  visibility,
  onVisibilityChange,
  hasActiveFilters,
  onClearFilters,
  actions,
}: DocumentFiltersProps) => {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="20px"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.04)"
      p={4}
      w="100%"
    >
      <HStack gap={3} flexWrap="wrap" alignItems="center">
        {/* Search input on the left */}
        <Box flex="1" minW={{ base: "100%", md: "240px" }}>
          <InputGroup
            startElement={
              <Grid
                placeItems="center"
                boxSize="10"
                color="gray.400"
                css={{ "& > svg": { boxSize: "4" } }}
              >
                <Search size={16} />
              </Grid>
            }
          >
            <Input
              placeholder="Search documents by file name..."
              value={searchInput}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onSearchInputChange(event.target.value)
              }
              h="40px"
              borderRadius="10px"
              borderColor="gray.200"
              bg="white"
              fontSize="sm"
              paddingLeft="10 !important"
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px rgba(0, 86, 255, 0.2)",
              }}
            />
          </InputGroup>
        </Box>

        {/* Status dropdown */}
        <Box w={{ base: "100%", sm: "160px" }} flexShrink={0}>
          <FieldSelect
            value={status}
            onChange={(value) => onStatusChange(value as DocumentStatus | "")}
            ariaLabel="Filter documents by status"
            placeholder="All statuses"
          >
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </FieldSelect>
        </Box>

        {/* Visibility dropdown */}
        <Box w={{ base: "100%", sm: "160px" }} flexShrink={0}>
          <FieldSelect
            value={visibility}
            onChange={(value) =>
              onVisibilityChange(value as DocumentVisibility | "")
            }
            ariaLabel="Filter documents by visibility"
            placeholder="All visibility"
          >
            <option value="PRIVATE">Private</option>
            <option value="SHARED">Shared</option>
          </FieldSelect>
        </Box>

        {actions}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            h="40px"
            color="gray.500"
            _hover={{ bg: "gray.100", color: "gray.800" }}
            onClick={onClearFilters}
            flexShrink={0}
          >
            <X size={15} /> Reset
          </Button>
        )}
      </HStack>
    </Box>
  );
};
