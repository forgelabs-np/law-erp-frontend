import { Box, HStack, Skeleton, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

import { CaseDashboardStats } from "../../types/dashboard.types";

interface DashboardStatsPanelProps {
  stats?: CaseDashboardStats;
  isLoading?: boolean;
}

interface StatRowProps {
  label: string;
  value: number;
  dotColor: string;
  onClick?: () => void;
}

const StatRow = ({ label, value, dotColor, onClick }: StatRowProps) => (
  <HStack
    justify="space-between"
    align="center"
    py={2.5}
    cursor={onClick ? "pointer" : "default"}
    onClick={onClick}
    borderRadius="md"
    px={2}
    mx={-2}
    _hover={onClick ? { bg: "gray.50" } : undefined}
    transition="background-color 0.15s ease"
  >
    <HStack gap={2}>
      <Box w="6px" h="6px" borderRadius="full" bg={dotColor} flexShrink={0} />
      <Text fontSize="xs" fontWeight="500" color="gray.600">
        {label}
      </Text>
    </HStack>
    <Text fontSize="xs" fontWeight="700" color="gray.900" fontFamily="mono">
      {value}
    </Text>
  </HStack>
);

export const DashboardStatsPanel = ({
  stats,
  isLoading = false,
}: DashboardStatsPanelProps) => {
  const navigate = useNavigate();

  const total = stats?.totalMatters ?? 0;
  const active = stats?.activeMatters ?? 0;
  const closed = stats?.closedMatters ?? 0;
  const dormant = stats?.dormantMatters ?? 0;
  const todayEvents = stats?.todayEventsCount ?? 0;
  const stale = stats?.staleCount ?? 0;

  const activeRatio =
    total > 0 ? Math.min(100, Math.round((active / total) * 100)) : 0;

  if (isLoading) {
    return (
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="xl"
        p={5}
        boxShadow="0 1px 3px rgba(0, 0, 0, 0.03)"
      >
        <Stack gap={3}>
          <Skeleton h="18px" w="120px" borderRadius="md" />
          <Skeleton h="12px" w="100%" borderRadius="md" />
          <Skeleton h="6px" w="100%" borderRadius="full" />
          <Stack gap={2} pt={2}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} h="14px" w="100%" borderRadius="md" />
            ))}
          </Stack>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={5}
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.03)"
      w="100%"
      minW={0}
    >
      {/* Panel Header */}
      <HStack justify="space-between" align="center" mb={4}>
        <Text
          fontSize="sm"
          fontWeight="700"
          color="gray.900"
          letterSpacing="-0.01em"
        >
          Case Statistics
        </Text>
        <Text fontSize="xs" color="gray.400" fontWeight="500">
          Firm Caseload
        </Text>
      </HStack>

      {/* Primary Active / Total Ratio & Progress Bar */}
      <Box
        mb={4}
        p={3.5}
        bg="gray.50"
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.100"
      >
        <HStack justify="space-between" align="center" mb={2}>
          <Text fontSize="xs" fontWeight="600" color="gray.600">
            Active / Total
          </Text>
          <Text fontSize="xs" fontWeight="700" color="gray.900">
            <Text as="span" color="primary.600">
              {active}
            </Text>{" "}
            / {total}
          </Text>
        </HStack>

        {/* Progress track */}
        <Box
          w="100%"
          h="6px"
          bg="gray.200"
          borderRadius="full"
          overflow="hidden"
        >
          <Box
            h="100%"
            w={`${activeRatio}%`}
            bg={activeRatio > 0 ? "primary.500" : "transparent"}
            borderRadius="full"
            transition="width 0.4s ease"
          />
        </Box>
      </Box>

      {/* Breakdown Rows */}
      <Stack gap={0} divideY="1px" divideColor="gray.100">
        <StatRow
          label="Active Matters"
          value={active}
          dotColor="#10B981"
          onClick={() => navigate("/cases")}
        />
        <StatRow
          label="Total Matters"
          value={total}
          dotColor="#3B82F6"
          onClick={() => navigate("/cases")}
        />
        <StatRow
          label="Closed Matters"
          value={closed}
          dotColor="#6B7280"
          onClick={() => navigate("/cases")}
        />
        <StatRow
          label="Dormant Matters"
          value={dormant}
          dotColor="#F59E0B"
          onClick={() => navigate("/cases")}
        />
        <StatRow
          label="Today's Court Events"
          value={todayEvents}
          dotColor="#8B5CF6"
          onClick={() => navigate("/task-calendar")}
        />
        <StatRow
          label="Stale Matters"
          value={stale}
          dotColor="#EF4444"
          onClick={() => navigate("/stale-matters")}
        />
      </Stack>
    </Box>
  );
};
