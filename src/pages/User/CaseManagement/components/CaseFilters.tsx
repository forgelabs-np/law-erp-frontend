import { Button, HStack, Stack, Text, VStack } from "@chakra-ui/react";

import {
  CaseFilters as CaseFiltersType,
  CaseStage,
  CaseStatus,
  CaseType,
} from "../types/case.types";
import { getAllStages } from "../utils/stageTransitions";

interface CaseFiltersProps {
  filters: CaseFiltersType;
  onFiltersChange: (filters: CaseFiltersType) => void;
  onClearFilters: () => void;
}

export const CaseFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
}: CaseFiltersProps) => {
  const updateFilter = (key: keyof CaseFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  const availableStages = filters.caseType
    ? getAllStages(filters.caseType)
    : getAllStages();

  return (
    <VStack align="stretch" gap={4} p={4} bg="gray.50" borderRadius="lg">
      <HStack justifyContent="space-between" align="center">
        <Text fontWeight="600" fontSize="sm">
          Filters
        </Text>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            colorScheme="blue"
          >
            Clear Filters
          </Button>
        )}
      </HStack>

      <Stack gap={3}>
        <VStack align="stretch" gap={1}>
          <Text fontSize="xs" color="gray.600">
            Case Type
          </Text>
          <select
            value={filters.caseType || ""}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              updateFilter("caseType", e.target.value || undefined)
            }
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
            }}
          >
            <option value="">All Types</option>
            <option value="CIVIL">Civil</option>
            <option value="CRIMINAL">Criminal</option>
          </select>
        </VStack>

        <VStack align="stretch" gap={1}>
          <Text fontSize="xs" color="gray.600">
            Stage
          </Text>
          <select
            value={filters.caseStage || ""}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              updateFilter("caseStage", e.target.value || undefined)
            }
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
            }}
          >
            <option value="">All Stages</option>
            {availableStages.map((stage) => (
              <option key={stage} value={stage}>
                {stage.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </VStack>

        <VStack align="stretch" gap={1}>
          <Text fontSize="xs" color="gray.600">
            Status
          </Text>
          <select
            value={filters.status || ""}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              updateFilter("status", e.target.value || undefined)
            }
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
            }}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="CLOSED">Closed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </VStack>

        <VStack align="stretch" gap={1}>
          <Text fontSize="xs" color="gray.600">
            Court Name
          </Text>
          <input
            type="text"
            placeholder="Search court name..."
            value={filters.courtName || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFilter("courtName", e.target.value || undefined)
            }
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
            }}
          />
        </VStack>

        <VStack align="stretch" gap={1}>
          <Text fontSize="xs" color="gray.600">
            Search
          </Text>
          <input
            type="text"
            placeholder="Search by title, case number..."
            value={filters.search || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFilter("search", e.target.value || undefined)
            }
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
            }}
          />
        </VStack>

        <HStack gap={2}>
          <VStack align="stretch" gap={1} flex={1}>
            <Text fontSize="xs" color="gray.600">
              Date From
            </Text>
            <input
              type="date"
              value={filters.dateFrom || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFilter("dateFrom", e.target.value || undefined)
              }
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
              }}
            />
          </VStack>

          <VStack align="stretch" gap={1} flex={1}>
            <Text fontSize="xs" color="gray.600">
              Date To
            </Text>
            <input
              type="date"
              value={filters.dateTo || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFilter("dateTo", e.target.value || undefined)
              }
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
              }}
            />
          </VStack>
        </HStack>
      </Stack>
    </VStack>
  );
};
