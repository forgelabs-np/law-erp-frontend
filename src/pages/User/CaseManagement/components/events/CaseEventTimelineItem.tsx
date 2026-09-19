import { Box, Center, HStack, Text, VStack } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { ArrowDown, CalendarClock, Clock, Gavel, MapPin } from "lucide-react";

import { CourtEvent } from "../../types/matter.types";
import {
  formatDate,
  formatTime,
  outcomeTypeLabel,
} from "../../utils/matterHelpers";
import { CourtEventStatusBadge, CourtEventTypeBadge } from "../MatterBadges";

interface CaseEventTimelineItemProps {
  event: CourtEvent;
  /** Opens the existing event detail flow. */
  onView: (event: CourtEvent) => void;
  /** Last row in the list: the connector rail terminates here. */
  isLast?: boolean;
  /** Held/adjourned event that produced the next scheduled court date. */
  linksToNext?: boolean;
}

const markerParts = (value: string): { day: string; month: string } => {
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return { day: "--", month: "" };
  return { day: format(date, "dd"), month: format(date, "MMM").toUpperCase() };
};

/**
 * One Tarik/Peshi entry on the Case Diary timeline: a date marker on a
 * connecting rail plus a white detail card.
 *
 * The rail uses a `flex="1"` connector rather than a fixed height, so it stays
 * continuous no matter how tall a row grows from long courtroom or judge names.
 */
export const CaseEventTimelineItem = ({
  event,
  onView,
  isLast = false,
  linksToNext = false,
}: CaseEventTimelineItemProps) => {
  const { day, month } = markerParts(event.scheduledDate);
  const isMuted = event.status === "CANCELED";
  const timeRange = event.scheduledTime
    ? `${formatTime(event.scheduledTime)}${
        event.endTime ? ` – ${formatTime(event.endTime)}` : ""
      }`
    : "";

  return (
    <HStack align="stretch" gap={3}>
      {/* Date marker + connector rail */}
      <VStack gap={0} w="11" flexShrink={0} align="center">
        <Center
          w="11"
          py={2}
          borderRadius="lg"
          border="1px solid"
          borderColor={isMuted ? "gray.200" : "primary.200"}
          bg={isMuted ? "gray.50" : "primary.50"}
          flexDirection="column"
          flexShrink={0}
        >
          <Text
            fontSize="md"
            fontWeight="800"
            lineHeight="1.1"
            color={isMuted ? "gray.400" : "primary.700"}
          >
            {day}
          </Text>
          <Text
            fontSize="10px"
            fontWeight="700"
            letterSpacing="0.06em"
            lineHeight="1.4"
            color={isMuted ? "gray.400" : "primary.500"}
          >
            {month}
          </Text>
        </Center>
        {!isLast && (
          <Box w="2px" flex="1" minH="12px" bg="gray.200" borderRadius="full" />
        )}
      </VStack>

      <Box flex="1" minW={0} pb={isLast ? 0 : 3}>
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          p={4}
          cursor="pointer"
          onClick={() => onView(event)}
          _hover={{ borderColor: "primary.300", boxShadow: "sm" }}
          transition="all 0.15s ease"
          opacity={isMuted ? 0.8 : 1}
        >
          <HStack
            justify="space-between"
            align="flex-start"
            gap={3}
            flexWrap="wrap"
          >
            <HStack gap={2} flexWrap="wrap" minW={0}>
              <CourtEventTypeBadge type={event.eventType} />
              <CourtEventStatusBadge status={event.status} />
            </HStack>

            {timeRange && (
              <HStack gap={1.5} color="gray.600" flexShrink={0}>
                <Clock size={13} />
                <Text fontSize="sm" fontWeight="600">
                  {timeRange}
                </Text>
              </HStack>
            )}
          </HStack>

          <Text
            fontSize="md"
            fontWeight="700"
            color="gray.900"
            mt={2.5}
            lineHeight="1.3"
          >
            {formatDate(event.scheduledDate)}
          </Text>

          {(event.courtRoom || event.judgeName || event.outcomeType) && (
            <HStack gap={4} mt={2} flexWrap="wrap" color="gray.500">
              {event.courtRoom && (
                <HStack gap={1.5} minW={0}>
                  <MapPin size={13} />
                  <Text fontSize="xs" fontWeight="600">
                    {event.courtRoom}
                  </Text>
                </HStack>
              )}
              {event.judgeName && (
                <HStack gap={1.5} minW={0}>
                  <Gavel size={13} />
                  <Text fontSize="xs" fontWeight="600">
                    {event.judgeName}
                  </Text>
                </HStack>
              )}
              {event.outcomeType && (
                <HStack gap={1.5} minW={0}>
                  <CalendarClock size={13} />
                  <Text fontSize="xs" fontWeight="600">
                    {outcomeTypeLabel(event.outcomeType)}
                  </Text>
                </HStack>
              )}
            </HStack>
          )}

          {event.outcome && (
            <Text
              fontSize="sm"
              color="gray.600"
              mt={2.5}
              fontStyle="italic"
              lineHeight="1.55"
            >
              &ldquo;{event.outcome}&rdquo;
            </Text>
          )}
        </Box>

        {linksToNext && (
          <HStack gap={1.5} color="primary.600" pt={2} pl={1}>
            <ArrowDown size={14} />
            <Text fontSize="xs" fontWeight="700">
              Next date given by the court
            </Text>
          </HStack>
        )}
      </Box>
    </HStack>
  );
};
