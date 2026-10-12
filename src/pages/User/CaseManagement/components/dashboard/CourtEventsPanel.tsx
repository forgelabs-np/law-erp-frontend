import {
  Badge,
  Box,
  Button,
  HStack,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ArrowRight, CalendarDays, CalendarOff, Clock } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

import { TodayEvent } from "../../types/dashboard.types";
import { CourtEventType } from "../../types/matter.types";
import {
  courtEventTypeLabel,
  formatDate,
  formatTime,
} from "../../utils/matterHelpers";

interface CourtEventsPanelProps {
  events: TodayEvent[];
  isLoading?: boolean;
}

export const CourtEventsPanel = ({
  events,
  isLoading = false,
}: CourtEventsPanelProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="xl"
        p={5}
        boxShadow="0 1px 3px rgba(0, 0, 0, 0.03)"
      >
        <Stack gap={3}>
          <Skeleton h="18px" w="130px" borderRadius="md" />
          <Skeleton h="50px" w="100%" borderRadius="lg" />
          <Skeleton h="50px" w="100%" borderRadius="lg" />
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={5}
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.03)"
      w="100%"
      minW={0}
    >
      {/* Header */}
      <HStack justify="space-between" align="center" mb={3.5}>
        <HStack gap={2} align="center">
          <Box
            w="26px"
            h="26px"
            borderRadius="md"
            bg="purple.50"
            color="purple.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CalendarDays size={14} />
          </Box>
          <Text fontSize="sm" fontWeight="700" color="gray.900">
            Court Events
          </Text>
          {events.length > 0 && (
            <Badge
              colorPalette="purple"
              variant="subtle"
              size="xs"
              borderRadius="full"
            >
              {events.length}
            </Badge>
          )}
        </HStack>

        <Button
          variant="ghost"
          size="xs"
          color="gray.500"
          _hover={{ color: "primary.600", bg: "transparent" }}
          onClick={() => navigate("/task-calendar")}
          p={0}
          h="auto"
          fontSize="xs"
        >
          Calendar
          <ArrowRight size={12} />
        </Button>
      </HStack>

      {/* Events List or Compact Empty State */}
      {events.length === 0 ? (
        <Box
          py={6}
          px={3}
          bg="gray.50"
          border="1px dashed"
          borderColor="gray.200"
          borderRadius="lg"
          textAlign="center"
        >
          <Box
            w="8"
            h="8"
            borderRadius="full"
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mx="auto"
            mb={2}
            color="gray.400"
          >
            <CalendarOff size={15} />
          </Box>
          <Text fontSize="xs" fontWeight="600" color="gray.700" mb={0.5}>
            No events scheduled for today
          </Text>
          <Text fontSize="11px" color="gray.500">
            Hearings scheduled for today will appear here.
          </Text>
        </Box>
      ) : (
        <Stack gap={2.5}>
          {events.map((event) => {
            const timeStr =
              formatTime(event.scheduledTime) || formatDate(event.scheduledDate);

            return (
              <Box
                key={event.eventId}
                p={3}
                bg="purple.50"
                border="1px solid"
                borderColor="purple.100"
                borderRadius="lg"
                cursor="pointer"
                onClick={() => navigate(`/cases/${event.matterNumber}`)}
                _hover={{ borderColor: "purple.300", bg: "purple.100" }}
                transition="all 0.15s ease"
              >
                <HStack justify="space-between" align="flex-start" mb={1}>
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color="gray.900"
                    lineClamp={1}
                    flex={1}
                  >
                    {event.matterTitle}
                  </Text>
                  <Badge
                    colorPalette="purple"
                    size="xs"
                    fontSize="10px"
                    fontWeight="700"
                    borderRadius="md"
                    px={1.5}
                  >
                    {courtEventTypeLabel(event.eventType as CourtEventType)}
                  </Badge>
                </HStack>

                <HStack justify="space-between" align="center" fontSize="11px" color="gray.600">
                  <HStack gap={1} color="purple.700" fontWeight="500">
                    <Clock size={11} />
                    <Text>{timeStr}</Text>
                  </HStack>
                  <Text color="gray.500" fontFamily="monospace">
                    {event.matterNumber}
                  </Text>
                </HStack>

                {(event.courtRoom || event.judgeName) && (
                  <Text fontSize="10px" color="gray.500" mt={1}>
                    {[
                      event.courtRoom ? `Room ${event.courtRoom}` : null,
                      event.judgeName ? `Judge ${event.judgeName}` : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </Text>
                )}
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};
