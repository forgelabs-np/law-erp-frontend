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

  return (
    <Box
      p={5}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      transition="all 0.2s ease"
      _hover={{
        boxShadow: "md",
        borderColor: `${color}.200`,
        transform: "translateY(-1px)",
      }}
      cursor="default"
      position="relative"
      overflow="hidden"
    >
      <HStack justify="space-between" align="flex-start" mb={3}>
        <Stack gap={1}>
          <Text
            fontSize="xs"
            fontWeight="500"
            color="gray.500"
            letterSpacing="wide"
            textTransform="uppercase"
          >
            {label}
          </Text>
          <Text fontSize="3xl" fontWeight="700" color="gray.900" lineHeight="1">
            {value}
          </Text>
        </Stack>
        <Box
          w="10"
          h="10"
          borderRadius="lg"
          bg={`${color}.50`}
          color={`${color}.600`}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </Box>
      </HStack>

      {trend && (
        <HStack gap={1} mb={2}>
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

      <Box h="40px" mt={1}>
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
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor={sparklineColor}
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={sparklineColor}
              strokeWidth={1}
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
