import { Badge } from "@chakra-ui/react";

import { DocumentStatus, DocumentVisibility } from "@/shared/types/documents";
import {
  documentStatusLabel,
  documentVisibilityLabel,
  unknownDocumentStatusLabel,
} from "@/shared/utils/documents";

interface BadgeTone {
  bg: string;
  color: string;
}

const STATUS_TONES: Record<DocumentStatus, BadgeTone> = {
  ACTIVE: { bg: "green.50", color: "green.700" },
  ARCHIVED: { bg: "gray.100", color: "gray.600" },
};

const VISIBILITY_TONES: Record<DocumentVisibility, BadgeTone> = {
  PRIVATE: { bg: "gray.100", color: "gray.700" },
  SHARED: { bg: "blue.50", color: "blue.700" },
};

const DocumentBadge = ({ label, tone }: { label: string; tone: BadgeTone }) => (
  <Badge
    px={2}
    py={0.5}
    borderRadius="full"
    fontSize="xs"
    fontWeight="600"
    bg={tone.bg}
    color={tone.color}
    whiteSpace="nowrap"
  >
    {label}
  </Badge>
);

export const DocumentStatusBadge = ({ status }: { status: DocumentStatus }) => (
  <DocumentBadge
    // Unknown future server values fall back to a neutral title-cased label.
    label={documentStatusLabel[status] ?? unknownDocumentStatusLabel(status)}
    tone={STATUS_TONES[status] ?? STATUS_TONES.ACTIVE}
  />
);

export const DocumentVisibilityBadge = ({
  visibility,
}: {
  visibility: DocumentVisibility;
}) => (
  <DocumentBadge
    label={documentVisibilityLabel[visibility]}
    tone={VISIBILITY_TONES[visibility] ?? VISIBILITY_TONES.PRIVATE}
  />
);
