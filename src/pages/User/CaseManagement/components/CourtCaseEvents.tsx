import {
  Badge,
  Box,
  Button,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CalendarClock, CalendarPlus, History } from "lucide-react";
import { useMemo } from "react";

import { CourtEvent } from "../types/matter.types";
import {
  CaseDiarySection,
  CaseDiaryWorkspace,
  CaseEventTimelineItem,
} from "./events";
import { NextHearingCard } from "./NextHearingCard";

interface CourtCaseEventsProps {
  events: CourtEvent[];
  isLoading?: boolean;
  onView: (event: CourtEvent) => void;
  onSchedule: () => void;
  /** Workspace heading. Defaults to the existing "Case Diary" wording. */
  title?: string;
  subtitle?: string;
  /**
   * Renders a contained notice instead of the diary when the surrounding page
   * cannot show events yet (e.g. a matter with no court case recorded).
   */
  disabledReason?: string;
}

const compareEvents = (a: CourtEvent, b: CourtEvent) => {
  const dateCompare = a.scheduledDate.localeCompare(b.scheduledDate);
  if (dateCompare !== 0) return dateCompare;
  return (a.scheduledTime ?? "").localeCompare(b.scheduledTime ?? "");
};

/** Small right-aligned counter used in section headers. */
const CountPill = ({ label }: { label: string }) => (
  <Badge
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    color="gray.600"
    px={2.5}
    py={0.5}
    borderRadius="full"
    fontSize="xs"
    fontWeight="700"
  >
    {label}
  </Badge>
);

/**
 * Chronological case diary. Held/adjourned events are visually linked to the
 * next scheduled event so the Tarik/Peshi chain stays obvious.
 *
 * Presentation only: upcoming/previous are derived from the `events` prop, so
 * the calling pages keep owning all fetching and mutation logic.
 */
export const CourtCaseEvents = ({
  events,
  isLoading = false,
  onView,
  onSchedule,
  title = "Case Diary",
  subtitle = "Track every Tarik/Peshi recorded on this court case.",
  disabledReason,
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

  /** Nearest scheduled hearing, promoted to the prominent card. */
  const nextEvent = upcoming[0];
  const otherUpcoming = upcoming.slice(1);

  /** Held/adjourned event whose nextEventId points at the next hearing. */
  const previousEvent = useMemo(
    () =>
      nextEvent
        ? events.find((event) => event.nextEventId === nextEvent.id)
        : undefined,
    [events, nextEvent]
  );

  const isLinkedToNext = (event: CourtEvent) =>
    event.status === "HELD" &&
    !!event.nextEventId &&
    events.some((candidate) => candidate.id === event.nextEventId);

  const emptyCard = (message: string, action?: React.ReactNode) => (
    <Box
      bg="white"
      border="1px dashed"
      borderColor="gray.300"
      borderRadius="lg"
      px={5}
      py={8}
      textAlign="center"
    >
      <Text fontSize="sm" color="gray.500">
        {message}
      </Text>
      {action}
    </Box>
  );

  const scheduleAction = (
    <Button variant="solid" size="sm" onClick={onSchedule}>
      <CalendarPlus size={15} /> Schedule Event
    </Button>
  );

  if (isLoading) {
    return (
      <CaseDiaryWorkspace title={title} subtitle={subtitle}>
        <VStack gap={3} align="stretch">
          {[...Array(3)].map((_, i) => (
            <Box
              key={i}
              h="84px"
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
            />
          ))}
        </VStack>
      </CaseDiaryWorkspace>
    );
  }

  return (
    <CaseDiaryWorkspace
      title={title}
      subtitle={subtitle}
      actions={disabledReason ? undefined : scheduleAction}
    >
      {disabledReason ? (
        emptyCard(disabledReason)
      ) : events.length === 0 ? (
        emptyCard(
          "No court events yet. Schedule the first Tarik/Peshi.",
          <Button mt={4} variant="outline" size="sm" onClick={onSchedule}>
            <CalendarPlus size={15} /> Schedule Event
          </Button>
        )
      ) : (
        <>
          <CaseDiarySection
            title="Next Tarik"
            subtitle="The next scheduled court date on this proceeding."
            icon={CalendarClock}
            meta={
              upcoming.length > 0 ? (
                <CountPill label={`${upcoming.length} scheduled`} />
              ) : undefined
            }
          >
            <Stack gap={4} align="stretch">
              {nextEvent ? (
                <NextHearingCard
                  event={nextEvent}
                  previousEvent={previousEvent}
                  onViewEvent={onView}
                />
              ) : (
                emptyCard(
                  "No upcoming hearing scheduled. Once a Tarik/Peshi is scheduled it will appear here with the next court date."
                )
              )}

              {otherUpcoming.length > 0 && (
                <VStack gap={0} align="stretch" pt={1}>
                  <HStack gap={2} mb={3}>
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing="0.08em"
                      color="gray.500"
                    >
                      Also scheduled
                    </Text>
                  </HStack>
                  {otherUpcoming.map((event, index) => (
                    <CaseEventTimelineItem
                      key={event.id}
                      event={event}
                      onView={onView}
                      isLast={index === otherUpcoming.length - 1}
                      linksToNext={isLinkedToNext(event)}
                    />
                  ))}
                </VStack>
              )}
            </Stack>
          </CaseDiarySection>

          {previous.length > 0 && (
            <CaseDiarySection
              title="Previous Events"
              subtitle="Newest first."
              icon={History}
              meta={<CountPill label={`${previous.length} recorded`} />}
            >
              <VStack gap={0} align="stretch">
                {previous.map((event, index) => (
                  <CaseEventTimelineItem
                    key={event.id}
                    event={event}
                    onView={onView}
                    isLast={index === previous.length - 1}
                    linksToNext={isLinkedToNext(event)}
                  />
                ))}
              </VStack>
            </CaseDiarySection>
          )}
        </>
      )}
    </CaseDiaryWorkspace>
  );
};
