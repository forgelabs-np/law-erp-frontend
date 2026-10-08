import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ChartSlice } from "../../types";
import { EmptyState } from "../SectionCard";

interface DonutTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartSlice & { percent: number } }>;
}

const DonutTooltip = ({ active, payload }: DonutTooltipProps) => {
  if (!active || !payload?.[0]) return null;
  const slice = payload[0].payload;
  return (
    <Box
      bg="gray.900"
      color="white"
      px={3}
      py={2}
      borderRadius="lg"
      fontSize="xs"
      boxShadow="lg"
    >
      <Text fontWeight={600}>{slice.label}</Text>
      <Text opacity={0.85}>
        {slice.value} · {Math.round(slice.percent * 100)}%
      </Text>
    </Box>
  );
};

interface DonutChartProps {
  data: ChartSlice[];
  centerLabel: string;
  centerValue?: number | string;
  size?: number;
  thickness?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  onSliceClick?: (slice: ChartSlice) => void;
}

/**
 * Interactive donut with a centred total and a legend that highlights the
 * hovered/selected slice. Used for firm, matter, role and invoice breakdowns.
 */
export const DonutChart = ({
  data,
  centerLabel,
  centerValue,
  size = 190,
  thickness = 26,
  emptyTitle = "No data to chart",
  emptyDescription,
  onSliceClick,
}: DonutChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    const total = data.reduce((sum, slice) => sum + slice.value, 0);
    return data
      .filter((slice) => slice.value > 0)
      .map((slice) => ({
        ...slice,
        percent: total > 0 ? slice.value / total : 0,
      }));
  }, [data]);

  const total = useMemo(
    () => data.reduce((sum, slice) => sum + slice.value, 0),
    [data]
  );

  if (chartData.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <Stack gap={5} align="stretch">
      <HStack gap={6} align="center" flexWrap="wrap" justify="center">
        <Box position="relative" w={`${size}px`} h={`${size}px`} flexShrink={0}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                innerRadius={size / 2 - thickness}
                outerRadius={size / 2 - 4}
                paddingAngle={2}
                cornerRadius={4}
                stroke="none"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={(_, index) =>
                  onSliceClick?.(chartData[index] as ChartSlice)
                }
                cursor={onSliceClick ? "pointer" : "default"}
              >
                {chartData.map((slice, index) => (
                  <Cell
                    key={slice.label}
                    fill={slice.color}
                    opacity={
                      activeIndex === null || activeIndex === index ? 1 : 0.45
                    }
                  />
                ))}
              </Pie>
              <Tooltip content={<DonutTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Centred total */}
          <Stack
            position="absolute"
            inset={0}
            align="center"
            justify="center"
            gap={0}
            pointerEvents="none"
          >
            <Text
              fontSize="2xl"
              fontWeight={700}
              color="gray.900"
              lineHeight="1"
            >
              {centerValue ?? total}
            </Text>
            <Text
              fontSize="10px"
              color="gray.500"
              textTransform="uppercase"
              letterSpacing="0.06em"
              mt={1}
            >
              {activeIndex !== null
                ? chartData[activeIndex].label
                : centerLabel}
            </Text>
          </Stack>
        </Box>

        {/* Legend */}
        <Stack gap={2.5} flex="1" minW="150px">
          {chartData.map((slice, index) => (
            <HStack
              key={slice.label}
              gap={2.5}
              px={2.5}
              py={1.5}
              borderRadius="lg"
              transition="background 0.15s ease"
              bg={activeIndex === index ? "gray.50" : "transparent"}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg={slice.color}
                flexShrink={0}
              />
              <Text fontSize="xs" color="gray.600" flex="1" lineClamp={1}>
                {slice.label}
              </Text>
              <Text fontSize="xs" fontWeight={700} color="gray.900">
                {slice.value}
              </Text>
              <Text
                fontSize="xs"
                color="gray.400"
                minW="34px"
                textAlign="right"
              >
                {Math.round(slice.percent * 100)}%
              </Text>
            </HStack>
          ))}
        </Stack>
      </HStack>
    </Stack>
  );
};
