import { Box, HStack, Text } from "@chakra-ui/react";
import { useId } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EmptyState } from "../SectionCard";

export interface BarPoint {
  label: string;
  value: number;
  /** Optional longer name shown in the tooltip (e.g. full matter title). */
  tooltipLabel?: string;
}

interface BarTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: BarPoint; value: number }>;
  valueName: string;
}

const BarTooltip = ({ active, payload, valueName }: BarTooltipProps) => {
  if (!active || !payload?.[0]) return null;
  const point = payload[0].payload;
  return (
    <Box
      bg="gray.900"
      color="white"
      px={3}
      py={2}
      borderRadius="lg"
      fontSize="xs"
      boxShadow="lg"
      maxW="240px"
    >
      <Text fontWeight={600} lineClamp={2}>
        {point.tooltipLabel ?? point.label}
      </Text>
      <HStack gap={1.5} mt={0.5}>
        <Box w="6px" h="6px" borderRadius="full" bg="#7dd3fc" />
        <Text opacity={0.9}>
          {point.value} {valueName}
        </Text>
      </HStack>
    </Box>
  );
};

interface MiniBarChartProps {
  data: BarPoint[];
  color?: string;
  /** Per-bar colours, matched by index (overrides `color`). */
  colors?: string[];
  height?: number;
  valueName?: string;
  /** Renders horizontal bars — better for long category names. */
  horizontal?: boolean;
  /** Prints the value at the end of each bar. */
  showValues?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

/**
 * Bar chart used for hearings-per-day and per-member caseload. Bars carry a
 * vertical gradient so the chart reads as a chart rather than a flat block.
 */
export const MiniBarChart = ({
  data,
  color = "#0056FF",
  colors,
  height = 220,
  valueName = "items",
  horizontal = false,
  showValues = true,
  emptyTitle = "Nothing to chart",
  emptyDescription,
}: MiniBarChartProps) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const palette = data.map((_, index) => colors?.[index] ?? color);

  return (
    <Box h={`${height}px`} w="100%" minW={0}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{
            top: showValues ? 18 : 8,
            right: showValues ? 24 : 12,
            bottom: 0,
            left: horizontal ? 8 : -18,
          }}
          barCategoryGap={horizontal ? "26%" : "32%"}
        >
          <defs>
            {palette.map((fill, index) => (
              <linearGradient
                key={`${fill}-${index}`}
                id={`bar-${uid}-${index}`}
                x1="0"
                y1={horizontal ? "0" : "0"}
                x2={horizontal ? "1" : "0"}
                y2="1"
              >
                <stop offset="0%" stopColor={fill} stopOpacity={1} />
                <stop offset="100%" stopColor={fill} stopOpacity={0.55} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            vertical={!horizontal}
            horizontal={horizontal}
          />

          {horizontal ? (
            <>
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                width={132}
                interval={0}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                minTickGap={12}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                width={40}
                allowDecimals={false}
              />
            </>
          )}

          <Tooltip
            cursor={{ fill: "rgba(0,86,255,0.05)" }}
            content={<BarTooltip valueName={valueName} />}
          />

          <Bar
            dataKey="value"
            radius={horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]}
            maxBarSize={horizontal ? 22 : 46}
            isAnimationActive
            animationDuration={650}
          >
            {data.map((point, index) => (
              <Cell
                key={`${point.label}-${index}`}
                fill={`url(#bar-${uid}-${index})`}
              />
            ))}
            {showValues && (
              <LabelList
                dataKey="value"
                position={horizontal ? "right" : "top"}
                fill="#64748b"
                fontSize={10}
                fontWeight={600}
              />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
