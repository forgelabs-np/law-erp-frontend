import { Badge } from "@chakra-ui/react";

import {
  CourtCaseStatus,
  CourtCaseStage,
  CourtEventStatus,
  CourtEventType,
  MatterStatus,
  MatterType,
  RelationType,
} from "../types/matter.types";
import {
  courtCaseStageLabel,
  courtCaseStatusColorScheme,
  courtCaseStatusLabel,
  courtEventStatusColorScheme,
  courtEventStatusLabel,
  courtEventTypeLabel,
  matterStatusColorScheme,
  matterStatusLabel,
  matterTypeColorScheme,
  matterTypeLabel,
  relationTypeColorScheme,
  relationTypeLabel,
} from "../utils/matterHelpers";

export const MatterTypeBadge = ({ type }: { type: MatterType }) => (
  <Badge
    colorScheme={matterTypeColorScheme(type)}
    px={2.5}
    py={0.5}
    borderRadius="full"
    fontSize="xs"
    fontWeight="600"
  >
    {matterTypeLabel(type)}
  </Badge>
);

export const MatterStatusBadge = ({ status }: { status: MatterStatus }) => (
  <Badge
    colorScheme={matterStatusColorScheme(status)}
    px={2.5}
    py={0.5}
    borderRadius="full"
    fontSize="xs"
    fontWeight="600"
  >
    {matterStatusLabel(status)}
  </Badge>
);

export const CourtCaseStatusBadge = ({
  status,
}: {
  status: CourtCaseStatus;
}) => (
  <Badge
    colorScheme={courtCaseStatusColorScheme(status)}
    px={2.5}
    py={0.5}
    borderRadius="full"
    fontSize="xs"
    fontWeight="600"
  >
    {courtCaseStatusLabel(status)}
  </Badge>
);

export const CourtCaseStageBadge = ({ stage }: { stage: CourtCaseStage }) => (
  <Badge
    colorScheme="blue"
    variant="subtle"
    px={2.5}
    py={0.5}
    borderRadius="full"
    fontSize="xs"
    fontWeight="600"
  >
    {courtCaseStageLabel(stage)}
  </Badge>
);

export const CourtEventTypeBadge = ({ type }: { type: CourtEventType }) => (
  <Badge
    colorScheme="purple"
    px={2}
    py={0.5}
    borderRadius="md"
    fontSize="xs"
    fontWeight="600"
  >
    {courtEventTypeLabel(type)}
  </Badge>
);

export const CourtEventStatusBadge = ({
  status,
}: {
  status: CourtEventStatus;
}) => (
  <Badge
    colorScheme={courtEventStatusColorScheme(status)}
    px={2.5}
    py={0.5}
    borderRadius="full"
    fontSize="xs"
    fontWeight="600"
  >
    {courtEventStatusLabel(status)}
  </Badge>
);

export const RelationTypeBadge = ({ relation }: { relation: RelationType }) => (
  <Badge
    colorScheme={relationTypeColorScheme(relation)}
    px={2.5}
    py={0.5}
    borderRadius="full"
    fontSize="xs"
    fontWeight="600"
  >
    {relationTypeLabel(relation)}
  </Badge>
);
