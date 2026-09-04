import {
  Badge,
  Box,
  Button,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { History } from "lucide-react";
import { AuditLog } from "../types";
import { AuditLogActionBadge } from "./AuditLogActionBadge";
import { formatAuditDate, formatEntityTypeLabel } from "../utils";
import {
  DrawerRoot,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerCloseTrigger,
} from "@/shared/components/ui/Drawer";
import { CloseButton } from "@/shared/components/ui/CloseButton";
import { Tooltip } from "@/shared/components/ui/Tooltip";

interface AuditLogDetailsDrawerProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
  /** When provided, a "View Entity History" action is shown for logs that carry an entity. */
  onViewEntityHistory?: (log: AuditLog) => void;
}

const DetailRow = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) => (
  <HStack gap={2} align="start">
    <Text fontSize="xs" color="gray.600" minW="110px">
      {label}
    </Text>
    {mono ? (
      <Tooltip content={String(value)} disabled={!value}>
        <Text
          fontSize="xs"
          color="gray.700"
          fontFamily="mono"
          maxW="260px"
          truncate={true}
        >
          {value || "—"}
        </Text>
      </Tooltip>
    ) : (
      <Box fontSize="xs" color="gray.700">
        {value || "—"}
      </Box>
    )}
  </HStack>
);

export const AuditLogDetailsDrawer = ({
  log,
  isOpen,
  onClose,
  onViewEntityHistory,
}: AuditLogDetailsDrawerProps) => {
  if (!log) return null;

  const { date, time } = formatAuditDate(log.createdAt);

  return (
    <DrawerRoot open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <HStack justify="space-between" align="center">
            <DrawerTitle>Audit Log Details</DrawerTitle>
            <DrawerCloseTrigger asChild>
              <CloseButton />
            </DrawerCloseTrigger>
          </HStack>
        </DrawerHeader>
        <DrawerBody>
          <VStack gap={6} align="stretch">
            {/* Action and Summary */}
            <Box>
              <Text fontSize="xs" color="gray.500" mb={2}>
                Action
              </Text>
              <AuditLogActionBadge action={log.action} />
            </Box>

            {/* Summary */}
            <Box>
              <Text fontSize="xs" color="gray.500" mb={2}>
                Summary
              </Text>
              <Text fontSize="sm" color="gray.700">
                {log.summary}
              </Text>
            </Box>

            {/* Timestamp */}
            <Box>
              <Text fontSize="xs" color="gray.500" mb={2}>
                Timestamp
              </Text>
              <HStack gap={2}>
                <Text fontSize="sm" color="gray.700" fontWeight="500">
                  {date}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  at
                </Text>
                <Text fontSize="sm" color="gray.700" fontWeight="500">
                  {time}
                </Text>
              </HStack>
            </Box>

            {/* Entity Information */}
            <Box>
              <Text fontSize="xs" color="gray.500" mb={2}>
                Entity Information
              </Text>
              <VStack align="start" gap={2}>
                <HStack gap={2}>
                  <Text fontSize="xs" color="gray.600" minW="110px">
                    Entity Type:
                  </Text>
                  <Badge
                    bg="gray.100"
                    color="gray.700"
                    px="2"
                    py="1"
                    borderRadius="md"
                    fontSize="xs"
                    fontWeight="500"
                  >
                    {formatEntityTypeLabel(log.entityType)}
                  </Badge>
                </HStack>
                <DetailRow label="Entity ID:" value={log.entityId} mono />
              </VStack>
            </Box>

            {/* User Information */}
            <Box>
              <Text fontSize="xs" color="gray.500" mb={2}>
                User Information
              </Text>
              <VStack align="start" gap={2}>
                <DetailRow label="User Type:" value={log.userType} />
                <DetailRow label="User ID:" value={log.userId} mono />
              </VStack>
            </Box>

            {/* System Information */}
            <Box>
              <Text fontSize="xs" color="gray.500" mb={2}>
                System Information
              </Text>
              <VStack align="start" gap={2}>
                <DetailRow label="Firm ID:" value={log.firmId} mono />
                {log.ipAddress && (
                  <DetailRow label="IP Address:" value={log.ipAddress} />
                )}
              </VStack>
            </Box>

            {/* View history */}
            {onViewEntityHistory && log.entityId && (
              <Button
                variant="outline"
                size="sm"
                alignSelf="flex-start"
                onClick={() => onViewEntityHistory(log)}
              >
                <HStack gap={2}>
                  <History size={14} />
                  <Text>View Entity History</Text>
                </HStack>
              </Button>
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};
