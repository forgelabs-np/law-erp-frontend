import {
  Box,
  Button,
  HStack,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { CasePositioning } from "../../types/dashboard.types";

// ============================================================
// Stale Matter Row
// ============================================================

interface StaleMatterRowProps {
  matter: CasePositioning;
}

const StaleMatterRow = ({ matter }: StaleMatterRowProps) => {
  const navigate = useNavigate();

  return (
    <Box
      p={4}
      bg="amber.50"
      border="1px solid"
      borderColor="amber.200"
      borderRadius="lg"
      cursor="pointer"
      onClick={() => navigate(`/cases/${matter.matterNumber}`)}
      _hover={{ borderColor: "amber.400", boxShadow: "sm" }}
      transition="all 0.15s ease"
    >
      {/* Title */}
      <HStack justify="space-between" align="flex-start" mb={1}>
        <Text fontSize="sm" fontWeight="600" color="gray.900">
          {matter.matterTitle}
        </Text>
        <Box
          px={2}
          py={0.5}
          bg="amber.100"
          color="amber.800"
          borderRadius="full"
          fontSize="xs"
          fontWeight="600"
          flexShrink={0}
        >
          {matter.daysSinceLastHearing !== null
            ? `${matter.daysSinceLastHearing}d`
            : "Stale"}
        </Box>
      </HStack>

      {/* Matter number */}
      <Text fontSize="xs" color="gray.500" fontFamily="monospace" mb={2}>
        {matter.matterNumber}
      </Text>

      {/* Court */}
      {matter.courtName && (
        <Text fontSize="xs" color="gray.600" mb={1}>
          {matter.courtName}
        </Text>
      )}

      {/* Stale reason */}
      <HStack gap={1} mt={2}>
        <Clock size={12} color="#d97706" />
        <Text fontSize="xs" color="amber.700" fontWeight="500">
          {matter.daysSinceLastHearing !== null
            ? `No hearing in ${matter.daysSinceLastHearing} days`
            : "No hearing recorded"}
        </Text>
      </HStack>
    </Box>
  );
};

// ============================================================
// Empty State (all matters up to date)
// ============================================================

const AllUpToDateState = () => (
  <Box
    p={6}
    bg="green.50"
    border="1px solid"
    borderColor="green.200"
    borderRadius="lg"
    textAlign="center"
  >
    <Box
      w="10"
      h="10"
      borderRadius="full"
      bg="green.100"
      display="flex"
      alignItems="center"
      justifyContent="center"
      mx="auto"
      mb={3}
    >
      <CheckCircle2 size={20} color="#16a34a" />
    </Box>
    <Text fontSize="sm" fontWeight="600" color="green.800" mb={1}>
      No stale matters
    </Text>
    <Text fontSize="xs" color="green.600">
      All matters are up to date.
    </Text>
  </Box>
);

// ============================================================
// Main Component
// ============================================================

interface StaleMattersProps {
  matters: CasePositioning[];
  isLoading?: boolean;
}

export const StaleMatters = ({ matters, isLoading }: StaleMattersProps) => {
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
            bg="amber.50"
            color="amber.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <AlertTriangle size={18} />
          </Box>
          <Stack gap={0}>
            <Text fontSize="md" fontWeight="600" color="gray.900">
              Stale Matters
            </Text>
            <Text fontSize="xs" color="gray.500">
              Matters requiring attention
            </Text>
          </Stack>
        </HStack>
        {matters.length > 0 && (
          // <Tooltip label="View all stale matters">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/stale-matters")}
            >
              View All
              <ArrowRight size={14} />
            </Button>
          // </Tooltip>
        )}
      </HStack>

      {isLoading ? (
        <Stack gap={3}>
          {[1, 2].map((i) => (
            <Box
              key={i}
              p={4}
              bg="amber.50"
              border="1px solid"
              borderColor="amber.100"
              borderRadius="lg"
            >
              <Stack gap={2}>
                <Box h="14px" w="180px" bg="amber.100" borderRadius="md" />
                <Box h="10px" w="120px" bg="amber.100" borderRadius="md" />
                <Box h="10px" w="140px" bg="amber.100" borderRadius="md" />
              </Stack>
            </Box>
          ))}
        </Stack>
      ) : matters.length === 0 ? (
        <AllUpToDateState />
      ) : (
        <Stack gap={3}>
          {matters.slice(0, 10).map((matter) => (
            <StaleMatterRow key={matter.matterId} matter={matter} />
          ))}
        </Stack>
      )}
    </Box>
  );
};
