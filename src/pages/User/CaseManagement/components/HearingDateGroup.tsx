import { Box, Stack, Text } from "@chakra-ui/react";
import { Hearing } from "../types/hearing.types";
import { HearingTimelineItem } from "./HearingTimelineItem";

interface HearingDateGroupProps {
  dateLabel: string;
  hearings: Hearing[];
  onViewDetails: (hearing: Hearing) => void;
  onEdit: (hearing: Hearing) => void;
  onCancel: (hearingId: string) => void;
}

export const HearingDateGroup = ({
  dateLabel,
  hearings,
  onViewDetails,
  onEdit,
  onCancel,
}: HearingDateGroupProps) => {
  return (
    <Stack gap={4}>
      {/* Date header */}
      <Text fontSize="sm" fontWeight="600" color="gray.700" py={2}>
        {dateLabel}
      </Text>

      {/* Timeline items */}
      <Stack gap={4} pl={2}>
        {hearings.map((hearing, index) => (
          <HearingTimelineItem
            key={hearing.id}
            hearing={hearing}
            isLast={index === hearings.length - 1}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onCancel={onCancel}
          />
        ))}
      </Stack>
    </Stack>
  );
};
