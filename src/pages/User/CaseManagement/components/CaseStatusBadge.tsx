import { Badge } from "@chakra-ui/react";

import { CaseStatus } from "../types/case.types";

interface CaseStatusBadgeProps {
  status: CaseStatus;
}

const STATUS_COLORS: Record<CaseStatus, string> = {
  ACTIVE: "green",
  CLOSED: "gray",
  ARCHIVED: "orange",
};

export const CaseStatusBadge = ({ status }: CaseStatusBadgeProps) => {
  const color = STATUS_COLORS[status] || "gray";

  return (
    <Badge
      bg={`${color}.100`}
      color={`${color}.700`}
      px="2"
      py="1"
      borderRadius="md"
      fontSize="xs"
      fontWeight="600"
    >
      {status}
    </Badge>
  );
};
