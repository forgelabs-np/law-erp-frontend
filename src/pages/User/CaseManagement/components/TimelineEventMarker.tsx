import { Box } from "@chakra-ui/react";
import {
  ArrowRightLeft,
  ArrowUpRight,
  CalendarClock,
  CalendarPlus,
  CalendarX,
  CheckCircle2,
  FileText,
  FolderPlus,
  Gavel,
  LucideIcon,
  Scale,
  StickyNote,
  UserPlus,
  XCircle,
} from "lucide-react";

import { TimelineEventType } from "../types/matter.types";

const EVENT_ICON: Record<string, LucideIcon> = {
  MATTER_CREATED: FolderPlus,
  COURT_CASE_ADDED: Scale,
  STAGE_CHANGE: ArrowRightLeft,
  MEDIATION_FAILED: XCircle,
  MEDIATION_SUCCEEDED: CheckCircle2,
  COURT_EVENT_SCHEDULED: CalendarPlus,
  COURT_EVENT_HELD: CheckCircle2,
  COURT_EVENT_ADJOURNED: CalendarClock,
  COURT_EVENT_CANCELLED: CalendarX,
  PARTY_ADDED: UserPlus,
  JUDGMENT_RECORDED: Gavel,
  APPEAL_FILED: ArrowUpRight,
  MATTER_NOTE_ADDED: StickyNote,
};

const EVENT_DOT_COLOR: Record<string, string> = {
  MATTER_CREATED: "#3b82f6",
  COURT_CASE_ADDED: "#8b5cf6",
  STAGE_CHANGE: "#f59e0b",
  MEDIATION_FAILED: "#ef4444",
  MEDIATION_SUCCEEDED: "#10b981",
  COURT_EVENT_SCHEDULED: "#3b82f6",
  COURT_EVENT_HELD: "#10b981",
  COURT_EVENT_ADJOURNED: "#f97316",
  COURT_EVENT_CANCELLED: "#ef4444",
  PARTY_ADDED: "#14b8a6",
  JUDGMENT_RECORDED: "#10b981",
  APPEAL_FILED: "#8b5cf6",
  MATTER_NOTE_ADDED: "#64748b",
};

/**
 * Circular icon marker placed on the vertical timeline line.
 * The connecting line runs behind this marker (it is opaque), so markers
 * visually sit on the line and connect through their centers.
 */
export const TimelineEventMarker = ({
  eventType,
}: {
  eventType: TimelineEventType;
}) => {
  const Icon = EVENT_ICON[eventType] ?? FileText;
  return (
    <Box
      w="8"
      h="8"
      borderRadius="full"
      bg={EVENT_DOT_COLOR[eventType] ?? "#64748b"}
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      <Icon size={14} />
    </Box>
  );
};
