import { Box, Button, HStack, Stack, Text, Tooltip } from "@chakra-ui/react";
import { Scale, ArrowRight, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { CasePositioning as CasePositioningType } from "../../types/dashboard.types";
import { formatDate } from "../../utils/matterHelpers";
import { MatterStatusBadge } from "../MatterBadges";

// ============================================================
// Matter Row
// ============================================================

interface MatterRowProps {
  matter: CasePositioningType;
}

const MatterRow = ({ matter }: MatterRowProps) => {
  const navigate = useNavigate();

  return (
    <Box
      p={4}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      cursor="pointer"
      onClick={() => navigate(`/cases/${matter.matterNumber}`)}
      _hover={{ borderColor: "blue.300", boxShadow: "sm", bg: "gray.50" }}
      transition="all 0.15s ease"
    >
      {/* Title + Status */}
      <HStack justify="space-between" align="flex-start" mb={2}>
        <Stack gap={1} flex={1} minW="0">
          <Text fontSize="sm" fontWeight="600" color="gray.900">
            {matter.matterTitle}
          </Text>
          <HStack gap={1.5}>
            <Hash size={11} color="#9ca3af" />
            <Text fontSize="xs" color="gray.500" fontFamily="monospace">
              {matter.matterNumber}
            </Text>
          </HStack>
        </Stack>
        <MatterStatusBadge status={matter.matterStatus as any} />
      </HStack>

      {/* Hearing Info */}
      <HStack gap={4} flexWrap="wrap" mt={2}>
        {matter.lastHearingDate && (
          <Text fontSize="xs" color="gray.500">
            Last: {formatDate(matter.lastHearingDate)} ·{" "}
            {matter.lastHearingType}
          </Text>
        )}
        {matter.nextEventDate && (
          <Text fontSize="xs" color="gray.500">
            Next: {formatDate(matter.nextEventDate)} · {matter.nextEventType}
          </Text>
        )}
      </HStack>

      {/* Court + Stage */}
      <HStack gap={2} mt={2} flexWrap="wrap">
        {matter.courtName && (
          <Text fontSize="xs" color="gray.600">
            {matter.courtName}
          </Text>
        )}
        {matter.stage && (
          <Box
            px={2}
            py={0.5}
            bg="blue.50"
            color="blue.700"
            borderRadius="full"
            fontSize="xs"
            fontWeight="500"
          >
            {matter.stage}
          </Box>
        )}
        {matter.caseStatus && matter.caseStatus !== matter.stage && (
          <Box
            px={2}
            py={0.5}
            bg="gray.100"
            color="gray.600"
            borderRadius="full"
            fontSize="xs"
            fontWeight="500"
          >
            {matter.caseStatus}
          </Box>
        )}
      </HStack>
    </Box>
  );
};

// ============================================================
// Empty State
// ============================================================

const EmptyState = () => (
  <Box
    p={8}
    bg="gray.50"
    border="1px dashed"
    borderColor="gray.200"
    borderRadius="lg"
    textAlign="center"
  >
    <Box
      w="12"
      h="12"
      borderRadius="full"
      bg="gray.100"
      display="flex"
      alignItems="center"
      justifyContent="center"
      mx="auto"
      mb={4}
    >
      <Scale size={22} color="#9ca3af" />
    </Box>
    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={1}>
      No matters to display
    </Text>
    <Text fontSize="xs" color="gray.500">
      Create or add matters to start tracking case activity.
    </Text>
  </Box>
);

// ============================================================
// Main Component
// ============================================================

interface CasePositioningProps {
  matters: CasePositioningType[];
  isLoading?: boolean;
}

export const CasePositioningSection = ({
  matters,
  isLoading,
}: CasePositioningProps) => {
  const navigate = useNavigate();

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={6}
      display="flex"
      flexDirection="column"
    >
      <HStack justify="space-between" mb={4}>
        <HStack gap={3}>
          <Box
            w="8"
            h="8"
            borderRadius="lg"
            bg="blue.50"
            color="blue.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Scale size={18} />
          </Box>
          <Stack gap={0}>
            <Text fontSize="md" fontWeight="600" color="gray.900">
              Case Positioning
            </Text>
            <Text fontSize="xs" color="gray.500">
              Active matters and their current progress
            </Text>
          </Stack>
        </HStack>
        {matters.length > 0 && (
          // <Tooltip label="View all matters">
          <Button variant="ghost" size="sm" onClick={() => navigate("/cases")}>
            View All
            <ArrowRight size={14} />
          </Button>
          // </Tooltip>
        )}
      </HStack>

      {isLoading ? (
        <Stack gap={3}>
          {[1, 2, 3].map((i) => (
            <Box
              key={i}
              p={4}
              bg="gray.50"
              border="1px solid"
              borderColor="gray.100"
              borderRadius="lg"
            >
              <Stack gap={2}>
                <Box h="14px" w="200px" bg="gray.100" borderRadius="md" />
                <Box h="10px" w="120px" bg="gray.100" borderRadius="md" />
                <Box h="10px" w="160px" bg="gray.100" borderRadius="md" />
              </Stack>
            </Box>
          ))}
        </Stack>
      ) : matters.length === 0 ? (
        <EmptyState />
      ) : (
        <Stack gap={3}>
          {matters.slice(0, 10).map((matter) => (
            <MatterRow key={matter.matterId} matter={matter} />
          ))}
        </Stack>
      )}
    </Box>
  );
};
