import { Box, HStack, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";

import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";

import {
  CourtCaseStage,
  MatterType,
} from "../types/matter.types";
import { courtCaseStageLabel, getStageOptions } from "../utils/matterHelpers";
import { CourtCaseStageBadge } from "./MatterBadges";
import { FieldSelect } from "./ui";

interface StageChangeMenuProps {
  currentStage: CourtCaseStage;
  matterType: MatterType;
  disabled?: boolean;
  onStageChange: (newStage: CourtCaseStage) => void;
}

/**
 * Controlled stage selector. The backend is the single authority on
 * transition validity; the frontend only offers a curated suggestion list
 * and confirms before submitting.
 */
export const StageChangeMenu = ({
  currentStage,
  matterType,
  disabled = false,
  onStageChange,
}: StageChangeMenuProps) => {
  const confirm = useDisclosure();
  const [pendingStage, setPendingStage] = useState<CourtCaseStage | null>(null);

  const options = getStageOptions(matterType);

  const handleSelect = (value: string) => {
    if (!value || value === currentStage) return;
    setPendingStage(value as CourtCaseStage);
    confirm.onOpen();
  };

  const handleConfirm = () => {
    if (pendingStage) onStageChange(pendingStage);
    confirm.onClose();
    setPendingStage(null);
  };

  return (
    <>
      <HStack gap={3} flexWrap="wrap">
        <CourtCaseStageBadge stage={currentStage} />
        <Box w="220px">
          <FieldSelect
            size="sm"
            disabled={disabled}
            value=""
            placeholder={`Move to ${currentStage ? "next stage" : "new stage"}...`}
            onChange={handleSelect}
          >
            {options
              .filter((stage) => stage !== currentStage)
              .map((stage) => (
                <option key={stage} value={stage}>
                  {courtCaseStageLabel(stage)}
                </option>
              ))}
          </FieldSelect>
        </Box>
      </HStack>

      <ConfirmationDialog
        open={confirm.open}
        onClose={confirm.onClose}
        title="Change Stage?"
        action={`move this case to "${pendingStage ? courtCaseStageLabel(pendingStage) : ""}"`}
        handleSubmit={handleConfirm}
      />
    </>
  );
};
