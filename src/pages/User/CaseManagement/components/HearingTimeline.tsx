import { Stack } from "@chakra-ui/react";
import { Hearing } from "../types/hearing.types";
import { HearingDateGroup } from "./HearingDateGroup";
import { groupHearingsByDate } from "../utils/hearingHelpers";

interface HearingTimelineProps {
  hearings: Hearing[];
  onViewDetails: (hearing: Hearing) => void;
  onEdit: (hearing: Hearing) => void;
  onCancel: (hearingId: string) => void;
}

export const HearingTimeline = ({
  hearings,
  onViewDetails,
  onEdit,
  onCancel,
}: HearingTimelineProps) => {
  const groupedHearings = groupHearingsByDate(hearings);

  return (
    <Stack gap={8}>
      {Object.entries(groupedHearings).map(([dateLabel, dateHearings]) => (
        <HearingDateGroup
          key={dateLabel}
          dateLabel={dateLabel}
          hearings={dateHearings}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onCancel={onCancel}
        />
      ))}
    </Stack>
  );
};
