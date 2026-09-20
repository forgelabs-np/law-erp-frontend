import { Box, Button, HStack, Text } from "@chakra-ui/react";
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  CalendarDays,
  Gavel,
} from "lucide-react";
import { ReactNode } from "react";

import { CourtCase } from "../types/matter.types";
import { courtLevelLabel, formatDate } from "../utils/matterHelpers";
import {
  CourtCaseStageBadge,
  CourtCaseStatusBadge,
  RelationTypeBadge,
} from "./MatterBadges";
import { MetaItem } from "./ui";

interface CourtCaseHeaderCardProps {
  courtCase: CourtCase;
  /** Number of recorded Tarik/Peshi events on this proceeding. */
  eventCount: number;
  actions?: ReactNode;
  onBack?: () => void;
}

/** Matches the previous `value || "-"` fallback so empty values still read as "-". */
const text = (value?: string | null): string => value || "-";

/**
 * Compact court case identity bar shown above the Court Case Detail tabs.
 *
 * Presentation only: the back handler, action buttons and permission gating
 * stay with the page, and every value comes from the loaded court case.
 */
export const CourtCaseHeaderCard = ({
  courtCase,
  eventCount,
  actions,
  onBack,
}: CourtCaseHeaderCardProps) => {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      px={{ base: 4, md: 5 }}
      py={4}
    >
      <HStack gap={1.5} align="center" flexWrap="wrap" mb={2}>
        {onBack && (
          <>
            <Button
              variant="ghost"
              size="xs"
              onClick={onBack}
              color="gray.500"
              fontSize="xs"
              fontWeight="500"
              h="auto"
              py={0.5}
              px={1.5}
              _hover={{ color: "gray.800", bg: "gray.50" }}
            >
              <ArrowLeft size={13} /> Matter
            </Button>
            <Text fontSize="xs" color="gray.300">
              /
            </Text>
          </>
        )}
        <Text fontSize="xs" color="gray.500" fontFamily="monospace">
          {courtCase.ourCourtCaseRef}
        </Text>
      </HStack>

      <HStack
        justify="space-between"
        align="flex-start"
        gap={4}
        flexWrap="wrap"
      >
        <HStack gap={3} align="center" flexWrap="wrap" minW={0}>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="700"
            color="gray.900"
            fontFamily="monospace"
            lineHeight="1.25"
            letterSpacing="-0.01em"
            wordBreak="break-word"
          >
            {courtCase.courtCaseNumber}
          </Text>
          <HStack gap={2} flexWrap="wrap">
            <RelationTypeBadge relation={courtCase.relationType} />
            <CourtCaseStatusBadge status={courtCase.status} />
            <CourtCaseStageBadge stage={courtCase.stage} />
          </HStack>
        </HStack>

        {actions && (
          <HStack gap={2} flexWrap="wrap" flexShrink={0}>
            {actions}
          </HStack>
        )}
      </HStack>

      <HStack
        gap={{ base: 3, md: 6 }}
        rowGap={2}
        mt={3}
        flexWrap="wrap"
        align="center"
      >
        <MetaItem
          icon={Building2}
          value={`${text(courtCase.courtName)} (${courtLevelLabel(
            courtCase.courtLevel
          )})`}
        />
        <MetaItem
          icon={CalendarDays}
          value={formatDate(courtCase.filingDate)}
        />
        <MetaItem icon={Gavel} value={text(courtCase.judgeName)} />
        <MetaItem
          icon={CalendarClock}
          value={`${eventCount} ${eventCount === 1 ? "event" : "events"}`}
        />
      </HStack>
    </Box>
  );
};
