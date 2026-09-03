import {
  Box,
  Button,
  HStack,
  Input,
  NativeSelect,
  Stack,
} from "@chakra-ui/react";
import { Search, X } from "lucide-react";
import { InvoiceListParams, InvoiceStatus } from "@/shared/types/invoice";

interface InvoiceFiltersProps {
  filters: InvoiceListParams;
  onFilterChange: (field: string, value: string) => void;
  onReset: () => void;
}

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "SENT", label: "Sent" },
  { value: "PAID", label: "Paid" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "CANCELED", label: "Canceled" },
];

export const InvoiceFilters = ({
  filters,
  onFilterChange,
  onReset,
}: InvoiceFiltersProps) => {
  const hasFilters = !!(filters.search || filters.status || filters.firmId);

  return (
    <Stack
      bg="white"
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.200"
      p={4}
    >
      <HStack flexWrap="wrap" gap={3} alignItems="flex-end">
        {/* Search */}
        <Stack gap={1} flex={1} minW="200px">
          <Input
            placeholder="Search invoice number or firm..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
            size="sm"
            borderRadius="lg"
            borderColor="gray.200"
          />
        </Stack>

        {/* Status Filter */}
        <Box minW="160px">
          <NativeSelect.Root size="sm">
            <NativeSelect.Field
              bg="white"
              borderRadius="lg"
              borderColor="gray.200"
              value={filters.status || ""}
              onChange={(e) => onFilterChange("status", e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>

        {/* Clear Filters */}
        {hasFilters && (
          <Button
            size="sm"
            variant="ghost"
            colorScheme="gray"
            onClick={onReset}
            flexShrink={0}
          >
            <X size={14} /> Clear
          </Button>
        )}
      </HStack>
    </Stack>
  );
};
