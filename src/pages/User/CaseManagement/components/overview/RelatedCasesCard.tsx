import { Box, Center, HStack, Text, VStack } from "@chakra-ui/react";
import { ArrowRight, Link2, Scale } from "lucide-react";
import { useMemo } from "react";

import { CourtCase } from "../../types/matter.types";
import {
  courtCaseStageLabel,
  formatDate,
  relationTypeLabel,
} from "../../utils/matterHelpers";
import { OverviewCard } from "./OverviewCard";

interface RelatedCasesCardProps {
  /** Full court-case chain of the matter, oldest first. */
  courtCases: CourtCase[];
  /** Reference of the court case currently being viewed. */
  currentCourtCaseRef?: string;
  /** Navigates to another court case using the existing route. */
  onOpenCase?: (courtCaseRef: string) => void;
}

/**
 * Compact view of the matter's proceeding chain, highlighting the case
 * currently open. Read-only presentation of `matter.courtCases`.
 */
export const RelatedCasesCard = ({
  courtCases,
  currentCourtCaseRef,
  onOpenCase,
}: RelatedCasesCardProps) => {
  const ordered = useMemo(() => {
    const original = courtCases.filter(
      (item) => item.relationType === "ORIGINAL"
    );
    const rest = courtCases.filter((item) => item.relationType !== "ORIGINAL");
    return [...original, ...rest];
  }, [courtCases]);

  return (
    <OverviewCard
      title="Case Chain"
      description="How this proceeding fits into the matter."
      icon={Link2}
    >
      {ordered.length === 0 ? (
        <Center flexDirection="column" gap={2} py={6}>
          <Center
            w="10"
            h="10"
            borderRadius="full"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            color="gray.400"
          >
            <Scale size={18} />
          </Center>
          <Text fontSize="13px" fontWeight="600" color="gray.700">
            No related cases
          </Text>
          <Text fontSize="12px" color="gray.500" textAlign="center">
            This matter has no other proceedings recorded.
          </Text>
        </Center>
      ) : (
        <VStack gap={2} align="stretch">
          {ordered.map((courtCase) => {
            const isCurrent = courtCase.ourCourtCaseRef === currentCourtCaseRef;
            const isClickable = !!onOpenCase && !isCurrent;

            return (
              <Box
                key={courtCase.id || courtCase.ourCourtCaseRef}
                p={3}
                borderRadius="lg"
                border="1px solid"
                borderColor={isCurrent ? "primary.200" : "gray.200"}
                bg={isCurrent ? "primary.50" : "white"}
                cursor={isClickable ? "pointer" : "default"}
                transition="all 0.18s ease"
                onClick={
                  isClickable
                    ? () => onOpenCase?.(courtCase.ourCourtCaseRef)
                    : undefined
                }
                _hover={
                  isClickable
                    ? { borderColor: "primary.300", boxShadow: "sm" }
                    : undefined
                }
              >
                <HStack justify="space-between" gap={2} align="flex-start">
                  <Box minW={0}>
                    <Text
                      fontSize="10px"
                      fontWeight="700"
                      letterSpacing="0.07em"
                      textTransform="uppercase"
                      color={isCurrent ? "primary.600" : "gray.500"}
                    >
                      {relationTypeLabel(courtCase.relationType)}
                      {isCurrent ? " · Current" : ""}
                    </Text>
                    <Text
                      fontSize="13px"
                      fontWeight="700"
                      color="gray.900"
                      mt={1}
                      lineHeight="1.4"
                      wordBreak="break-word"
                    >
                      {courtCase.courtName}
                    </Text>
                  </Box>
                  {isClickable && <ArrowRight size={14} color="#9CA3AF" />}
                </HStack>

                <HStack gap={2} mt={1.5} flexWrap="wrap">
                  <Text fontSize="11px" color="gray.500" fontFamily="monospace">
                    {courtCase.courtCaseNumber || "-"}
                  </Text>
                  <Text fontSize="11px" color="gray.400">
                    ·
                  </Text>
                  <Text fontSize="11px" color="gray.500">
                    {courtCaseStageLabel(courtCase.stage)}
                  </Text>
                  <Text fontSize="11px" color="gray.400">
                    ·
                  </Text>
                  <Text fontSize="11px" color="gray.500">
                    {formatDate(courtCase.filingDate)}
                  </Text>
                </HStack>
              </Box>
            );
          })}
        </VStack>
      )}
    </OverviewCard>
  );
};
