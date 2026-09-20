import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

interface KpiCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  sparklineColor: string;
  sparklineData: number[];
  trend?: {
    value: number;
    label: string;
  };
}

const ICON_BG_MAP: Record<string, { bg: string; color: string }> = {
  gray: { bg: "gray.100", color: "gray.600" },
  green: { bg: "green.50", color: "green.600" },
  red: { bg: "red.50", color: "red.500" },
  purple: { bg: "purple.50", color: "purple.500" },
  blue: { bg: "blue.50", color: "blue.500" },
  amber: { bg: "amber.50", color: "amber.600" },
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
}) => {
  if (!active || !payload?.[0]) return null;
  return (
    <Box
      bg="gray.900"
      color="white"
      px={2}
      py={1}
      borderRadius="md"
      fontSize="xs"
      fontWeight="500"
    >
      {payload[0].value}
    </Box>
  );
};

export const DashboardKpiCard = ({
  label,
  value,
  icon,
  color,
  sparklineColor,
  sparklineData,
  trend,
}: KpiCardProps) => {
  const chartData = useMemo(
    () => sparklineData.map((v, i) => ({ idx: i, value: v })),
    [sparklineData]
  );

  const isPositiveTrend = trend ? trend.value >= 0 : undefined;

  const iconStyle = ICON_BG_MAP[color] ?? ICON_BG_MAP.gray;

  return (
    <Box
      px={5}
      py={4}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)"
      transition="all 0.15s ease"
      _hover={{
        borderColor: "gray.300",
        boxShadow:
          "0 2px 6px -1px rgba(0, 0, 0, 0.06), 0 1px 3px -1px rgba(0, 0, 0, 0.04)",
      }}
      cursor="default"
      overflow="hidden"
    >
      <HStack justify="space-between" align="flex-start" mb={1}>
        <Text
          fontSize="xs"
          fontWeight="500"
          color="gray.500"
          textTransform="uppercase"
          letterSpacing="wide"
        >
          {label}
        </Text>
        <Box
          w="7"
          h="7"
          borderRadius="md"
          bg={iconStyle.bg}
          color={iconStyle.color}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          {icon}
        </Box>
      </HStack>

      <Text fontSize="2xl" fontWeight="700" color="gray.900" lineHeight="1.1">
        {value}
      </Text>

      {trend && (
        <HStack gap={1} mt={1.5}>
          <Text
            fontSize="xs"
            fontWeight="600"
            color={isPositiveTrend ? "green.600" : "red.500"}
          >
            {isPositiveTrend ? "↑" : "↓"} {Math.abs(trend.value)}%
          </Text>
          <Text fontSize="xs" color="gray.400">
            {trend.label}
          </Text>
        </HStack>
      )}

      <Box h="36px" mt={1}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient
                id={`gradient-${sparklineColor}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={sparklineColor}
                  stopOpacity={0.12}
                />
                <stop
                  offset="100%"
                  stopColor={sparklineColor}
                  stopOpacity={0.01}
                />
              </linearGradient>
            </defs>
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={sparklineColor}
              strokeWidth={1.5}
              fill={`url(#gradient-${sparklineColor})`}
              dot={false}
              activeDot={{
                r: 3,
                fill: sparklineColor,
                stroke: "white",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};
