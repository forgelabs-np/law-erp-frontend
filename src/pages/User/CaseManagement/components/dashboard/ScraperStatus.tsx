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

// ============================================================
// Types
// ============================================================

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

// ============================================================
// Helpers
// ============================================================

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

  // Check if the last scrape was within the last 2 hours
  const lastScrape = new Date(lastScrapeTime);
  const now = new Date();
  const twoHoursMs = 2 * 60 * 60 * 1000;

  if (now.getTime() - lastScrape.getTime() > twoHoursMs) {
    return "WARNING";
  }

  return "HEALTHY";
}

// ============================================================
// Metric grid item
// ============================================================

interface MetricItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
}

const MetricItem = ({ icon, value, label }: MetricItemProps) => (
  <Stack
    gap={0.5}
    p={3}
    bg="gray.50"
    borderRadius="lg"
    align="center"
    flex={1}
    minW="100px"
  >
    <Box color="gray.400" mb={0.5}>
      {icon}
    </Box>
    <Text fontSize="lg" fontWeight="700" color="gray.900" lineHeight="1">
      {value}
    </Text>
    <Text fontSize="xs" color="gray.500" textAlign="center">
      {label}
    </Text>
  </Stack>
);

// ============================================================
// Main Component
// ============================================================

export const ScraperStatus = ({ stats }: ScraperStatusProps) => {
  const navigate = useNavigate();

  const status = useMemo(() => deriveScraperStatus(stats), [stats]);
  const statusConfig = STATUS_CONFIG[status];

  return (
    <Stack gap={4}>
      {/* Header */}
      <HStack justify="space-between" align="center">
        <HStack gap={2}>
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
            <Database size={16} />
          </Box>
          <Text fontSize="sm" fontWeight="600" color="gray.900">
            Scraper Status
          </Text>
        </HStack>
      </HStack>

      {/* Status badge */}
      <HStack
        gap={2}
        px={3}
        py={2}
        bg={statusConfig.bg}
        borderRadius="lg"
        border="1px solid"
        borderColor={`${statusConfig.color.split(".")[0]}.100`}
      >
        <Box
          w="2.5"
          h="2.5"
          borderRadius="full"
          bg={statusConfig.dotColor}
          flexShrink={0}
        />
        <Text fontSize="sm" fontWeight="600" color={statusConfig.color}>
          {statusConfig.label}
        </Text>
      </HStack>

      {/* Metrics grid */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr 1fr", md: "repeat(4, 1fr)" }}
        gap={2}
      >
        <MetricItem
          icon={<Gavel size={14} />}
          value={stats.courtsTracked}
          label="Courts Tracked"
        />
        <MetricItem
          icon={<Headphones size={14} />}
          value={stats.totalDailyHearings}
          label="Today's Hearings"
        />
        <MetricItem
          icon={<LayoutGrid size={14} />}
          value={stats.totalWeeklyHearings}
          label="This Week"
        />
        <MetricItem
          icon={<Search size={14} />}
          value={stats.totalMatches}
          label="Matches Found"
        />
      </Box>

      {/* Last sync */}
      <HStack gap={2} py={2} borderTop="1px solid" borderColor="gray.100">
        <Clock size={13} color="#9ca3af" />
        <Text fontSize="xs" color="gray.500">
          Last synced
        </Text>
        <Text fontSize="xs" fontWeight="600" color="gray.700">
          {relativeTime(stats.lastScrapeTime)}
        </Text>
      </HStack>

      {/* View details link */}
      <Box
        as="button"
        onClick={() => navigate("/scraper-management")}
        display="inline-flex"
        alignItems="center"
        gap={1.5}
        px={3}
        py={2}
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        fontSize="xs"
        fontWeight="500"
        color="gray.700"
        cursor="pointer"
        transition="all 0.15s ease"
        _hover={{ borderColor: "gray.300", boxShadow: "sm" }}
        w="fit-content"
      >
        <Zap size={12} />
        View Scraper Details
        <ExternalLink size={10} />
      </Box>
    </Stack>
  );
};
