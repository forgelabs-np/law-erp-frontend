import { Box, Text, VStack } from "@chakra-ui/react";
import { useMemo } from "react";

import { CourtCase, CourtCaseStatus } from "../types/matter.types";
import { courtCaseStatusLabel, courtLevelLabel } from "../utils/matterHelpers";

interface CaseSummaryCardProps {
  courtCases: CourtCase[];
  currentCourtCase?: CourtCase;
  currentStatus?: CourtCaseStatus;
}

interface SummaryRow {
  label: string;
  value: string;
}

const SummaryRowItem = ({ label, value }: SummaryRow) => (
  <VStack
    gap={1}
    align="stretch"
    py={4}
    borderBottom="1px solid"
    borderColor="gray.100"
    _last={{ borderBottom: "none", pb: 5 }}
  >
    <Text
      fontSize="11px"
      fontWeight="700"
      letterSpacing="0.07em"
      textTransform="uppercase"
      color="gray.500"
    >
      {label}
    </Text>
    <Text
      fontSize="14px"
      fontWeight="700"
      color="gray.900"
      lineHeight="1.45"
      wordBreak="break-word"
    >
      {value}
    </Text>
  </VStack>
);

/**
 * Compact summary of the matter's court-case chain.
 * Derived only from the existing court case data - no new calculations.
 */
export const CaseSummaryCard = ({
  courtCases,
  currentCourtCase,
  currentStatus,
}: CaseSummaryCardProps) => {
  const jurisdictions = useMemo(() => {
    const labels: string[] = [];
    courtCases.forEach((courtCase) => {
      const label = courtLevelLabel(courtCase.courtLevel);
      if (label && label !== "-" && !labels.includes(label)) {
        labels.push(label);
      }
    });
    return labels.join(", ");
  }, [courtCases]);

  const status = currentStatus ?? currentCourtCase?.status;

  const rows: SummaryRow[] = [
    { label: "Total Cases", value: String(courtCases.length) },
    { label: "Jurisdictions", value: jurisdictions || "-" },
    {
      label: "Current Standing",
      value: status ? courtCaseStatusLabel(status) : "-",
    },
    { label: "Current Court", value: currentCourtCase?.courtName || "-" },
  ];

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      boxShadow="0 1px 2px rgba(16, 24, 40, 0.04)"
      overflow="hidden"
      w="100%"
    >
      <Box
        px={5}
        py={3.5}
        borderBottom="1px solid"
        borderColor="gray.100"
        bg="gray.50"
      >
        <Text
          fontSize="11px"
          fontWeight="700"
          letterSpacing="0.09em"
          textTransform="uppercase"
          color="gray.600"
        >
          Case Summary
        </Text>
      </Box>

      <VStack gap={0} align="stretch" px={5}>
        {rows.map((row) => (
          <SummaryRowItem key={row.label} {...row} />
        ))}
      </VStack>
    </Box>
  );
};
