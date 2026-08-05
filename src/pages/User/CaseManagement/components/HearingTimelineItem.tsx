import {
  Box,
  HStack,
  Stack,
  Text,
  VStack,
  Badge,
  Button,
} from "@chakra-ui/react";
import { Hearing } from "../types/hearing.types";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, User, Edit2, X } from "lucide-react";
import {
  getHearingStatusColor,
  getHearingTypeBadgeColor,
} from "@/utils/calendarHelpers";

interface HearingTimelineItemProps {
  hearing: Hearing;
  isLast: boolean;
  onViewDetails: (hearing: Hearing) => void;
  onEdit: (hearing: Hearing) => void;
  onCancel: (hearingId: string) => void;
}

export const HearingTimelineItem = ({
  hearing,
  isLast,
  onViewDetails,
  onEdit,
  onCancel,
}: HearingTimelineItemProps) => {
  const time = hearing.time;
  const statusColor = getHearingStatusColor(hearing.status);

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
          bg="white"
          border="2px"
          borderColor={statusColor}
          borderRadius="full"
          p="1"
          zIndex={1}
          position="relative"
        >
          <Box w="3" h="3" borderRadius="full" bg={statusColor} />
        </Box>
      </Box>

      {/* Hearing card */}
      <Box flex={1} width="100%">
        <Box
          p={4}
          bg="white"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
          _hover={{ bg: "gray.50", transition: "all 0.2s ease" }}
        >
          <VStack align="stretch" gap={3}>
            {/* Status and Type Badges */}
            <HStack gap={2} flexWrap="wrap">
              <Badge
                bg={statusColor}
                color="white"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight="600"
              >
                {hearing.status}
              </Badge>
              <Badge
                colorScheme={getHearingTypeBadgeColor(hearing.hearingType)}
                px={3}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight="600"
              >
                {hearing.hearingType.replace("_", " ")}
              </Badge>
            </HStack>

            {/* Title */}
            <Text fontSize="base" fontWeight="600" color="gray.900">
              {hearing.title}
            </Text>

            {/* Details */}
            <HStack gap={4} color="gray.600" fontSize="sm">
              <HStack gap={2}>
                <Calendar size={14} />
                <Text>{format(new Date(hearing.date), "MMM d, yyyy")}</Text>
              </HStack>
              <HStack gap={2}>
                <Clock size={14} />
                <Text>
                  {hearing.time} - {hearing.endTime}
                </Text>
              </HStack>
              <HStack gap={2}>
                <MapPin size={14} />
                <Text>{hearing.courtRoom}</Text>
              </HStack>
            </HStack>

            {hearing.judgeName && (
              <HStack gap={2} color="gray.600" fontSize="sm">
                <User size={14} />
                <Text>Judge: {hearing.judgeName}</Text>
              </HStack>
            )}

            {hearing.notes && (
              <Text fontSize="sm" color="gray.500" fontStyle="italic">
                {hearing.notes}
              </Text>
            )}

            {/* Actions */}
            <HStack gap={2} justify="flex-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(hearing)}
              >
                View
              </Button>
              {hearing.status === "SCHEDULED" && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(hearing)}
                  >
                    <Edit2 size={14} style={{ marginRight: 4 }} />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    colorScheme="red"
                    onClick={() => onCancel(hearing.id)}
                  >
                    <X size={14} style={{ marginRight: 4 }} />
                    Cancel
                  </Button>
                </>
              )}
            </HStack>
          </VStack>
        </Box>
      </Box>
    </HStack>
  );
};
