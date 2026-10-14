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
import { ChangeEvent } from "react";

import { FieldSelect } from "@/pages/User/CaseManagement/components/ui";
import { InputGroup } from "@/shared/components/ui";

export interface ClientDocumentFilterOption {
  value: string;
  label: string;
}

interface ClientDocumentsFiltersProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  matterNumber: string;
  onMatterChange: (value: string) => void;
  matterOptions: ClientDocumentFilterOption[];
  projectCode: string;
  onProjectChange: (value: string) => void;
  projectOptions: ClientDocumentFilterOption[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

/**
 * Search + filter toolbar. The search box matches file names only — that is
 * exactly what the backend `search` parameter does, so no fake client-side
 * matching over matters/projects is attempted here.
 */
export const ClientDocumentsFilters = ({
  searchInput,
  onSearchInputChange,
  matterNumber,
  onMatterChange,
  matterOptions,
  projectCode,
  onProjectChange,
  projectOptions,
  hasActiveFilters,
  onClearFilters,
}: ClientDocumentsFiltersProps) => {
  return (
    <Box
      bg="gray.50"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={3}
    >
      <HStack gap={3} flexWrap="wrap" alignItems="flex-end">
        <Stack gap={1} flex="1" minW={{ base: "100%", md: "260px" }}>
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

        <Stack gap={1} w={{ base: "100%", sm: "190px" }} flexShrink={0}>
          <Text fontSize="xs" fontWeight={600} color="gray.600">
            Matter
          </Text>
          <FieldSelect
            value={matterNumber}
            onChange={onMatterChange}
            ariaLabel="Filter documents by matter"
            placeholder="All matters"
          >
            {matterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FieldSelect>
        </Stack>

        <Stack gap={1} w={{ base: "100%", sm: "190px" }} flexShrink={0}>
          <Text fontSize="xs" fontWeight={600} color="gray.600">
            Project
          </Text>
          <FieldSelect
            value={projectCode}
            onChange={onProjectChange}
            ariaLabel="Filter documents by project"
            placeholder="All projects"
          >
            {projectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FieldSelect>
        </Stack>

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
