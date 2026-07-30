import {
  Badge,
  Box,
  Button,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChevronRight, User } from "lucide-react";
import { AuditLog } from "../types";
import { AuditLogActionBadge } from "./AuditLogActionBadge";
import { formatAuditDate } from "../utils";
import { Avatar } from "@/shared/components/ui";

interface AuditLogEventCardProps {
  log: AuditLog;
  onViewDetails: (log: AuditLog) => void;
}

export const AuditLogEventCard = ({
  log,
  onViewDetails,
}: AuditLogEventCardProps) => {
  const { time } = formatAuditDate(log.createdAt);

  return (
    <Box
      bg="white"
      border="1px"
      borderColor="gray.200"
      borderRadius="lg"
      p={4}
      boxShadow="sm"
      _hover={{
        boxShadow: "md",
        borderColor: "gray.300",
      }}
      transition="all 0.2s"
    >
      <HStack justify="space-between" align="flex-start" gap={4}>
        <VStack align="start" gap={3} flex={1}>
          {/* Action and Summary */}
          <HStack gap={2} align="center" flexWrap="wrap">
            <AuditLogActionBadge action={log.action} />
            <Text fontSize="sm" color="gray.700" fontWeight="500">
              {log.summary}
            </Text>
          </HStack>

          {/* Metadata */}
          <HStack gap={4} flexWrap="wrap" fontSize="xs" color="gray.500">
            <Text>
              <Text as="span" fontWeight="600" color="gray.600">
                Entity Type:
              </Text>{" "}
              {log.entityType}
            </Text>
            <Text>
              <Text as="span" fontWeight="600" color="gray.600">
                User Type:
              </Text>{" "}
              {log.userType}
            </Text>
            {/* {log.ipAddress && (
              <Text>
                <Text as="span" fontWeight="600" color="gray.600">
                  IP Address:
                </Text>{" "}
                {log.ipAddress}
              </Text>
            )} */}
          </HStack>
        </VStack>

        {/* Right side - User info and View Details */}
        <VStack align="end" gap={2} minW="120px">
          <HStack gap={2} fontSize="xs" color="gray.600">
            {/* <User size={14} />
            <Text fontWeight="500">{log.userType}</Text> */}
            <Avatar
              name={log.userType}
              size={"2xs"}
              // variant="outline"
              // colorScheme="blue"
              bg={log.userType === "S" ? "blue.500" : "green.500"}
              color="white"
            />
          </HStack>
          <Button
            size="xs"
            variant="ghost"
            color="blue.500"
            onClick={() => onViewDetails(log)}
          >
            <HStack gap={1}>
              <Text>View Details</Text>
              <ChevronRight size={14} />
            </HStack>
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
};
