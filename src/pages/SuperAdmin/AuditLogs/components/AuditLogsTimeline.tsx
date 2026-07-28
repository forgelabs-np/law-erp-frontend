import { Stack } from "@chakra-ui/react";
import { AuditLog } from "../types";
import { AuditLogDateGroup } from "./AuditLogDateGroup";
import { groupAuditLogsByDate } from "../utils";

interface AuditLogsTimelineProps {
  logs: AuditLog[];
  onViewDetails: (log: AuditLog) => void;
}

export const AuditLogsTimeline = ({ logs, onViewDetails }: AuditLogsTimelineProps) => {
  const groupedLogs = groupAuditLogsByDate(logs);

  return (
    <Stack gap={8}>
      {Object.entries(groupedLogs).map(([dateLabel, dateLogs]) => (
        <AuditLogDateGroup
          key={dateLabel}
          dateLabel={dateLabel}
          logs={dateLogs}
          onViewDetails={onViewDetails}
        />
      ))}
    </Stack>
  );
};
