import { Badge, Box, HStack, Stack, Text } from "@chakra-ui/react";
import { CalendarClock, ChevronRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

import { DashboardEventItem } from "@/api/dashboard";
import { formatTime } from "@/pages/User/CaseManagement/utils/matterHelpers";
import { useModulePermissions } from "@/shared/hooks/usePermissions";

import { humanizeLabel, toDateParts } from "../utils";
import { EmptyState } from "./SectionCard";

const STATUS_TONE: Record<string, string> = {
  SCHEDULED: "blue",
  CONFIRMED: "blue",
  PENDING: "amber",
  ADJOURNED: "orange",
  HELD: "green",
  COMPLETED: "green",
  CANCELED: "red",
  CANCELLED: "red",
  DISPOSED: "gray",
};

interface EventRowProps {
  event: DashboardEventItem;
  showMatter: boolean;
  isLast: boolean;
  isNext: boolean;
  variant: "list" | "timeline";
  canOpen: boolean;
}

const EventRow = ({
  event,
  showMatter,
  isLast,
  isNext,
  variant,
  canOpen,
}: EventRowProps) => {
  const parts = toDateParts(event.scheduledDate);
  const status = event.status ? event.status.toUpperCase() : "";
  const type = event.eventType
    ? humanizeLabel(event.eventType)
    : event.purpose || "Court event";

  const supporting = [
    event.courtRoom ? `Room ${event.courtRoom}` : "",
    event.judgeName ?? "",
    event.attendingAdvocateName ?? "",
  ].filter(Boolean);

  const time = event.scheduledTime ? formatTime(event.scheduledTime) : "";

  const content = (
    <HStack
      gap={4}
      py={3}
      px={2}
      align="flex-start"
      borderRadius="lg"
      transition="background 0.15s ease"
      _hover={{ bg: "gray.50" }}
      flex="1"
      minW={0}
    >
      {/* Date chip */}
      <Stack
        align="center"
        justify="center"
        w="48px"
        flexShrink={0}
        bg={isNext ? "primary.500" : "primary.50"}
        color={isNext ? "white" : "primary.700"}
        borderRadius="lg"
        py={1.5}
      >
        <Text fontSize="md" fontWeight={700} lineHeight="1.1">
          {parts?.day ?? "—"}
        </Text>
        <Text fontSize="10px" fontWeight={700} letterSpacing="0.06em">
          {parts?.month ?? ""}
        </Text>
      </Stack>

      {/* Details */}
      <Stack gap={0.5} flex={1} minW={0}>
        <HStack gap={2}>
          <Text fontSize="sm" fontWeight={600} color="gray.900" lineClamp={1}>
            {type}
          </Text>
          {isNext && (
            <Badge
              colorPalette="primary"
              px={2}
              py={0.5}
              borderRadius="full"
              fontSize="10px"
              fontWeight={700}
            >
              Next
            </Badge>
          )}
        </HStack>
        {showMatter && (event.matterTitle || event.matterNumber) && (
          <Text fontSize="xs" color="gray.500" lineClamp={1}>
            {[event.matterTitle, event.matterNumber]
              .filter(Boolean)
              .join(" · ")}
          </Text>
        )}
        {(time || supporting.length > 0) && (
          <HStack gap={2} flexWrap="wrap">
            {time && (
              <HStack gap={1}>
                <Clock size={11} color="#9ca3af" />
                <Text fontSize="xs" color="gray.500">
                  {time}
                </Text>
              </HStack>
            )}
            {supporting.length > 0 && (
              <Text fontSize="xs" color="gray.400" lineClamp={1}>
                {supporting.join(" · ")}
              </Text>
            )}
          </HStack>
        )}
        {event.courtName && (
          <Text fontSize="xs" color="gray.400" lineClamp={1}>
            {event.courtName}
          </Text>
        )}
      </Stack>

      {/* Status */}
      <HStack gap={2} flexShrink={0} align="center">
        {status && (
          <Badge
            colorPalette={STATUS_TONE[status] ?? "gray"}
            px={2}
            py={0.5}
            borderRadius="full"
            fontSize="xs"
            fontWeight={600}
          >
            {humanizeLabel(status)}
          </Badge>
        )}
        {canOpen && <ChevronRight size={14} color="#9ca3af" />}
      </HStack>
    </HStack>
  );

  const body = canOpen ? (
    <Link to={`/cases/${event.matterNumber}`}>{content}</Link>
  ) : (
    content
  );

  if (variant === "list") {
    return (
      <Box
        borderBottom={isLast ? "none" : "1px solid"}
        borderColor="gray.100"
        position="relative"
      >
        {body}
      </Box>
    );
  }

  // Timeline variant: rail with connector that grows with the row.
  return (
    <HStack align="stretch" gap={0} position="relative">
      <Stack align="center" w="22px" flexShrink={0} pt={4}>
        <Box
          w="10px"
          h="10px"
          borderRadius="full"
          border="2px solid"
          borderColor={isNext ? "primary.500" : "gray.300"}
          bg={isNext ? "primary.500" : "white"}
          boxShadow={isNext ? "0 0 0 4px rgba(0,86,255,0.12)" : undefined}
          flexShrink={0}
        />
        {!isLast && <Box w="2px" flex="1" bg="gray.100" mt={1} />}
      </Stack>
      {body}
    </HStack>
  );
};

interface EventListProps {
  events: DashboardEventItem[];
  /** Show the matter title/number — off for single-matter contexts. */
  showMatter?: boolean;
  /** `timeline` draws a vertical rail with connectors. */
  variant?: "list" | "timeline";
  /** Emphasise the first (nearest) event. */
  highlightFirst?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

/** Shared list for today's events, upcoming hearings and deadlines. */
export const EventList = ({
  events,
  showMatter = true,
  variant = "list",
  highlightFirst = false,
  emptyTitle = "No court events",
  emptyDescription = "Scheduled hearings and Tarik/Peshi will appear here.",
}: EventListProps) => {
  const { canView } = useModulePermissions("CASE_MANAGEMENT");

  if (events.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<CalendarClock size={18} />}
      />
    );
  }

  return (
    <Box>
      {events.map((event, index) => (
        <EventRow
          key={`${event.eventId ?? event.matterNumber ?? "event"}-${event.scheduledDate ?? index}`}
          event={event}
          showMatter={showMatter}
          variant={variant}
          isNext={highlightFirst && index === 0}
          isLast={index === events.length - 1}
          canOpen={canView && Boolean(event.matterNumber)}
        />
      ))}
    </Box>
  );
};
