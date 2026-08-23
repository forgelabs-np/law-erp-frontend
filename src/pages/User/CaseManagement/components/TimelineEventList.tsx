import { Box, Stack } from "@chakra-ui/react";

import { TimelineDateGroupData } from "../utils/timelineHelpers";
import { TimelineDateGroup } from "./TimelineDateGroup";

export type { TimelineDateGroupData } from "../utils/timelineHelpers";

interface TimelineEventListProps {
  /** Date groups in chronological order (oldest first). */
  groups: TimelineDateGroupData[];

  /**
   * Caps the height of the event body so only the list scrolls while the
   * timeline header and Next Hearing card stay visible.
   */
  maxH?: string | number | Record<string, string | number>;
}

export const TimelineEventList = ({ groups, maxH }: TimelineEventListProps) => {
  const totalEvents = groups.reduce(
    (total, group) => total + group.events.length,
    0
  );

  return (
    <Box maxH={maxH} overflowY="auto" pr={2}>
      <Box position="relative">
        {/* Continuous timeline line */}
        {totalEvents > 1 && (
          <Box
            position="absolute"
            left="19px"
            top="32px"
            bottom="24px"
            width="2px"
            bg="gray.200"
            zIndex={0}
          />
        )}

        {/* Timeline content */}
        <Stack gap={7} position="relative" zIndex={1}>
          {groups.map((group) => (
            <TimelineDateGroup
              key={group.label}
              label={group.label}
              events={group.events}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};
