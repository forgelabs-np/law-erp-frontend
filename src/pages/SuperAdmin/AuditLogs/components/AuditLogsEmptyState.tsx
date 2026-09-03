import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { FileX } from "lucide-react";

interface AuditLogsEmptyStateProps {
  hasFilters: boolean;
  onResetFilters: () => void;
  title?: string;
  /** Shown when no filters are active (default "no data yet" copy). */
  emptyDescription?: string;
  /** Shown when filters are active (default "no matching filters" copy). */
  filteredDescription?: string;
}

export const AuditLogsEmptyState = ({
  hasFilters,
  onResetFilters,
  title = "No Audit Logs Found",
  emptyDescription = "There are no audit activities recorded yet.",
  filteredDescription = "There are no audit activities matching the selected filters.",
}: AuditLogsEmptyStateProps) => {
  return (
    <Stack align="center" justify="center" py={12} gap={4}>
      <Box bg="gray.50" borderRadius="full" p={6} mb={2}>
        <FileX size={48} color="gray.400" />
      </Box>
      <Text textStyle="heading_6" color="gray.700">
        {title}
      </Text>
      <Text
        textStyle="paragraph_regular"
        color="gray.500"
        textAlign="center"
        maxW="400px"
      >
        {hasFilters ? filteredDescription : emptyDescription}
      </Text>
      {hasFilters && (
        <Button variant="outline" onClick={onResetFilters} mt={2}>
          Reset Filters
        </Button>
      )}
    </Stack>
  );
};
