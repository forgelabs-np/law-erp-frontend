import { Box, Center, HStack, Text, VStack } from "@chakra-ui/react";
import { Calendar, History } from "lucide-react";
import { useMemo } from "react";

import { CourtEvent, CourtEventStatus } from "../../types/matter.types";
import {
  formatDate,
  formatTime,
  outcomeTypeLabel,
} from "../../utils/matterHelpers";
import { CourtEventStatusBadge, CourtEventTypeBadge } from "../MatterBadges";
import { OverviewCard } from "./OverviewCard";

interface CaseHearingHistoryProps {
  events: CourtEvent[];
  isLoading?: boolean;
  /** Opens the existing event detail modal. */
  onViewEvent?: (event: CourtEvent) => void;
}

/** Most recent hearings shown before the list is trimmed for readability. */
const VISIBLE_LIMIT = 8;

const markerColor = (status: CourtEventStatus): string => {
  switch (status) {
    case "HELD":
      return "green.400";
    case "SCHEDULED":
      return "primary.500";
    case "ADJOURNED":
      return "orange.400";
    case "CANCELED":
      return "gray.300";
    default:
      return "gray.300";
  }
};

const compareDesc = (a: CourtEvent, b: CourtEvent) =>
  b.scheduledDate.localeCompare(a.scheduledDate) ||
  (b.scheduledTime ?? "").localeCompare(a.scheduledTime ?? "");

/**
 * Compact procedural timeline of the hearings recorded on this court case.
 * Read-only presentation of the events already loaded by the page.
 */
export const CaseHearingHistory = ({
  events,
  isLoading = false,
  onViewEvent,
}: CaseHearingHistoryProps) => {
  const ordered = useMemo(() => [...events].sort(compareDesc), [events]);

  const visible = ordered.slice(0, VISIBLE_LIMIT);
  const hiddenCount = ordered.length - visible.length;

  return (
    <OverviewCard
      title="Hearing History"
      description="Recorded Tarikh / Peshi proceedings on this court case."
      icon={History}
    >
      {isLoading ? (
        <VStack gap={3} align="stretch">
          {[...Array(3)].map((_, index) => (
            <Box key={index} h="56px" bg="gray.100" borderRadius="md" />
          ))}
        </VStack>
      ) : visible.length === 0 ? (
        <Center flexDirection="column" gap={2} py={8}>
          <Center
            w="10"
            h="10"
            borderRadius="full"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            color="gray.400"
          >
            <Calendar size={18} />
          </Center>
          <Text fontSize="13px" fontWeight="600" color="gray.700">
            No hearings recorded yet
          </Text>
          <Text fontSize="12px" color="gray.500">
            Scheduled and held hearings will appear here.
          </Text>
        </Center>
      ) : (
        <>
          <VStack gap={0} align="stretch">
            {visible.map((event, index) => {
              const isLast = index === visible.length - 1;
              return (
                <HStack
                  key={event.id}
                  gap={3}
                  align="stretch"
                  w="100%"
                  cursor={onViewEvent ? "pointer" : "default"}
                  onClick={onViewEvent ? () => onViewEvent(event) : undefined}
                  borderRadius="lg"
                  transition="background 0.15s ease"
                  _hover={onViewEvent ? { bg: "gray.50" } : undefined}
                >
                  {/* Timeline rail — stretches with the row height */}
                  <VStack gap={0} align="center" w="5" flexShrink={0} pt={1.5}>
                    <Box
                      w="9px"
                      h="9px"
                      borderRadius="full"
                      bg="white"
                      border="2px solid"
                      borderColor={markerColor(event.status)}
                      flexShrink={0}
                    />
                    {!isLast && (
                      <Box flex={1} w="1px" bg="gray.200" minH="12px" />
                    )}
                  </VStack>

                  {/* Event content */}
                  <Box flex={1} minW={0} pb={isLast ? 0 : 4} px={1}>
                    <HStack gap={2} flexWrap="wrap" mb={1}>
                      <Text
                        fontSize="13px"
                        fontWeight="700"
                        color="gray.900"
                        whiteSpace="nowrap"
                      >
                        {formatDate(event.scheduledDate)}
                      </Text>
                      <CourtEventTypeBadge type={event.eventType} />
                      <CourtEventStatusBadge status={event.status} />
                    </HStack>

                    <HStack gap={3} flexWrap="wrap">
                      {event.scheduledTime && (
                        <Text fontSize="12px" color="gray.500">
                          {formatTime(event.scheduledTime)}
                          {event.endTime
                            ? ` – ${formatTime(event.endTime)}`
                            : ""}
                        </Text>
                      )}
                      {event.courtRoom && (
                        <Text fontSize="12px" color="gray.500">
                          {event.courtRoom}
                        </Text>
                      )}
                      {event.judgeName && (
                        <Text fontSize="12px" color="gray.500">
                          {event.judgeName}
                        </Text>
                      )}
                    </HStack>

                    {event.outcomeType && (
                      <Text fontSize="12px" color="gray.500" mt={1}>
                        {outcomeTypeLabel(event.outcomeType)}
                      </Text>
                    )}

                    {event.outcome && (
                      <Text
                        fontSize="12px"
                        color="gray.600"
                        mt={1}
                        fontStyle="italic"
                        lineHeight="1.55"
                      >
                        “{event.outcome}”
                      </Text>
                    )}
                  </Box>
                </HStack>
              );
            })}
          </VStack>

          {hiddenCount > 0 && (
            <Text fontSize="12px" color="gray.500" mt={4}>
              Showing the {VISIBLE_LIMIT} most recent of {ordered.length}{" "}
              hearings.
            </Text>
          )}
        </>
      )}
    </OverviewCard>
  );
};
