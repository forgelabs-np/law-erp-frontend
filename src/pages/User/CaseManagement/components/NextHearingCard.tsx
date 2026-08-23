import { Badge, Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { useMemo } from "react";

import {
  formatNepaliMonthYear,
  gregorianToNepali,
  NEPALI_FONT_STACK,
  toNepaliDigits,
} from "@/utils/nepaliDateUtils";

import { CourtEvent, OutcomeType } from "../types/matter.types";
import { courtEventTypeLabel, formatTime } from "../utils/matterHelpers";

interface NextHearingCardProps {
  /** The next scheduled court event. */
  event: CourtEvent;
  /** The held/adjourned event whose nextEventId points to `event`. */
  previousEvent?: CourtEvent;
  /** 1-based hearing number within the case chain, when derivable. */
  sequence?: number;
  /** Optional context line (e.g. matter title · matter number on firm-wide views). */
  context?: string;
  /** Opens the existing event detail/edit flow when provided. */
  onViewEvent?: (event: CourtEvent) => void;
}

const OUTCOME_PHRASE: Partial<Record<OutcomeType, string>> = {
  ADJOURNED_NO_PROGRESS: "was adjourned with no conclusion",
  PART_HEARD: "was partially heard",
  ARGUMENTS_COMPLETE: "concluded arguments",
  EVIDENCE_TAKEN: "evidence was taken",
  ORDER_PASSED: "an order was passed",
  ORDER_ISSUED: "an order was issued",
  STAY_GRANTED: "a stay was granted",
  INTERIM_ORDER: "an interim order was passed",
  JUDGMENT_DELIVERED: "judgment was delivered",
  WITHDRAWN: "was withdrawn",
};

const eventDay = (value: string) => {
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

/**
 * Prominent summary of the next scheduled court date. Answers the most
 * important question for long-running Tarik/Peshi chains: "What is the
 * next court date?"
 */
export const NextHearingCard = ({
  event,
  previousEvent,
  sequence,
  context,
  onViewEvent,
}: NextHearingCardProps) => {
  const { day, monthYear, nepaliDate } = useMemo(() => {
    const date = eventDay(event.scheduledDate);
    if (!date) {
      return { day: "-", monthYear: "", nepaliDate: "" };
    }
    const parts = gregorianToNepali(date);
    return {
      day: format(date, "dd"),
      monthYear: format(date, "MMM yyyy").toUpperCase(),
      nepaliDate: `${toNepaliDigits(parts.day)} ${formatNepaliMonthYear(
        parts.year,
        parts.month
      )}`,
    };
  }, [event.scheduledDate]);

  const daysUntil = useMemo(() => {
    const date = eventDay(event.scheduledDate);
    if (!date) return null;
    return differenceInCalendarDays(date, new Date());
  }, [event.scheduledDate]);

  const supportingText = useMemo(() => {
    if (previousEvent?.scheduledDate) {
      const prevDate = eventDay(previousEvent.scheduledDate);
      const label = prevDate ? format(prevDate, "dd MMM") : "previous";
      const phrase =
        (previousEvent.outcomeType &&
          OUTCOME_PHRASE[previousEvent.outcomeType]) ??
        undefined;
      if (phrase) {
        return `Rescheduled after the ${label} hearing ${phrase}`;
      }
      if (previousEvent.outcome) {
        return `Rescheduled after the ${label} hearing: “${previousEvent.outcome}”`;
      }
      return `Rescheduled after the ${label} hearing`;
    }

    const details = [
      event.courtRoom ? `Court room ${event.courtRoom}` : "",
      event.scheduledTime
        ? `${formatTime(event.scheduledTime)}${
            event.endTime ? ` – ${formatTime(event.endTime)}` : ""
          }`
        : "",
    ].filter(Boolean);
    return details.length > 0 ? details.join(" · ") : undefined;
  }, [event, previousEvent]);

  const daysLabel =
    daysUntil === null
      ? "Scheduled"
      : daysUntil === 0
        ? "Today"
        : daysUntil === 1
          ? "Tomorrow"
          : `In ${daysUntil} days`;

  const title = `${courtEventTypeLabel(event.eventType)}${
    sequence && sequence > 1 ? ` · Sequence #${sequence}` : ""
  }`;

  return (
    <Box bg="primary.600" borderRadius="xl" px={6} py={5}>
      <HStack gap={5} align="center" flexWrap="wrap">
        {/* Date block */}
        <HStack gap={4} align="center">
          <Stack gap={0} align="center">
            <Text
              color="white"
              fontSize="3xl"
              fontWeight="800"
              lineHeight="1.1"
            >
              {day}
            </Text>
            <Text
              color="whiteAlpha.800"
              fontSize="xs"
              fontWeight="700"
              letterSpacing="0.1em"
            >
              {monthYear}
            </Text>
            {nepaliDate && (
              <Text
                color="whiteAlpha.700"
                fontSize="xs"
                fontFamily={NEPALI_FONT_STACK}
                lineHeight={1.4}
                whiteSpace="nowrap"
              >
                {nepaliDate}
              </Text>
            )}
          </Stack>
          <Box w="1px" h="12" bg="whiteAlpha.400" />
        </HStack>

        {/* Hearing info */}
        <Stack gap={1} flex={1} minW="0">
          {context && (
            <Text
              color="whiteAlpha.700"
              fontSize="xs"
              fontWeight="500"
              lineClamp={1}
            >
              {context}
            </Text>
          )}
          <Text
            color="whiteAlpha.800"
            fontSize="xs"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="0.08em"
          >
            Next Hearing
          </Text>
          <Text color="white" fontSize="xl" fontWeight="700" lineHeight="1.3">
            {title}
          </Text>
          {/* {supportingText && (
            <Text color="whiteAlpha.800" fontSize="sm">
              {supportingText}
            </Text>
          )} */}
        </Stack>

        {/* Days badge + optional action */}
        <HStack gap={3} align="center" flexShrink={0}>
          <Badge
            bg="white"
            color="primary.700"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
            fontWeight="700"
            whiteSpace="nowrap"
          >
            {daysLabel}
          </Badge>
          {onViewEvent && (
            <Button
              variant="light"
              size="sm"
              onClick={() => onViewEvent(event)}
            >
              View Event
            </Button>
          )}
        </HStack>
      </HStack>
    </Box>
  );
};
