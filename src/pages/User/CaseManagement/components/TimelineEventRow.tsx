import { HStack, Stack, Text } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";

import { MatterTimelineEvent } from "../types/matter.types";
import { TimelineEventMarker } from "./TimelineEventMarker";
import { TimelineEventTypeBadge } from "./TimelineEventTypeBadge";

interface TimelineEventRowProps {
  event: MatterTimelineEvent;
  /** Overrides the default right-aligned time (e.g. date + time on dashboards). */
  timeLabel?: string;
  /** Limits the description to this many lines. */
  descriptionLineClamp?: number;
  onClick?: () => void;
}

const defaultTimeLabel = (value: string): string => {
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return "-";
  return format(date, "h:mm a");
};

/**
 * One row of the vertical matter/activity timeline. The marker sits on the
 * connecting line (rendered by the parent container), with the event content
 * to its right. On small screens the time wraps below the title instead of
 * overflowing.
 */
export const TimelineEventRow = ({
  event,
  timeLabel,
  descriptionLineClamp,
  onClick,
}: TimelineEventRowProps) => {
  return (
    <HStack gap={4} align="flex-start" pb={5}>
      {/* Marker column - the parent's vertical line runs behind this */}
      <Stack
        w="10"
        flexShrink={0}
        alignItems="center"
        justifyContent="flex-start"
        zIndex={1}
      >
        <TimelineEventMarker eventType={event.eventType} />
      </Stack>

      {/* Content */}
      <Stack
        flex={1}
        gap={1}
        minW="0"
        cursor={onClick ? "pointer" : undefined}
        onClick={onClick}
      >
        <HStack
          justify="space-between"
          align="flex-start"
          gap={2}
          flexWrap="wrap"
        >
          <Stack gap={1} minW="0">
            <Text
              fontSize="sm"
              fontWeight="600"
              color="gray.900"
              _hover={onClick ? { color: "primary.600" } : undefined}
              transition="color 0.15s ease"
            >
              {event.title}
            </Text>
            <HStack gap={2} flexWrap="wrap">
              <TimelineEventTypeBadge type={event.eventType} />
              {event.ourCourtCaseRef && (
                <Text fontSize="xs" color="gray.400" fontFamily="monospace">
                  {event.ourCourtCaseRef}
                </Text>
              )}
            </HStack>
          </Stack>
          <Text fontSize="xs" color="gray.400" whiteSpace="nowrap">
            {timeLabel ?? defaultTimeLabel(event.createdAt)}
          </Text>
        </HStack>
        {event.description && (
          <Text
            fontSize="sm"
            color="gray.600"
            lineHeight="1.5"
            lineClamp={descriptionLineClamp}
          >
            {event.description}
          </Text>
        )}
      </Stack>
    </HStack>
  );
};
