import { Badge } from "@chakra-ui/react";

import { TimelineEventType } from "../types/matter.types";
import { timelineEventTypeLabel } from "../utils/matterHelpers";

const EVENT_TYPE_COLOR: Record<string, string> = {
  MATTER_CREATED: "blue",
  COURT_CASE_ADDED: "purple",
  STAGE_CHANGE: "yellow",
  MEDIATION_FAILED: "red",
  MEDIATION_SUCCEEDED: "green",
  COURT_EVENT_SCHEDULED: "blue",
  COURT_EVENT_HELD: "green",
  COURT_EVENT_ADJOURNED: "orange",
  COURT_EVENT_CANCELLED: "red",
  PARTY_ADDED: "teal",
  JUDGMENT_RECORDED: "green",
  APPEAL_FILED: "purple",
  MATTER_NOTE_ADDED: "gray",
};

export const TimelineEventTypeBadge = ({
  type,
}: {
  type: TimelineEventType;
}) => (
  <Badge
    colorScheme={EVENT_TYPE_COLOR[type] ?? "gray"}
    px={2}
    py={0.5}
    borderRadius="md"
    fontSize="xs"
    fontWeight="600"
  >
    {timelineEventTypeLabel(type)}
  </Badge>
);
