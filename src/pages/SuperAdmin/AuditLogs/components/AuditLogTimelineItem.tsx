import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { AuditLog } from "../types";
import { AuditLogEventCard } from "./AuditLogEventCard";
import { AuditLogIcon } from "./AuditLogIcon";
import { formatAuditDate, getAuditActionStyle } from "../utils";

interface AuditLogTimelineItemProps {
  log: AuditLog;
  isLast: boolean;
  onViewDetails: (log: AuditLog) => void;
}

export const AuditLogTimelineItem = ({
  log,
  isLast,
  onViewDetails,
}: AuditLogTimelineItemProps) => {
  const { time } = formatAuditDate(log.createdAt);
  const style = getAuditActionStyle(log.action);

  return (
    <HStack
      align="start"
      gap={4}
      position="relative"
      flexDirection={{ base: "column", md: "row" }}
    >
      {/* Time column */}
      <Text
        fontSize="xs"
        color="gray.500"
        fontWeight="500"
        minW={{ base: "auto", md: "60px" }}
        textAlign={{ base: "left", md: "right" }}
      >
        {time}
      </Text>

      {/* Timeline connector and node */}
      <Box
        position="relative"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {/* Vertical connector line */}
        {!isLast && (
          <Box
            position="absolute"
            top="20px"
            left="50%"
            transform="translateX(-50%)"
            width="2px"
            height="calc(100% + 16px)"
            bg="gray.200"
            zIndex={0}
            display={{ base: "none", md: "block" }}
          />
        )}

        {/* Timeline node */}
        <Box
          bg={style.background}
          border="2px"
          borderColor={style.color}
          borderRadius="full"
          p="1"
          zIndex={1}
          position="relative"
        >
          <AuditLogIcon action={log.action} size={12} />
        </Box>
      </Box>

      {/* Event card */}
      <Box flex={1} width="100%">
        <AuditLogEventCard log={log} onViewDetails={onViewDetails} />
      </Box>
    </HStack>
  );
};
