import { Box, Button, HStack, Stack, Text, Tooltip } from "@chakra-ui/react";
import { CalendarDays, CalendarOff, ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { TodayEvent } from "../../types/dashboard.types";
import { formatTime, formatDate } from "../../utils/matterHelpers";
import { CourtEventTypeBadge, CourtEventStatusBadge } from "../MatterBadges";

// ============================================================
// Event Row
// ============================================================

interface EventRowProps {
  event: TodayEvent;
}

const EventRow = ({ event }: EventRowProps) => {
  const navigate = useNavigate();

  return (
    <Box
      p={4}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      cursor="pointer"
      onClick={() => navigate(`/cases/${event.matterNumber}`)}
      _hover={{ borderColor: "blue.300", boxShadow: "sm" }}
      transition="all 0.15s ease"
    >
      <HStack
        justify="space-between"
        align="flex-start"
        flexWrap="wrap"
        gap={2}
      >
        <Stack gap={1} flex={1} minW="200px">
          <Text fontSize="sm" fontWeight="600" color="gray.900">
            {event.matterTitle}
          </Text>
          <Text fontSize="xs" color="gray.500" fontFamily="monospace">
            {event.matterNumber}
            {event.ourCourtCaseRef ? ` · ${event.ourCourtCaseRef}` : ""}
          </Text>
        </Stack>
        <HStack gap={2}>
          <CourtEventTypeBadge type={event.eventType as any} />
          <CourtEventStatusBadge status={event.status as any} />
        </HStack>
      </HStack>
      <HStack gap={4} mt={2} flexWrap="wrap">
        <HStack gap={1}>
          <Clock size={13} color="#9ca3af" />
          <Text fontSize="xs" color="gray.600">
            {formatTime(event.scheduledTime) || formatDate(event.scheduledDate)}
          </Text>
        </HStack>
        {event.courtRoom && (
          <Text fontSize="xs" color="gray.500">
            Room {event.courtRoom}
          </Text>
        )}
        {event.judgeName && (
          <Text fontSize="xs" color="gray.500">
            Judge: {event.judgeName}
          </Text>
        )}
        {event.attendingAdvocateName && (
          <Text fontSize="xs" color="gray.500">
            Advocate: {event.attendingAdvocateName}
          </Text>
        )}
      </HStack>
    </Box>
  );
};

// ============================================================
// Empty State
// ============================================================

const EventsEmptyState = () => {
  const navigate = useNavigate();

  return (
    <Box
      p={8}
      bg="gray.50"
      border="1px dashed"
      borderColor="gray.200"
      borderRadius="lg"
      textAlign="center"
    >
      <Box
        w="12"
        h="12"
        borderRadius="full"
        bg="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
        mx="auto"
        mb={4}
      >
        <CalendarOff size={22} color="#9ca3af" />
      </Box>
      <Text fontSize="sm" fontWeight="600" color="gray.700" mb={1}>
        No court events scheduled for today
      </Text>
      <Text fontSize="xs" color="gray.500" mb={4}>
        You're all clear for today. Check upcoming events in the calendar.
      </Text>
      <Button
        size="sm"
        variant="outline"
        onClick={() => navigate("/task-calendar")}
      >
        <CalendarDays size={14} />
        Open Calendar
      </Button>
    </Box>
  );
};

// ============================================================
// Main Component
// ============================================================

interface TodaysCourtEventsProps {
  events: TodayEvent[];
  isLoading?: boolean;
}

export const TodaysCourtEvents = ({
  events,
  isLoading,
}: TodaysCourtEventsProps) => {
  const navigate = useNavigate();

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={6}
    >
      <HStack justify="space-between" mb={events.length > 0 ? 4 : 0}>
        <HStack gap={3}>
          <Box
            w="8"
            h="8"
            borderRadius="lg"
            bg="purple.50"
            color="purple.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CalendarDays size={18} />
          </Box>
          <Stack gap={0}>
            <Text fontSize="md" fontWeight="600" color="gray.900">
              Today's Court Events
            </Text>
            <Text fontSize="xs" color="gray.500">
              Hearings and court activity scheduled for today
            </Text>
          </Stack>
        </HStack>
        {/* <Tooltip label="Open full calendar"> */}
        <Button
          variant="ghost"
          size="sm"
          // rightIcon={<ArrowRight size={14} />}
          onClick={() => navigate("/task-calendar")}
        >
          Open Calendar
          <ArrowRight size={14} />
        </Button>
        {/* </Tooltip> */}
      </HStack>

      {isLoading ? (
        <Stack gap={3}>
          {[1, 2].map((i) => (
            <Box
              key={i}
              p={4}
              bg="gray.50"
              border="1px solid"
              borderColor="gray.100"
              borderRadius="lg"
            >
              <Stack gap={2}>
                <Box h="14px" w="200px" bg="gray.100" borderRadius="md" />
                <Box h="10px" w="140px" bg="gray.100" borderRadius="md" />
              </Stack>
            </Box>
          ))}
        </Stack>
      ) : events.length === 0 ? (
        <EventsEmptyState />
      ) : (
        <Stack gap={3}>
          {events.map((event) => (
            <EventRow key={event.eventId} event={event} />
          ))}
        </Stack>
      )}
    </Box>
  );
};
