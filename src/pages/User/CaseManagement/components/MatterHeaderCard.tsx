import {
  Box,
  Button,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

import { MatterResponse } from "../types/matter.types";
import { formatDate, matterStatusLabel, matterTypeLabel } from "../utils/matterHelpers";
import { MatterStatusBadge, MatterTypeBadge } from "./MatterBadges";
import { NextEventBanner } from "./NextEventBanner";

interface MatterHeaderCardProps {
  matter: MatterResponse;
  actions?: ReactNode;
  onBack?: () => void;
}

export const MatterHeaderCard = ({
  matter,
  actions,
  onBack,
}: MatterHeaderCardProps) => {
  const copyMatterNumber = () => {
    navigator.clipboard?.writeText(matter.matterNumber);
  };

  const quickInfo: Array<{ label: string; value?: string | null }> = [
    { label: "Type", value: matterTypeLabel(matter.matterType) },
    { label: "Status", value: matterStatusLabel(matter.status) },
    {
      label: "Current Court",
      value:
        matter.currentCourtCase?.courtName ??
        matter.courtName ??
        null,
    },
    {
      label: "Court Case No.",
      value: matter.currentCourtCase?.courtCaseNumber ?? matter.courtCaseNumber ?? null,
    },
    {
      label: "Stage",
      value: matter.currentCourtCase?.stage
        ? matter.currentCourtCase.stage.replace(/_/g, " ")
        : null,
    },
    { label: "Filed", value: formatDate(matter.filingDate) },
  ];

  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      p={6}
    >
      <HStack gap={2} mb={4}>
        {onBack && (
          <Button variant="ghost" size="xs" onClick={onBack}>
            <ArrowLeft size={14} /> Matters
          </Button>
        )}
        <Text fontSize="sm" color="gray.500">
          /
        </Text>
        <Text fontSize="sm" color="gray.900" fontWeight="600">
          {matter.matterNumber}
        </Text>
      </HStack>

      <HStack gap={3} mb={4}>
        <Text
          fontSize="3xl"
          fontWeight="700"
          color="gray.900"
          fontFamily="monospace"
        >
          {matter.matterNumber}
        </Text>
        <Button variant="ghost" size="xs" onClick={copyMatterNumber} color="gray.500">
          Copy
        </Button>
      </HStack>

      <HStack justify="space-between" align="flex-start" mb={6} flexWrap="wrap" gap={4}>
        <Stack gap={3} minW={0}>
          <Text fontSize="2xl" fontWeight="700" color="gray.900">
            {matter.title}
          </Text>
          <HStack gap={2} flexWrap="wrap">
            <MatterTypeBadge type={matter.matterType} />
            <MatterStatusBadge status={matter.status} />
          </HStack>
        </Stack>

        {actions && <HStack gap={2} flexWrap="wrap">{actions}</HStack>}
      </HStack>

      {quickInfo.length > 0 && (
        <Box
          bg="gray.50"
          borderRadius="lg"
          p={4}
          border="1px solid"
          borderColor="gray.100"
        >
          <HStack gap={6} flexWrap="wrap">
            {quickInfo.map((info) => (
              <HStack key={info.label} gap={2} align="center">
                <Text fontSize="sm" color="gray.500">
                  {info.label}:
                </Text>
                <Text fontSize="sm" fontWeight="600" color="gray.900">
                  {info.value || "-"}
                </Text>
              </HStack>
            ))}
          </HStack>
        </Box>
      )}

      {matter.nextEvent && <NextEventBanner event={matter.nextEvent} mt={4} />}
    </Box>
  );
};
