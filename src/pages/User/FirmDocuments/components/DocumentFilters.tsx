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
 * The search box matches file names only, which is exactly what the backend
 * `search` parameter does.
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
      bg="gray.50"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={3}
    >
      <HStack gap={3} flexWrap="wrap" alignItems="flex-end">
        <Stack gap={1} flex="1" minW={{ base: "100%", md: "240px" }}>
          <Text fontSize="xs" fontWeight={600} color="gray.600">
            Search Documents
          </Text>
          <InputGroup
            startElement={
              <Grid
                placeItems="center"
                boxSize="10"
                color="system.inputGroup.element"
                css={{ "& > svg": { boxSize: "5" } }}
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
              paddingLeft="10 !important"
            />
          </InputGroup>
        </Stack>

        <Stack gap={1} w={{ base: "100%", sm: "170px" }} flexShrink={0}>
          <Text fontSize="xs" fontWeight={600} color="gray.600">
            Status
          </Text>
          <FieldSelect
            value={status}
            onChange={(value) => onStatusChange(value as DocumentStatus | "")}
            ariaLabel="Filter documents by status"
            placeholder="All statuses"
          >
            <option value="PENDING_UPLOAD">Pending Upload</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </FieldSelect>
        </Stack>

        <Stack gap={1} w={{ base: "100%", sm: "170px" }} flexShrink={0}>
          <Text fontSize="xs" fontWeight={600} color="gray.600">
            Visibility
          </Text>
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
        </Stack>

        {actions}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            flexShrink={0}
          >
            <X size={16} /> Clear Filters
          </Button>
        )}
      </HStack>
    </Box>
  );
};
