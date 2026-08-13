import { Stack, Text } from "@chakra-ui/react";

import { MatterTimelineEvent } from "../types/matter.types";
import { TimelineEventRow } from "./TimelineEventRow";

interface TimelineDateGroupProps {
  label: string;
  events: MatterTimelineEvent[];
}

/**
 * One date group inside the vertical timeline: a small uppercase date
 * heading followed by that day's events. The connecting line is rendered
 * by the parent `TimelineEventList` and runs behind these rows.
 */
export const TimelineDateGroup = ({ label, events }: TimelineDateGroupProps) => (
  <Stack gap={3}>
    <Text
      fontSize="xs"
      fontWeight="700"
      color="gray.500"
      textTransform="uppercase"
      letterSpacing="0.05em"
    >
      {label}
    </Text>
    <Stack gap={0}>
      {events.map((event) => (
        <TimelineEventRow key={event.id} event={event} />
      ))}
    </Stack>
  </Stack>
);
