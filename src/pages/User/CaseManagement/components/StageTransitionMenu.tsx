import { Text } from "@chakra-ui/react";

import { CaseStage, CaseType, CaseStatus } from "../types/case.types";
import { getNextStages } from "../utils/stageTransitions";

interface StageTransitionMenuProps {
  currentStage: CaseStage;
  caseType: CaseType;
  status: CaseStatus;
  onStageChange: (newStage: CaseStage) => void;
}

export const StageTransitionMenu = ({
  currentStage,
  caseType,
  status,
  onStageChange,
}: StageTransitionMenuProps) => {
  const isClosed = status === "CLOSED";
  const nextStages = isClosed ? [] : getNextStages(currentStage, caseType);

  // Always allow transitioning to CLOSED unless already closed
  const canClose = !isClosed && currentStage !== "CLOSED";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStageChange(e.target.value as CaseStage);
  };

  return (
    <select
      value={currentStage}
      onChange={handleChange}
      disabled={isClosed}
      title={isClosed ? "Cannot change stage of a closed case" : undefined}
      style={{
        padding: "4px 8px",
        borderRadius: "6px",
        border: isClosed ? "1px solid #e2e8f0" : "1px solid #3182ce",
        fontSize: "14px",
        fontWeight: "600",
        color: isClosed ? "#a0aec0" : "#3182ce",
        cursor: isClosed ? "not-allowed" : "pointer",
        backgroundColor: "transparent",
      }}
    >
      <option value={currentStage} disabled>
        {currentStage.replace(/_/g, " ")}
      </option>
      {nextStages.map((stage) => (
        <option key={stage} value={stage}>
          {stage.replace(/_/g, " ")}
        </option>
      ))}
      {canClose && (
        <option value="CLOSED" style={{ color: "#e53e3e" }}>
          Close Case
        </option>
      )}
    </select>
  );
};
