import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { FileX } from "lucide-react";

interface AuditLogsEmptyStateProps {
  hasFilters: boolean;
  onResetFilters: () => void;
}

export const AuditLogsEmptyState = ({
  hasFilters,
  onResetFilters,
}: AuditLogsEmptyStateProps) => {
  return (
    <Stack align="center" justify="center" py={12} gap={4}>
      <Box bg="gray.50" borderRadius="full" p={6} mb={2}>
        <FileX size={48} color="gray.400" />
      </Box>
      <Text textStyle="heading_6" color="gray.700">
        No Audit Logs Found
      </Text>
      <Text
        textStyle="paragraph_regular"
        color="gray.500"
        textAlign="center"
        maxW="400px"
      >
        {hasFilters
          ? "There are no audit activities matching the selected filters."
          : "There are no audit activities recorded yet."}
      </Text>
      {hasFilters && (
        <Button variant="outline" onClick={onResetFilters} mt={2}>
          Reset Filters
        </Button>
      )}
    </Stack>
  );
};
