import { Box, Stack, Text } from "@chakra-ui/react";
import { AuditLog } from "../types";
import { AuditLogTimelineItem } from "./AuditLogTimelineItem";

interface AuditLogDateGroupProps {
  dateLabel: string;
  logs: AuditLog[];
  onViewDetails: (log: AuditLog) => void;
}

export const AuditLogDateGroup = ({ dateLabel, logs, onViewDetails }: AuditLogDateGroupProps) => {
  return (
    <Stack gap={4}>
      {/* Date header */}
      <Text fontSize="sm" fontWeight="600" color="gray.700" py={2}>
        {dateLabel}
      </Text>

      {/* Timeline items */}
      <Stack gap={4} pl={2}>
        {logs.map((log, index) => (
          <AuditLogTimelineItem
            key={log.id}
            log={log}
            isLast={index === logs.length - 1}
            onViewDetails={onViewDetails}
          />
        ))}
      </Stack>
    </Stack>
  );
};
