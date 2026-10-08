import {
  Box,
  Button,
  Center,
  Grid,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Eye, Plus, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { CourtCase, RelationType } from "../types/matter.types";
import {
  courtCaseStageLabel,
  formatDate,
  relationTypeLabel,
} from "../utils/matterHelpers";
import { CourtCaseStatusBadge } from "./MatterBadges";

interface CourtCaseChainProps {
  matterNumber?: string;
  courtCases?: CourtCase[];
  currentCourtCaseRef?: string;
  onAddCourtCase?: () => void;
}

/** Eyebrow label describing where the case sits in the proceeding chain. */
const chainEyebrow = (relation?: RelationType): string => {
  switch (relation) {
    case "ORIGINAL":
      return "Original Case";
    case "APPEAL":
      return "Appeal Case";
    case "CROSS_APPEAL":
      return "Cross Appeal";
    case "REMAND":
      return "Remand Case";
    case "REVISION":
      return "Revision Case";
    case "WRIT":
      return "Writ Petition";
    case "REVIEW":
      return "Review Case";
    default:
      return "Court Case";
  }
};

const MetaItem = ({ label, value }: { label: string; value: string }) => (
  <Box minW={0}>
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
      fontWeight="600"
      color="gray.900"
      mt={1}
      lineHeight="1.4"
      wordBreak="break-word"
    >
      {value}
    </Text>
  </Box>
);

/**
 * Vertical connector between case cards.
 *
 * Uses a fixed-height rail so it stays visually continuous no matter how
 * tall the neighbouring cards grow (long court names, extra rows, ...).
 */
const ChainConnector = () => (
  <Center w="100%" h="34px" aria-hidden="true">
    <VStack gap={0} align="center">
      <Box w="1px" h="9px" bg="#9e9a9aff" />
      <Box
        w="7px"
        h="7px"
        borderRadius="full"
        border="1.5px solid"
        borderColor="#9e9a9aff"
        bg="white"
      />
      <Box w="1px" h="9px" bg="#9e9a9aff" />
    </VStack>
  </Center>
);

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

  const openCourtCase = (courtCaseRef: string) => {
    navigate(`/cases/${matterNumber ?? ""}/court-cases/${courtCaseRef}`);
  };

  if (courtCases.length === 0) {
    return (
      <Center
        flexDirection="column"
        gap={3}
        py={12}
        px={6}
        border="1px dashed"
        borderColor="gray.300"
        borderRadius="xl"
        bg="white"
      >
        <Center
          w="12"
          h="12"
          borderRadius="full"
          bg="gray.50"
          border="1px solid"
          borderColor="gray.200"
          color="gray.400"
        >
          <Scale size={20} />
        </Center>
        <VStack gap={1}>
          <Text fontSize="sm" fontWeight="600" color="gray.700">
            No Court Cases
          </Text>
          <Text fontSize="13px" color="gray.500" textAlign="center">
            No court proceedings have been added to this matter yet.
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <VStack gap={0} align="stretch" w="100%">
      {courtCases.map((courtCase, index) => {
        const isCurrent = courtCase.ourCourtCaseRef === currentCourtCaseRef;
        const isLast = index === courtCases.length - 1;
        const accentBorder = isCurrent ? "primary.300" : "gray.200";
        const innerDivider = isCurrent ? "primary.100" : "gray.100";

        return (
          <Box
            key={courtCase.id || courtCase.ourCourtCaseRef}
            w="100%"
            minW={0}
          >
            <Box
              bg={isCurrent ? "primary.50" : "white"}
              border="1.5px solid"
              borderColor={accentBorder}
              borderRadius="xl"
              boxShadow="0 1px 2px rgba(16, 24, 40, 0.04)"
              overflow="hidden"
              cursor="pointer"
              transition="all 0.18s ease"
              onClick={() => openCourtCase(courtCase.ourCourtCaseRef)}
              _hover={{
                borderColor: isCurrent ? "primary.400" : "gray.300",
                boxShadow: "0 4px 14px rgba(16, 24, 40, 0.07)",
              }}
            >
              {/* ── Card header ───────────────────────────────────────── */}
              <HStack
                justify="space-between"
                align="flex-start"
                gap={3}
                px={{ base: 4, md: 5 }}
                pt={{ base: 4, md: 5 }}
                pb={4}
              >
                <HStack gap={3} align="flex-start" minW={0}>
                  <Center
                    w="9"
                    h="9"
                    borderRadius="lg"
                    bg={isCurrent ? "primary.100" : "gray.50"}
                    border="1px solid"
                    borderColor={isCurrent ? "primary.200" : "gray.200"}
                    color={isCurrent ? "primary.600" : "gray.500"}
                    flexShrink={0}
                  >
                    <Scale size={17} />
                  </Center>

                  <Box minW={0}>
                    <Text
                      fontSize="11px"
                      fontWeight="700"
                      letterSpacing="0.08em"
                      textTransform="uppercase"
                      color={isCurrent ? "primary.600" : "gray.500"}
                    >
                      {chainEyebrow(courtCase.relationType)}
                    </Text>
                    <Text
                      fontSize={{ base: "15px", md: "16px" }}
                      fontWeight="700"
                      color="gray.900"
                      mt={1}
                      lineHeight="1.35"
                      wordBreak="break-word"
                    >
                      {courtCase.courtName}
                    </Text>
                  </Box>
                </HStack>

                <HStack gap={1.5} flexShrink={0}>
                  {isCurrent && (
                    <Box
                      bg="primary.500"
                      color="white"
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      fontSize="11px"
                      fontWeight="700"
                      letterSpacing="0.04em"
                    >
                      Current
                    </Box>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    color="gray.500"
                    aria-label={`Open court case ${courtCase.ourCourtCaseRef}`}
                    title="Open court case"
                    px={2}
                    minW="0"
                    _hover={{ bg: "gray.100", color: "gray.800" }}
                    onClick={(event) => {
                      event.stopPropagation();
                      openCourtCase(courtCase.ourCourtCaseRef);
                    }}
                  >
                    <Eye size={16} />
                  </Button>
                </HStack>
              </HStack>

              {/* ── Metadata ──────────────────────────────────────────── */}
              <Box borderTop="1px solid" borderColor={innerDivider} />

              <Grid
                px={{ base: 4, md: 5 }}
                py={4}
                templateColumns={{
                  base: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(4, minmax(0, 1fr))",
                }}
                gap={{ base: 4, md: 5 }}
              >
                <MetaItem
                  label="Case Number"
                  value={courtCase.courtCaseNumber || "-"}
                />
                <MetaItem
                  label="Case Type"
                  value={relationTypeLabel(courtCase.relationType)}
                />
                <MetaItem
                  label="Filed Date"
                  value={formatDate(courtCase.filingDate)}
                />
                <MetaItem
                  label="Current Stage"
                  value={courtCaseStageLabel(courtCase.stage)}
                />
              </Grid>

              {/* ── Footer ────────────────────────────────────────────── */}
              <HStack
                px={{ base: 4, md: 5 }}
                py={3}
                borderTop="1px solid"
                borderColor={innerDivider}
                bg={isCurrent ? "primary.50" : "gray.50"}
                justify="space-between"
                gap={3}
                flexWrap="wrap"
                borderBottomRadius="xl"
              >
                <CourtCaseStatusBadge status={courtCase.status} />

                <HStack gap={{ base: 2, md: 4 }} flexWrap="wrap">
                  <Text fontSize="12px" color="gray.500" fontFamily="monospace">
                    {courtCase.ourCourtCaseRef}
                  </Text>
                  <Text fontSize="12px" color="gray.500">
                    {courtCase.judgeName
                      ? `Judge: ${courtCase.judgeName}`
                      : "No judge assigned"}
                  </Text>
                  {courtCase.eventCount !== undefined && (
                    <Text fontSize="12px" color="gray.500">
                      {courtCase.eventCount}{" "}
                      {courtCase.eventCount === 1 ? "event" : "events"}
                    </Text>
                  )}
                </HStack>
              </HStack>
            </Box>

            {!isLast && <ChainConnector />}
          </Box>
        );
      })}

      {/* ── Next proceeding ────────────────────────────────────────── */}
      {onAddCourtCase && <ChainConnector />}

      {onAddCourtCase && (
        <Box
          as="button"
          // type="button"
          w="100%"
          fontFamily="inherit"
          px={5}
          py={7}
          border="1.5px dashed"
          borderColor="gray.300"
          borderRadius="xl"
          bg="white"
          cursor="pointer"
          transition="all 0.18s ease"
          _hover={{ borderColor: "primary.400", bg: "primary.50" }}
          _focusVisible={{
            outline: "2px solid",
            outlineColor: "primary.500",
            outlineOffset: "2px",
          }}
          onClick={onAddCourtCase}
        >
          <VStack gap={2} align="center">
            <Center
              w="9"
              h="9"
              borderRadius="full"
              border="1px dashed"
              borderColor="gray.300"
              bg="white"
              color="gray.400"
            >
              <Plus size={16} />
            </Center>
            <Text
              fontSize="12px"
              fontWeight="700"
              letterSpacing="0.08em"
              textTransform="uppercase"
              color="gray.600"
            >
              Next Proceeding
            </Text>
            <Text fontSize="13px" color="gray.500" textAlign="center">
              Add a related case or the next proceeding for this matter
            </Text>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};
