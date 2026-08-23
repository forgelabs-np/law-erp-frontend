import { Box, Button, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import {
  ArrowDown,
  ArrowRight,
  CalendarPlus,
  CheckCircle2,
} from "lucide-react";
import { useMemo } from "react";

import { CourtEvent } from "../types/matter.types";
import {
  formatDate,
  formatTime,
  outcomeTypeLabel,
} from "../utils/matterHelpers";
import { CourtEventStatusBadge, CourtEventTypeBadge } from "./MatterBadges";

interface CourtCaseEventsProps {
  events: CourtEvent[];
  isLoading?: boolean;
  onView: (event: CourtEvent) => void;
  onSchedule: () => void;
}

const compareEvents = (a: CourtEvent, b: CourtEvent) => {
  const dateCompare = a.scheduledDate.localeCompare(b.scheduledDate);
  if (dateCompare !== 0) return dateCompare;
  return (a.scheduledTime ?? "").localeCompare(b.scheduledTime ?? "");
};

/**
 * Chronological case diary. Held/adjourned events are visually linked to the
 * next scheduled event so the Tarik/Peshi chain stays obvious.
 */
export const CourtCaseEvents = ({
  events,
  isLoading = false,
  onView,
  onSchedule,
}: CourtCaseEventsProps) => {
  const sorted = useMemo(() => [...events].sort(compareEvents), [events]);

  const upcoming = useMemo(
    () =>
      sorted
        .filter(
          (event) =>
            event.status === "SCHEDULED" &&
            new Date(event.scheduledDate) >= new Date(new Date().toDateString())
        )
        .sort(compareEvents),
    [sorted]
  );

  const previous = useMemo(
    () =>
      sorted
        .filter(
          (event) =>
            event.status !== "SCHEDULED" ||
            new Date(event.scheduledDate) < new Date(new Date().toDateString())
        )
        .sort((a, b) => -compareEvents(a, b)),
    [sorted]
  );

  if (isLoading) {
    return (
      <VStack gap={3} align="stretch">
        {[...Array(3)].map((_, i) => (
          <Box key={i} h="80px" bg="gray.100" borderRadius="md" />
        ))}
      </VStack>
    );
  }

  if (events.length === 0) {
    return (
      <Box py={10} textAlign="center">
        <Text fontSize="sm" color="gray.500">
          No court events yet. Schedule the first Tarik/Peshi.
        </Text>
        <Button mt={4} variant="outline" size="sm" onClick={onSchedule}>
          <CalendarPlus size={16} /> Schedule Event
        </Button>
      </Box>
    );
  }

  const renderEvent = (
    event: CourtEvent,
    index: number,
    list: CourtEvent[]
  ) => {
    const isNextInChain =
      event.status === "HELD" && event.nextEventId
        ? list.some((e) => e.id === event.nextEventId)
        : false;

    return (
      <Box key={event.id}>
        <Box
          p={4}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          cursor="pointer"
          onClick={() => onView(event)}
          _hover={{ borderColor: "blue.300", boxShadow: "sm" }}
          transition="all 0.15s ease"
        >
          <HStack
            justify="space-between"
            align="flex-start"
            flexWrap="wrap"
            gap={2}
          >
            <Stack gap={1}>
              <HStack gap={2} flexWrap="wrap">
                <CourtEventTypeBadge type={event.eventType} />
                <CourtEventStatusBadge status={event.status} />
                {event.outcomeType && (
                  <Text fontSize="xs" color="gray.500">
                    {outcomeTypeLabel(event.outcomeType)}
                  </Text>
                )}
              </HStack>
              <Text fontSize="lg" fontWeight="600" color="gray.900">
                {formatDate(event.scheduledDate)}
              </Text>
            </Stack>
            <Stack gap={1} align="flex-end" textAlign="right">
              {event.scheduledTime && (
                <Text fontSize="sm" color="gray.600">
                  {formatTime(event.scheduledTime)}
                  {event.endTime ? ` – ${formatTime(event.endTime)}` : ""}
                </Text>
              )}
              {event.courtRoom && (
                <Text fontSize="sm" color="gray.600">
                  {event.courtRoom}
                </Text>
              )}
              {event.judgeName && (
                <Text fontSize="xs" color="gray.500">
                  {event.judgeName}
                </Text>
              )}
            </Stack>
          </HStack>

          {event.outcome && (
            <Text fontSize="sm" color="gray.600" mt={2} fontStyle="italic">
              “{event.outcome}”
            </Text>
          )}
        </Box>

        {isNextInChain && (
          <HStack gap={1} color="green.600" py={1} pl={6}>
            <ArrowDown size={14} />
            <Text fontSize="xs" fontWeight="600">
              Next date given by the court
            </Text>
          </HStack>
        )}
      </Box>
    );
  };

  return (
    <VStack align="stretch" gap={6}>
      {upcoming.length > 0 && (
        <Stack gap={3}>
          <HStack gap={2}>
            <ArrowRight size={16} color="#2563eb" />
            <Text fontSize="sm" fontWeight="700" color="blue.700">
              Upcoming
            </Text>
          </HStack>
          {upcoming.map((event, index) => renderEvent(event, index, upcoming))}
        </Stack>
      )}

      {previous.length > 0 && (
        <Stack gap={3}>
          <HStack gap={2}>
            <CheckCircle2 size={16} color="#6b7280" />
            <Text fontSize="sm" fontWeight="700" color="gray.600">
              Previous Events
            </Text>
          </HStack>
          {previous.map((event, index) => renderEvent(event, index, previous))}
        </Stack>
      )}

      <Button
        variant="outline"
        size="sm"
        alignSelf="flex-start"
        onClick={onSchedule}
      >
        <CalendarPlus size={16} /> Schedule Event
      </Button>
    </VStack>
  );
};
