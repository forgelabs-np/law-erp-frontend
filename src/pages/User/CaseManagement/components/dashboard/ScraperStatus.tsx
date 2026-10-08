import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import {
  Clock,
  Database,
  ExternalLink,
  Gavel,
  Headphones,
  LayoutGrid,
  Search,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import type { ScraperStats } from "../../types/dashboard.types";
import { relativeTime } from "../../utils/matterHelpers";

type ScraperStatusType =
  | "HEALTHY"
  | "RUNNING"
  | "WARNING"
  | "ERROR"
  | "NOT_CONFIGURED";

interface ScraperStatusProps {
  stats: ScraperStats;
}

interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  dotColor: string;
}

const STATUS_CONFIG: Record<ScraperStatusType, StatusConfig> = {
  HEALTHY: {
    label: "Healthy",
    color: "green.700",
    bg: "green.50",
    dotColor: "#10b981",
  },
  RUNNING: {
    label: "Scraping…",
    color: "blue.700",
    bg: "blue.50",
    dotColor: "#3b82f6",
  },
  WARNING: {
    label: "Attention Needed",
    color: "amber.700",
    bg: "amber.50",
    dotColor: "#f59e0b",
  },
  ERROR: {
    label: "Scraper Error",
    color: "red.700",
    bg: "red.50",
    dotColor: "#ef4444",
  },
  NOT_CONFIGURED: {
    label: "Not Configured",
    color: "gray.500",
    bg: "gray.50",
    dotColor: "#9ca3af",
  },
};

function deriveScraperStatus(stats: ScraperStats): ScraperStatusType {
  const { courtsTracked, lastScrapeTime } = stats;

  if (courtsTracked === 0 && !lastScrapeTime) {
    return "NOT_CONFIGURED";
  }

  if (!lastScrapeTime) {
    return "WARNING";
  }

  const lastScrape = new Date(lastScrapeTime);
  const now = new Date();
  const twoHoursMs = 2 * 60 * 60 * 1000;

  if (now.getTime() - lastScrape.getTime() > twoHoursMs) {
    return "WARNING";
  }

  return "HEALTHY";
}

export const ScraperStatus = ({ stats }: ScraperStatusProps) => {
  const navigate = useNavigate();

  const status = useMemo(() => deriveScraperStatus(stats), [stats]);
  const statusConfig = STATUS_CONFIG[status];

  return (
    <Stack gap={4}>
      {/* Header with status */}
      <HStack justify="space-between" align="center">
        <Text fontSize="sm" fontWeight="600" color="gray.900">
          Scraper Status
        </Text>
        <HStack gap={1.5}>
          <Box
            w="2"
            h="2"
            borderRadius="full"
            bg={statusConfig.dotColor}
            flexShrink={0}
          />
          <Text fontSize="xs" fontWeight="500" color={statusConfig.color}>
            {statusConfig.label}
          </Text>
        </HStack>
      </HStack>

      {/* Metrics grid — compact cells */}
      <HStack gap={0} flexWrap="wrap">
        <MetricCell
          icon={<Gavel size={11} />}
          value={stats.courtsTracked}
          label="Courts"
          iconBg="blue.50"
          iconColor="blue.500"
          isLast={false}
        />
        <MetricCell
          icon={<Headphones size={11} />}
          value={stats.totalDailyHearings}
          label="Today"
          iconBg="green.50"
          iconColor="green.600"
          isLast={false}
        />
        <MetricCell
          icon={<LayoutGrid size={11} />}
          value={stats.totalWeeklyHearings}
          label="This Week"
          iconBg="purple.50"
          iconColor="purple.500"
          isLast={false}
        />
        <MetricCell
          icon={<Search size={11} />}
          value={stats.totalMatches}
          label="Matches"
          iconBg="amber.50"
          iconColor="amber.600"
          isLast
        />
      </HStack>

      {/* Last sync + link */}
      <HStack
        justify="space-between"
        py={2}
        borderTop="1px solid"
        borderColor="gray.100"
      >
        <HStack gap={1.5}>
          <Clock size={12} color="#9ca3af" />
          <Text fontSize="xs" color="gray.500">
            Last synced
          </Text>
          <Text fontSize="xs" fontWeight="500" color="gray.700">
            {relativeTime(stats.lastScrapeTime)}
          </Text>
        </HStack>
        <Box
          as="button"
          onClick={() => navigate("/scraper-management")}
          display="inline-flex"
          alignItems="center"
          gap={1}
          px={2}
          py={1}
          bg="transparent"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          fontSize="xs"
          fontWeight="500"
          color="gray.500"
          cursor="pointer"
          transition="all 0.15s ease"
          _hover={{ bg: "gray.50", borderColor: "gray.300", color: "gray.700" }}
        >
          <Zap size={11} />
          Details
          <ExternalLink size={9} />
        </Box>
      </HStack>
    </Stack>
  );
};

// ============================================================
// Metric Cell
// ============================================================

interface MetricCellProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  iconBg?: string;
  iconColor?: string;
  isLast: boolean;
}

const MetricCell = ({
  icon,
  value,
  label,
  iconBg,
  iconColor,
  isLast,
}: MetricCellProps) => (
  <Stack
    gap={0.5}
    flex={1}
    minW="80px"
    pr={isLast ? 0 : 4}
    borderRight={isLast ? "none" : "1px solid"}
    borderColor="gray.100"
  >
    <HStack gap={1.5}>
      <Box
        w="5"
        h="5"
        borderRadius="sm"
        bg={iconBg ?? "gray.100"}
        color={iconColor ?? "gray.500"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
      >
        {icon}
      </Box>
      <Text fontSize="xs" fontWeight="500" color="gray.500">
        {label}
      </Text>
    </HStack>
    <Text fontSize="lg" fontWeight="700" color="gray.900" lineHeight="1.1">
      {value}
    </Text>
  </Stack>
);
