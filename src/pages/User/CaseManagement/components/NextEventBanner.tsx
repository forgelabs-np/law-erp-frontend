import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { CalendarClock } from "lucide-react";

import { CourtEvent } from "../types/matter.types";
import {
  courtEventTypeLabel,
  formatDate,
  formatTime,
} from "../utils/matterHelpers";

interface NextEventBannerProps {
  event: CourtEvent;
  mt?: number | string;
}

/** Prominent banner highlighting the next scheduled court date. */
export const NextEventBanner = ({ event, mt }: NextEventBannerProps) => {
  return (
    <Box
      mt={mt}
      bg="blue.50"
      border="1px solid"
      borderColor="blue.200"
      borderRadius="lg"
      px={4}
      py={3}
    >
      <HStack gap={3} flexWrap="wrap">
        <Box
          w="9"
          h="9"
          borderRadius="lg"
          bg="blue.500"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <CalendarClock size={18} />
        </Box>
        <Stack gap={0}>
          <Text
            fontSize="xs"
            fontWeight="600"
            color="blue.600"
            textTransform="uppercase"
            letterSpacing="0.05em"
          >
            Next Court Date
          </Text>
          <HStack gap={2} flexWrap="wrap">
            <Text fontSize="lg" fontWeight="700" color="gray.900">
              {formatDate(event.scheduledDate)}
            </Text>
            <Text fontSize="sm" fontWeight="600" color="gray.600">
              {courtEventTypeLabel(event.eventType)}
            </Text>
            {event.scheduledTime && (
              <Text fontSize="sm" color="gray.600">
                {formatTime(event.scheduledTime)}
                {event.endTime ? ` – ${formatTime(event.endTime)}` : ""}
              </Text>
            )}
            {event.courtRoom && (
              <Text fontSize="sm" color="gray.600">
                · {event.courtRoom}
              </Text>
            )}
          </HStack>
        </Stack>
      </HStack>
    </Box>
  );
};
