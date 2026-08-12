import { Badge, Box, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { AuditLog } from "../types";
import { AuditLogActionBadge } from "./AuditLogActionBadge";
import { formatAuditDate } from "../utils";
import {
  DrawerRoot,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerCloseTrigger,
} from "@/shared/components/ui/Drawer";
import { CloseButton } from "@/shared/components/ui/CloseButton";

interface AuditLogDetailsDrawerProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogDetailsDrawer = ({
  log,
  isOpen,
  onClose,
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
                User Information
              </Text>
              <VStack align="start" gap={2}>
                <HStack gap={2}>
                  <Text fontSize="xs" color="gray.600" minW="100px">
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
                    {log.entityType}
                  </Badge>
                </HStack>
                {/* <HStack gap={2}>
                  <Text fontSize="xs" color="gray.600" minW="100px">
                    Entity ID:
                  </Text>
                  <Text fontSize="xs" color="gray.700" fontFamily="mono">
                    {log.entityId}
                  </Text>
                </HStack> */}
              </VStack>
            </Box>

            {/* User Information */}
            <Box>
              <VStack align="start" gap={2}>
                <HStack gap={2}>
                  <Text fontSize="xs" color="gray.600" minW="100px">
                    User Type:
                  </Text>
                  <Text fontSize="xs" color="gray.700">
                    {log.userType}
                  </Text>
                </HStack>
              </VStack>
            </Box>

            {/* System Information */}
            {/* <Box>
              <Text fontSize="xs" color="gray.500" mb={2}>
                System Information
              </Text>
              <VStack align="start" gap={2}>
                <HStack gap={2}>
                  <Text fontSize="xs" color="gray.600" minW="100px">
                    Firm ID:
                  </Text>
                  <Text fontSize="xs" color="gray.700" fontFamily="mono">
                    {log.firmId}
                  </Text>
                </HStack>
                {log.ipAddress && (
                  <HStack gap={2}>
                    <Text fontSize="xs" color="gray.600" minW="100px">
                      IP Address:
                    </Text>
                    <Text fontSize="xs" color="gray.700" fontFamily="mono">
                      {log.ipAddress}
                    </Text>
                  </HStack>
                )}
              </VStack>
            </Box> */}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};
