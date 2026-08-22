import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { CalendarClock, History } from "lucide-react";
import { format, parse } from "date-fns";
import { useMemo, useState } from "react";

import {
  CourtEvent,
  MatterTimelineEvent,
  TimelineEventType,
} from "../types/matter.types";
import { timelineEventTypeLabel } from "../utils/matterHelpers";
import { groupEventsByDay, TimelineDateGroupData } from "../utils/timelineHelpers";
import { FieldSelect } from "./ui";
import { NextHearingCard } from "./NextHearingCard";
import { TimelineEventList } from "./TimelineEventList";

const TIMELINE_EVENT_TYPES: TimelineEventType[] = [
  "MATTER_CREATED",
  "COURT_CASE_ADDED",
  "STAGE_CHANGE",
  "MEDIATION_FAILED",
  "MEDIATION_SUCCEEDED",
  "COURT_EVENT_SCHEDULED",
  "COURT_EVENT_HELD",
  "COURT_EVENT_ADJOURNED",
  "COURT_EVENT_CANCELLED",
  "PARTY_ADDED",
  "JUDGMENT_RECORDED",
  "APPEAL_FILED",
  "MATTER_NOTE_ADDED",
];

interface MatterTimelineProps {
  events: MatterTimelineEvent[];
  /** Number of events shown before older entries collapse. */
  initialLimit?: number;
  /** Court events of the current court case (used for the NEXT HEARING card). */
  courtEvents?: CourtEvent[];
  /** Court name shown in the header subtitle. */
  courtName?: string;
  /** Matter number shown below the header title. */
  matterNumber?: string;
  /** Backend-computed next event from the matter detail response. */
  nextEvent?: CourtEvent | null;
  isLoading?: boolean;
  /** Opens the existing "Schedule Event" flow (used in the empty state). */
  onSchedule?: () => void;
  /** Opens the existing event detail/edit flow from the NEXT HEARING card. */
  onViewEvent?: (event: CourtEvent) => void;
}

// ---------------------------------------------------------------------------
// Next-hearing resolution helpers
// ---------------------------------------------------------------------------

/** Today as a `yyyy-MM-dd` string (safe for lexicographic comparison). */
const todayStr = (): string => format(new Date(), "yyyy-MM-dd");

const isUpcomingDate = (value?: string): boolean =>
  !!value && value.slice(0, 10) >= todayStr();

const isUpcomingEvent = (event: CourtEvent): boolean =>
  isUpcomingDate(event.scheduledDate);

const compareScheduled = (a: CourtEvent, b: CourtEvent): number =>
  a.scheduledDate.localeCompare(b.scheduledDate) ||
  (a.scheduledTime ?? "").localeCompare(b.scheduledTime ?? "");

/**
 * Last-resort extraction: the timeline activity may carry a future PESHI/TARIK
 * date inside its generated title/description (e.g. "PESHI scheduled · 25 Aug
 * 2026") even when the structured event list is unavailable. Parsing is
 * conservative - unmatched text is simply ignored.
 */
const DATE_IN_TEXT = /\b(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})\b/;

const extractScheduledDate = (
  event: MatterTimelineEvent
): string | undefined => {
  const match = DATE_IN_TEXT.exec(`${event.title} ${event.description ?? ""}`);
  if (!match) return undefined;
  const parsed = parse(
    `${match[1]} ${match[2]} ${match[3]}`,
    "d MMM yyyy",
    new Date()
  );
  if (Number.isNaN(parsed.getTime())) return undefined;
  return format(parsed, "yyyy-MM-dd");
};

const upcomingFromTimeline = (
  events: MatterTimelineEvent[]
): CourtEvent | undefined => {
  const candidates = events
    .filter((event) => event.eventType === "COURT_EVENT_SCHEDULED")
    .map((event) => ({ event, date: extractScheduledDate(event) }))
    .filter(
      (candidate): candidate is { event: MatterTimelineEvent; date: string } =>
        !!candidate.date && candidate.date >= todayStr()
    )
    .sort((a, b) => a.date.localeCompare(b.date));
  const best = candidates[0];
  if (!best) return undefined;

  const text = `${best.event.title} ${best.event.description ?? ""}`.toUpperCase();
  return {
    id: best.event.id,
    courtCaseId: best.event.courtCaseId ?? "",
    eventType: text.includes("TARIK") ? "TARIK" : "PESHI",
    scheduledDate: best.date,
    status: "SCHEDULED",
    matterNumber: best.event.matterNumber,
    ourCourtCaseRef: best.event.ourCourtCaseRef,
  };
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const MatterTimeline = ({
  events,
  initialLimit = 12,
  courtEvents,
  courtName,
  matterNumber,
  nextEvent: nextEventProp,
  isLoading = false,
  onSchedule,
  onViewEvent,
}: MatterTimelineProps) => {
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("ALL");
  const [expanded, setExpanded] = useState(false);

  const subtitle = useMemo(() => {
    return [matterNumber, courtName].filter(Boolean).join(" · ") || undefined;
  }, [courtName, matterNumber]);

  /**
   * The next hearing is resolved from existing data, in order of authority:
   *   1. The backend-computed `nextEvent` on the matter response.
   *   2. The earliest SCHEDULED event on the current court case.
   *   3. A future PESHI/TARIK date embedded in the timeline activity itself.
   */
  const nextEvent = useMemo(() => {
    if (nextEventProp && isUpcomingEvent(nextEventProp)) return nextEventProp;
    if (courtEvents?.length) {
      const fromEvents = courtEvents
        .filter(
          (event) => event.status === "SCHEDULED" && isUpcomingEvent(event)
        )
        .sort(compareScheduled)[0];
      if (fromEvents) return fromEvents;
    }
    return upcomingFromTimeline(events);
  }, [courtEvents, events, nextEventProp]);

  const previousEvent = useMemo(() => {
    if (!nextEvent) return undefined;
    return courtEvents?.find((event) => event.nextEventId === nextEvent.id);
  }, [courtEvents, nextEvent]);

  const sequence = useMemo(() => {
    if (!nextEvent) return undefined;
    return courtEvents?.filter(
      (event) =>
        event.status !== "CANCELED" &&
        event.scheduledDate <= nextEvent.scheduledDate
    ).length;
  }, [courtEvents, nextEvent]);

  const filtered = useMemo(() => {
    if (eventTypeFilter === "ALL") return events;
    return events.filter((event) => event.eventType === eventTypeFilter);
  }, [events, eventTypeFilter]);

  const groups = useMemo(() => groupEventsByDay(filtered), [filtered]);

  const visibleEvents = expanded
    ? filtered.length
    : Math.min(filtered.length, initialLimit);

  const visibleGroups: TimelineDateGroupData[] = useMemo(() => {
    let rendered = 0;
    const visible: TimelineDateGroupData[] = [];
    for (const group of groups) {
      if (rendered >= visibleEvents) break;
      const remaining = visibleEvents - rendered;
      const groupEvents = group.events.slice(0, remaining);
      rendered += groupEvents.length;
      if (groupEvents.length > 0) {
        visible.push({ label: group.label, events: groupEvents });
      }
    }
    return visible;
  }, [groups, visibleEvents]);

  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      p={{ base: 4, md: 6 }}
    >
      {/* ==================== Header ==================== */}
      <HStack justify="space-between" align="flex-start" gap={4} flexWrap="wrap">
        <HStack gap={3} align="flex-start">
          <Box
            w="10"
            h="10"
            borderRadius="lg"
            bg="primary.500"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <History size={20} />
          </Box>
          <Stack gap={0.5}>
            <Text fontSize="lg" fontWeight="600" color="gray.900">
              Matter timeline
            </Text>
            <Text fontSize="sm" color="gray.500">
              {subtitle ?? "Case timeline"}
            </Text>
          </Stack>
        </HStack>

        <HStack gap={3} flexWrap="wrap">
          <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
            {events.length} {events.length === 1 ? "event" : "events"}
          </Text>
          <Box w="200px">
            <FieldSelect
              size="sm"
              value={eventTypeFilter}
              disabled={events.length === 0}
              onChange={(value) => {
                setEventTypeFilter(value);
                setExpanded(false);
              }}
            >
              <option value="ALL">All event types</option>
              {TIMELINE_EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {timelineEventTypeLabel(type)}
                </option>
              ))}
            </FieldSelect>
          </Box>
        </HStack>
      </HStack>

      {/* ==================== Next hearing ==================== */}
      <Box mt={6}>
        {nextEvent ? (
          <NextHearingCard
            event={nextEvent}
            previousEvent={previousEvent}
            sequence={sequence}
            onViewEvent={onViewEvent}
          />
        ) : (
          <Box
            p={5}
            bg="gray.50"
            border="1px dashed"
            borderColor="gray.200"
            borderRadius="lg"
          >
            <HStack gap={3} flexWrap="wrap">
              <CalendarClock size={18} color="#6b7280" />
              <Stack gap={0.5} flex={1} minW="0">
                <Text fontSize="sm" fontWeight="600" color="gray.700">
                  No upcoming hearing scheduled
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Schedule a Tarik/Peshi to see the next court date here.
                </Text>
              </Stack>
              {onSchedule && (
                <Button variant="outline" size="sm" onClick={onSchedule}>
                  Schedule Event
                </Button>
              )}
            </HStack>
          </Box>
        )}
      </Box>

      {/* ==================== Historical timeline ==================== */}
      {isLoading ? (
        <Stack gap={4} mt={6}>
          {[...Array(4)].map((_, i) => (
            <Box key={i} h="56px" bg="gray.100" borderRadius="md" />
          ))}
        </Stack>
      ) : groups.length === 0 ? (
        <Box mt={6} py={10} textAlign="center">
          <Text fontSize="sm" color="gray.500">
            {events.length === 0
              ? "No timeline events recorded yet"
              : "No events match this filter"}
          </Text>
        </Box>
      ) : (
        <Stack mt={6} gap={4}>
          <TimelineEventList
            groups={visibleGroups}
            maxH={{ base: "400px", md: "calc(100vh - 520px)" }}
          />
          {filtered.length > initialLimit && (
            <HStack justify="center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded((prev) => !prev)}
              >
                {expanded
                  ? "Show less"
                  : `Show older events (${filtered.length - initialLimit})`}
              </Button>
            </HStack>
          )}
        </Stack>
      )}
    </Box>
  );
};
