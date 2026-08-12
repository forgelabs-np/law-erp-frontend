import { Badge } from "@chakra-ui/react";

import { CaseType } from "../types/case.types";

interface CaseTypeBadgeProps {
  type: CaseType;
}

const TYPE_COLORS: Record<CaseType, string> = {
  CIVIL: "blue",
  CRIMINAL: "red",
};

export const CaseTypeBadge = ({ type }: CaseTypeBadgeProps) => {
  const color = TYPE_COLORS[type] || "gray";

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
      {type}
    </Badge>
  );
};
