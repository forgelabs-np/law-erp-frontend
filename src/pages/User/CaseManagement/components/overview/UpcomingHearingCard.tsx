import { Box, Center, HStack, Stack, Text } from "@chakra-ui/react";
import { CalendarClock } from "lucide-react";

import { CourtEvent } from "../../types/matter.types";
import { NextHearingCard } from "../NextHearingCard";

interface UpcomingHearingCardProps {
  /** Resolved next scheduled court event, when one exists. */
  event?: CourtEvent;
  /** The held/adjourned event whose nextEventId points to `event`. */
  previousEvent?: CourtEvent;
  /** 1-based hearing number within the case chain, when derivable. */
  sequence?: number;
  /** Opens the existing event detail flow. */
  onViewEvent?: (event: CourtEvent) => void;
}

/**
 * Prominent "next court date" block for the Overview tab.
 *
 * Delegates to the existing `NextHearingCard` so the presentation stays
 * identical to the matter timeline, and falls back to a styled empty state
 * when no future hearing is scheduled.
 */
export const UpcomingHearingCard = ({
  event,
  previousEvent,
  sequence,
  onViewEvent,
}: UpcomingHearingCardProps) => {
  if (event) {
    return (
      <NextHearingCard
        event={event}
        previousEvent={previousEvent}
        sequence={sequence}
        onViewEvent={onViewEvent}
      />
    );
  }

  return (
    <Box
      p={{ base: 4, md: 5 }}
      bg="white"
      border="1px dashed"
      borderColor="gray.300"
      borderRadius="xl"
      w="100%"
    >
      <HStack gap={3} flexWrap="wrap">
        <Center
          w="10"
          h="10"
          borderRadius="lg"
          bg="gray.50"
          border="1px solid"
          borderColor="gray.200"
          color="gray.400"
          flexShrink={0}
        >
          <CalendarClock size={18} />
        </Center>
        <Stack gap={0.5} flex={1} minW="0">
          <Text fontSize="14px" fontWeight="700" color="gray.800">
            No upcoming hearing scheduled
          </Text>
          <Text fontSize="12px" color="gray.500" lineHeight="1.5">
            Once a Tarikh/Peshi is scheduled it will appear here with the next
            court date.
          </Text>
        </Stack>
      </HStack>
    </Box>
  );
};
