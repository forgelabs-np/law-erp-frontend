import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { AlertCircle } from "lucide-react";

interface AuditLogsErrorStateProps {
  onRetry: () => void;
  title?: string;
  description?: string;
}

export const AuditLogsErrorState = ({
  onRetry,
  title = "Failed to Load Audit Logs",
  description = "There was an error loading the audit logs. Please try again.",
}: AuditLogsErrorStateProps) => {
  return (
    <Stack align="center" justify="center" py={12} gap={4}>
      <Box bg="red.50" borderRadius="full" p={6} mb={2}>
        <AlertCircle size={48} color="red.400" />
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
        {description}
      </Text>
      <Button colorScheme="blue" onClick={onRetry} mt={2}>
        Retry
      </Button>
    </Stack>
  );
};
