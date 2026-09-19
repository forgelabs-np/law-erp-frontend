import { Box, Button, HStack, Text } from "@chakra-ui/react";
import {
  Activity,
  ArrowLeft,
  Building2,
  CalendarDays,
  Copy,
  FileText,
  Hash,
  Landmark,
} from "lucide-react";
import { ReactNode } from "react";

import { MatterResponse } from "../types/matter.types";
import { formatDate, matterTypeLabel } from "../utils/matterHelpers";
import { MatterStatusBadge } from "./MatterBadges";
import { NextEventBanner } from "./NextEventBanner";
import { MetaItem } from "./ui";

interface MatterHeaderCardProps {
  matter: MatterResponse;
  actions?: ReactNode;
  onBack?: () => void;
}

/** Matches the previous `value || "-"` fallback so empty values still read as "-". */
const text = (value?: string | null): string => value || "-";

/**
 * Compact matter identity bar shown above the Matter Detail tabs.
 *
 * Presentation only: the back handler, action buttons, permission gating and
 * all displayed values come from the caller / matter response unchanged.
 */
export const MatterHeaderCard = ({
  matter,
  actions,
  onBack,
}: MatterHeaderCardProps) => {
  const copyMatterNumber = () => {
    navigator.clipboard?.writeText(matter.matterNumber);
  };

  console.log("matter", matter);

  const currentCourt = text(
    matter.currentCourtCase?.courtName ?? matter.originatingCourtLevel
  );
  const courtCaseNumber = text(
    matter.currentCourtCase?.courtCaseNumber ?? matter.courtCaseNumber
  );
  const stage = text(
    matter.currentCourtCase?.stage
      ? matter.currentCourtCase.stage.replace(/_/g, " ")
      : null
  );

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
      {onBack && (
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
          mb={2}
          _hover={{ color: "gray.800", bg: "gray.50" }}
        >
          <ArrowLeft size={13} /> Matters
        </Button>
      )}

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
            lineHeight="1.25"
            letterSpacing="-0.01em"
            wordBreak="break-word"
          >
            {matter.title}
          </Text>
          <MatterStatusBadge status={matter.status} />
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
        <HStack gap={1} align="center" minW={0}>
          <MetaItem icon={Hash} value={matter.matterNumber} mono />
          <Button
            variant="ghost"
            size="xs"
            onClick={copyMatterNumber}
            aria-label="Copy matter number"
            title="Copy matter number"
            color="gray.400"
            h="auto"
            py={0.5}
            px={1.5}
            _hover={{ color: "gray.700", bg: "gray.50" }}
          >
            <Copy size={12} />
          </Button>
        </HStack>

        <MetaItem icon={Landmark} value={matterTypeLabel(matter.matterType)} />
        <MetaItem icon={Building2} value={currentCourt} />
        <MetaItem icon={FileText} value={courtCaseNumber} />
        <MetaItem icon={Activity} value={stage} />
        <MetaItem icon={CalendarDays} value={formatDate(matter.filingDate)} />
      </HStack>

      {matter.nextEvent && <NextEventBanner event={matter.nextEvent} mt={4} />}
    </Box>
  );
};
