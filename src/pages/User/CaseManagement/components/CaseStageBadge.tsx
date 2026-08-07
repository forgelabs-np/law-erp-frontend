import { Badge } from "@chakra-ui/react";

import { CaseStage } from "../types/case.types";

interface CaseStageBadgeProps {
  stage: CaseStage;
}

const STAGE_COLORS: Record<CaseStage, string> = {
  // Civil stages
  FILED: "gray",
  UNDER_SUMMONS: "blue",
  RESPONSE_PENDING: "blue",
  MEDIATION: "purple",
  EVIDENCE: "blue",
  ARGUMENT: "blue",
  JUDGMENT_AWAITED: "orange",
  JUDGMENT_DELIVERED: "green",
  APPEAL: "red",
  EXECUTION: "blue",
  CLOSED: "gray",
  // Criminal stages
  FIR_REGISTERED: "gray",
  UNDER_INVESTIGATION: "blue",
  CHARGE_SHEET_FILED: "blue",
  PLEA: "blue",
  TRIAL: "blue",
  SENTENCING: "orange",
};

export const CaseStageBadge = ({ stage }: CaseStageBadgeProps) => {
  const color = STAGE_COLORS[stage] || "gray";

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
      {stage.replace(/_/g, " ")}
    </Badge>
  );
};
