import { HStack, Stack, Text } from "@chakra-ui/react";

interface AuditLogsHeaderProps {
  onExport?: () => void;
}

export const AuditLogsHeader = ({ onExport }: AuditLogsHeaderProps) => {
  return (
    <Stack gap={2}>
      <Text textStyle="heading_4">Audit Logs</Text>
      <Text textStyle="paragraph_regular" color="gray.500">
        Track and monitor all system activities
      </Text>
    </Stack>
  );
};
