import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { CornerDownRight, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { CourtCase } from "../types/matter.types";
import { courtCaseStageLabel, formatDate } from "../utils/matterHelpers";
import { CourtCaseStageBadge, CourtCaseStatusBadge, RelationTypeBadge } from "./MatterBadges";

interface CourtCaseChainProps {
  matterNumber?: string;
  courtCases?: CourtCase[];
  currentCourtCaseRef?: string;
  onAddCourtCase?: () => void;
}

/**
 * Vertical chain showing Original Case → Appeal → Further Appeal / Remand ...
 * The current (leaf) court case is highlighted.
 */
export const CourtCaseChain = ({
  matterNumber,
  courtCases = [],
  currentCourtCaseRef,
  onAddCourtCase,
}: CourtCaseChainProps) => {
  const navigate = useNavigate();

  if (courtCases.length === 0) {
    return (
      <Box py={8} textAlign="center">
        <Text fontSize="sm" color="gray.500">
          No court cases recorded yet
        </Text>
      </Box>
    );
  }

  return (
    <Stack gap={0} position="relative">
      {courtCases.map((courtCase, index) => {
        const isCurrent = courtCase.ourCourtCaseRef === currentCourtCaseRef;
        const isLast = index === courtCases.length - 1;

        return (
          <HStack key={courtCase.id || courtCase.ourCourtCaseRef} gap={4} align="stretch">
            {/* Left rail */}
            <Stack align="center" gap={0} w="6" flexShrink={0}>
              <Box
                w="6"
                h="6"
                borderRadius="full"
                bg={isCurrent ? "blue.500" : "gray.200"}
                color={isCurrent ? "white" : "gray.500"}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
                zIndex={1}
              >
                <Scale size={12} />
              </Box>
              {!isLast && <Box flex={1} w="2px" bg="gray.200" minH="16" />}
            </Stack>

            {/* Case card */}
            <Box
              flex={1}
              mb={4}
              bg={isCurrent ? "blue.50" : "white"}
              border="1px solid"
              borderColor={isCurrent ? "blue.200" : "gray.200"}
              borderRadius="lg"
              p={4}
              cursor="pointer"
              onClick={() =>
                navigate(
                  `/cases/${matterNumber ?? ""}/court-cases/${courtCase.ourCourtCaseRef}`
                )
              }
            >
              <HStack justify="space-between" align="flex-start" flexWrap="wrap" gap={2}>
                <Stack gap={2}>
                  <HStack gap={2} flexWrap="wrap">
                    <RelationTypeBadge relation={courtCase.relationType} />
                    <CourtCaseStatusBadge status={courtCase.status} />
                    <CourtCaseStageBadge stage={courtCase.stage} />
                    {isCurrent && (
                      <Box
                        bg="blue.500"
                        color="white"
                        px={2}
                        py={0.5}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="600"
                      >
                        Current
                      </Box>
                    )}
                  </HStack>
                  <Text fontSize="md" fontWeight="600" color="gray.900" fontFamily="monospace">
                    {courtCase.ourCourtCaseRef}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {courtCase.courtName} · {courtCase.courtCaseNumber}
                  </Text>
                </Stack>

                <Stack gap={1} align="flex-end" textAlign="right">
                  <Text fontSize="xs" color="gray.500">
                    Filed {formatDate(courtCase.filingDate)}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {courtCase.judgeName ? `Judge: ${courtCase.judgeName}` : "No judge assigned"}
                  </Text>
                  {courtCase.eventCount !== undefined && (
                    <Text fontSize="xs" color="gray.500">
                      {courtCase.eventCount} {courtCase.eventCount === 1 ? "event" : "events"}
                    </Text>
                  )}
                </Stack>
              </HStack>

              {isCurrent && courtCase.stage && (
                <Text fontSize="xs" color="blue.600" mt={2}>
                  Stage: {courtCaseStageLabel(courtCase.stage)} — click to open
                </Text>
              )}
            </Box>
          </HStack>
        );
      })}

      {onAddCourtCase && (
        <HStack gap={4} align="center">
          <Box w="6" flexShrink={0} display="flex" justifyContent="center">
            <CornerDownRight size={16} color="#9ca3af" />
          </Box>
          <Button variant="outline" size="sm" onClick={onAddCourtCase}>
            Add Court Case / Proceeding
          </Button>
        </HStack>
      )}
    </Stack>
  );
};
