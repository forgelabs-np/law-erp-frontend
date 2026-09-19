import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  Landmark,
  LucideIcon,
  Users,
} from "lucide-react";

import { MatterSummary } from "../types/matter.types";
import { formatDate } from "../utils/matterHelpers";
import { MatterStatusBadge, MatterTypeBadge } from "./MatterBadges";

interface MatterCardProps {
  matter: MatterSummary;
  /** Existing open-matter navigation, unchanged from the previous table action. */
  onOpen: (matterNumber: string) => void;
}

/** Small icon + value pair used for the card's supporting metadata. */
const MatterMetaRow = ({
  icon: Icon,
  value,
}: {
  icon: LucideIcon;
  value: string;
}) => (
  <HStack gap={2} align="center" minW={0} color="gray.400">
    <Icon size={14} style={{ flexShrink: 0 }} />
    <Text
      fontSize="sm"
      color="gray.600"
      fontWeight="500"
      lineClamp={1}
      minW={0}
    >
      {value}
    </Text>
  </HStack>
);

/**
 * A single matter rendered as a card.
 *
 * Presentation only - the card reads from the existing `MatterSummary`
 * payload and delegates opening to the caller. No data fetching or new
 * business logic lives here.
 */
export const MatterCard = ({ matter, onOpen }: MatterCardProps) => {
  const partiesCount = matter.parties?.length ?? 0;
  const partiesLabel =
    partiesCount === 0
      ? "No parties"
      : `${partiesCount} ${partiesCount === 1 ? "Party" : "Parties"}`;

  return (
    <VStack
      align="stretch"
      gap={0}
      h="100%"
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      boxShadow="0 1px 2px rgba(16, 24, 40, 0.04)"
      overflow="hidden"
      transition="all 0.18s ease"
      _hover={{
        borderColor: "primary.200",
        boxShadow: "0 6px 16px rgba(16, 24, 40, 0.08)",
        transform: "translateY(-1px)",
      }}
    >
      {/* Identity: icon, type, status, title, matter number */}
      <VStack align="stretch" gap={3.5} p={5}>
        <HStack justify="space-between" align="center" gap={2}>
          <HStack gap={2.5} minW={0}>
            <Box
              w="9"
              h="9"
              borderRadius="lg"
              bg="primary.50"
              color="primary.600"
              display="grid"
              placeItems="center"
              flexShrink={0}
            >
              <FileText size={16} />
            </Box>
            <MatterTypeBadge type={matter.matterType} />
          </HStack>
          <MatterStatusBadge status={matter.status} />
        </HStack>

        <VStack align="stretch" gap={1} minW={0}>
          <Text
            fontSize="md"
            fontWeight="600"
            color="gray.900"
            lineHeight="1.4"
            lineClamp={2}
            wordBreak="break-word"
          >
            {matter.title}
          </Text>
          <Text
            fontSize="sm"
            color="gray.500"
            fontFamily="monospace"
            lineClamp={1}
          >
            {matter.matterNumber}
          </Text>
        </VStack>
      </VStack>

      <Box borderTop="1px solid" borderColor="gray.100" />

      {/* Supporting metadata */}
      <VStack align="stretch" gap={2.5} px={5} py={4} flex="1">
        <MatterMetaRow icon={Users} value={partiesLabel} />
        {matter.currentCourt && (
          <MatterMetaRow icon={Landmark} value={matter.currentCourt} />
        )}
      </VStack>

      {/* Footer: last update + existing open action */}
      <HStack
        justify="space-between"
        align="center"
        gap={3}
        px={5}
        py={3.5}
        borderTop="1px solid"
        borderColor="gray.100"
        bg="gray.50"
      >
        <HStack gap={1.5} color="gray.400" minW={0}>
          <CalendarDays size={14} style={{ flexShrink: 0 }} />
          <Text fontSize="xs" color="gray.500" fontWeight="500" lineClamp={1}>
            {matter.updatedAt
              ? `Updated ${formatDate(matter.updatedAt)}`
              : "Not updated yet"}
          </Text>
        </HStack>

        <Button
          variant="solid"
          size="sm"
          flexShrink={0}
          onClick={() => onOpen(matter.matterNumber)}
          color="white"
          backgroundColor={"primary.600"}
        >
          View Matter
          <ArrowRight size={14} />
        </Button>
      </HStack>
    </VStack>
  );
};
