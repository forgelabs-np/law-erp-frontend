import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { Activity, AlertTriangle, Building2 } from "lucide-react";
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { FirmOverviewData } from "./types";

interface FirmOverviewProps {
  data: FirmOverviewData;
}

const STATUS_COLORS = {
  active: "#10b981",
  suspended: "#f59e0b",
  inactive: "#ef4444",
};

const FirmStatusTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: { name: string; value: number; percent: number };
  }>;
}) => {
  if (!active || !payload?.[0]) return null;
  const { name, value, percent } = payload[0].payload;
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
      <Text fontWeight="600">{name}</Text>
      <Text opacity={0.8}>
        {value} firm{value !== 1 ? "s" : ""} · {Math.round(percent * 100)}%
      </Text>
    </Box>
  );
};

export const FirmOverview = ({ data }: FirmOverviewProps) => {
  const { totalFirms, activeFirms, suspendedFirms, inactiveFirms } = data;

  const chartData = useMemo(
    () => [
      {
        name: "Active",
        value: activeFirms,
        percent: totalFirms > 0 ? activeFirms / totalFirms : 0,
        color: STATUS_COLORS.active,
      },
      {
        name: "Suspended",
        value: suspendedFirms,
        percent: totalFirms > 0 ? suspendedFirms / totalFirms : 0,
        color: STATUS_COLORS.suspended,
      },
      {
        name: "Inactive",
        value: inactiveFirms,
        percent: totalFirms > 0 ? inactiveFirms / totalFirms : 0,
        color: STATUS_COLORS.inactive,
      },
    ],
    [activeFirms, suspendedFirms, inactiveFirms, totalFirms]
  );

  const hasData = totalFirms > 0;

  return (
    <Stack gap={5}>
      {/* Firm KPIs */}
      <HStack gap={4} flexWrap="wrap">
        <FirmMiniCard
          label="Total Firms"
          value={totalFirms}
          icon={<Building2 size={16} />}
          color="blue"
        />
        <FirmMiniCard
          label="Active"
          value={activeFirms}
          icon={<Activity size={16} />}
          color="green"
          trend={
            totalFirms > 0
              ? `${Math.round((activeFirms / totalFirms) * 100)}%`
              : undefined
          }
        />
        <FirmMiniCard
          label="Suspended"
          value={suspendedFirms}
          icon={<AlertTriangle size={16} />}
          color="yellow"
        />
      </HStack>

      {/* Donut chart + legend */}
      <Box>
        <Text fontSize="sm" fontWeight="600" color="gray.700" mb={3}>
          Firm Status Distribution
        </Text>

        {hasData ? (
          <HStack gap={6} align="center" flexWrap="wrap">
            <Box position="relative" w="180px" h="180px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={80}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        cursor="pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<FirmStatusTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                textAlign="center"
                pointerEvents="none"
              >
                <Text
                  fontSize="2xl"
                  fontWeight="700"
                  color="gray.900"
                  lineHeight="1"
                >
                  {totalFirms}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Total Firms
                </Text>
              </Box>
            </Box>

            {/* Legend */}
            <Stack gap={2}>
              {chartData.map((item) => (
                <HStack key={item.name} gap={2}>
                  <Box w="3" h="3" borderRadius="full" bg={item.color} />
                  <Text fontSize="sm" color="gray.700" minW="80px">
                    {item.name}
                  </Text>
                  <Text fontSize="sm" fontWeight="600" color="gray.900">
                    {item.value}
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    ({Math.round(item.percent * 100)}%)
                  </Text>
                </HStack>
              ))}
            </Stack>
          </HStack>
        ) : (
          <Box py={8} textAlign="center">
            <Text fontSize="sm" color="gray.400">
              No firms available
            </Text>
          </Box>
        )}
      </Box>
    </Stack>
  );
};

// ============================================================
// Firm Mini Card
// ============================================================

interface FirmMiniCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const FirmMiniCard = ({
  label,
  value,
  icon,
  color,
  trend,
}: FirmMiniCardProps) => (
  <Box
    flex={1}
    minW="120px"
    p={4}
    bg="white"
    border="1px solid"
    borderColor="gray.100"
    borderRadius="lg"
  >
    <HStack justify="space-between" align="flex-start" mb={2}>
      <Text fontSize="xs" fontWeight="500" color="gray.500">
        {label}
      </Text>
      <Box
        w="7"
        h="7"
        borderRadius="md"
        bg={`${color}.50`}
        color={`${color}.500`}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {icon}
      </Box>
    </HStack>
    <Text fontSize="2xl" fontWeight="700" color="gray.900" lineHeight="1">
      {value}
    </Text>
    {trend && (
      <Text fontSize="xs" color="green.500" mt={1} fontWeight="500">
        ↑ {trend}
      </Text>
    )}
  </Box>
);
