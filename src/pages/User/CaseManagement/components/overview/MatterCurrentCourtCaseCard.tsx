import { Box, Button, Grid, HStack, Text } from "@chakra-ui/react";
import { Gavel, Scale } from "lucide-react";

import { CourtCase } from "../../types/matter.types";
import {
  courtCaseStageLabel,
  courtLevelLabel,
  formatDate,
} from "../../utils/matterHelpers";
import { CourtCaseStageBadge, CourtCaseStatusBadge } from "../MatterBadges";
import { OverviewCard } from "./OverviewCard";
import { OverviewField } from "./OverviewField";

interface MatterCurrentCourtCaseCardProps {
  /** The active (leaf) proceeding on this matter. */
  courtCase: CourtCase;
  /** Opens the existing record-judgment flow. */
  onRecordJudgment: () => void;
}

/**
 * Summary of the matter's current court case, including the judgment block and
 * the existing Record Judgment action. Read-only apart from that callback.
 */
export const MatterCurrentCourtCaseCard = ({
  courtCase,
  onRecordJudgment,
}: MatterCurrentCourtCaseCardProps) => {
  const hasJudgment = Boolean(
    courtCase.judgmentDate || courtCase.judgmentSummary
  );

  return (
    <OverviewCard
      title="Current Court Case"
      description="The active proceeding on this matter."
      icon={Scale}
    >
      <HStack gap={2} flexWrap="wrap" mb={5}>
        <CourtCaseStatusBadge status={courtCase.status} />
        <CourtCaseStageBadge stage={courtCase.stage} />
        {courtCase.judgeName && (
          <HStack gap={1.5} color="gray.500">
            <Gavel size={13} />
            <Text fontSize="xs" fontWeight="600">
              {courtCase.judgeName}
            </Text>
          </HStack>
        )}
      </HStack>

      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(3, minmax(0, 1fr))",
        }}
        gap={5}
      >
        <OverviewField
          label="Reference"
          value={courtCase.ourCourtCaseRef}
          mono
        />
        <OverviewField
          label="Court Level"
          value={courtLevelLabel(courtCase.courtLevel)}
        />
        <OverviewField
          label="Stage"
          value={courtCaseStageLabel(courtCase.stage)}
        />
      </Grid>

      {hasJudgment && (
        <Box
          mt={5}
          p={4}
          bg="green.50"
          border="1px solid"
          borderColor="green.200"
          borderRadius="lg"
        >
          <HStack gap={2} mb={2}>
            <Gavel size={16} color="#15803d" />
            <Text fontSize="sm" fontWeight="700" color="green.800">
              Judgment
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.800">
            Delivered on {formatDate(courtCase.judgmentDate)}
            {courtCase.appealDeadline
              ? ` · Appeal deadline: ${formatDate(courtCase.appealDeadline)}`
              : ""}
          </Text>
          {courtCase.judgmentSummary && (
            <Text fontSize="sm" color="gray.700" mt={1} lineHeight="1.7">
              {courtCase.judgmentSummary}
            </Text>
          )}
        </Box>
      )}

      {!courtCase.judgmentSummary && (
        <Button mt={5} variant="outline" size="sm" onClick={onRecordJudgment}>
          <Gavel size={14} /> Record Judgment
        </Button>
      )}
    </OverviewCard>
  );
};
