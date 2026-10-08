import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DashboardTrendPoint } from "@/api/dashboard";

import { EmptyState } from "./SectionCard";

const SERIES = [
  { key: "totalMatters", label: "Total", color: "#0056FF" },
  { key: "activeMatters", label: "Active", color: "#10b981" },
  { key: "closedMatters", label: "Closed", color: "#9ca3af" },
  { key: "staleMatters", label: "Stale", color: "#ef4444" },
] as const;

type SeriesKey = (typeof SERIES)[number]["key"];

const formatTick = (value: string): string => {
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? value : format(date, "dd MMM");
};

interface TrendTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const TrendTooltip = ({ active, payload, label }: TrendTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <Box
      bg="gray.900"
      color="white"
      px={3}
      py={2}
      borderRadius="lg"
      fontSize="xs"
      boxShadow="lg"
      minW="132px"
    >
      <Text fontWeight={600} mb={1}>
        {label && typeof label === "string"
          ? formatTick(label)
          : String(label ?? "")}
      </Text>
      <Stack gap={0.5}>
        {payload.map((entry) => (
          <HStack key={entry.dataKey} gap={2} justify="space-between">
            <HStack gap={1.5}>
              <Box w="6px" h="6px" borderRadius="full" bg={entry.color} />
              <Text opacity={0.85}>{entry.name}</Text>
            </HStack>
            <Text fontWeight={600}>{entry.value}</Text>
          </HStack>
        ))}
      </Stack>
    </Box>
  );
};

interface TrendChartProps {
  data: DashboardTrendPoint[];
  height?: number;
}

/** Interactive matter trend chart with toggleable series. */
export const TrendChart = ({ data, height = 260 }: TrendChartProps) => {
  const [hidden, setHidden] = useState<SeriesKey[]>([]);

  if (data.length === 0) {
    return (
      <EmptyState
        title="No trend data"
        description="Matter trends will appear once there is enough activity."
      />
    );
  }

  // Only offer series the response actually contains.
  const available = SERIES.filter((series) =>
    data.some((point) => typeof point[series.key] === "number")
  );

  const toggle = (key: SeriesKey) =>
    setHidden((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );

  return (
    <Stack gap={3}>
      <HStack gap={2} flexWrap="wrap">
        {available.map((series) => {
          const isHidden = hidden.includes(series.key);
          return (
            <Button
              key={series.key}
              type="button"
              aria-pressed={!isHidden}
              size="xs"
              borderRadius="full"
              variant="ghost"
              border="1px solid"
              borderColor={isHidden ? "gray.200" : "transparent"}
              bg={isHidden ? "transparent" : "gray.50"}
              transition="all 0.15s ease"
              onClick={() => toggle(series.key)}
              _hover={{ bg: isHidden ? "gray.50" : "gray.100" }}
              opacity={isHidden ? 0.5 : 1}
            >
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg={isHidden ? "gray.300" : series.color}
              />
              <Text fontSize="xs" color="gray.600">
                {series.label}
              </Text>
            </Button>
          );
        })}
      </HStack>

      <Box h={`${height}px`} w="100%" minW={0}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 6, right: 10, bottom: 0, left: -18 }}
          >
            <defs>
              {available.map((series) => (
                <linearGradient
                  key={series.key}
                  id={`trend-${series.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={series.color}
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="100%"
                    stopColor={series.color}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatTick}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              width={44}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
              content={<TrendTooltip />}
            />
            {available
              .filter((series) => !hidden.includes(series.key))
              .map((series) => (
                <Area
                  key={series.key}
                  type="monotone"
                  dataKey={series.key}
                  name={series.label}
                  stroke={series.color}
                  strokeWidth={2}
                  fill={`url(#trend-${series.key})`}
                  dot={false}
                  activeDot={{ r: 4, stroke: "white", strokeWidth: 2 }}
                />
              ))}
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Stack>
  );
};
