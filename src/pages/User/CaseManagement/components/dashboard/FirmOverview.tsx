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
    <Stack gap={4}>
      {/* Compact metric row */}
      <HStack gap={0} flexWrap="wrap">
        <MetricCell
          label="Total Firms"
          value={totalFirms}
          icon={<Building2 size={11} />}
          color="gray.500"
          iconBg="gray.100"
          isLast={false}
        />
        <MetricCell
          label="Active"
          value={activeFirms}
          icon={<Activity size={11} />}
          color="#10b981"
          iconBg="green.50"
          badge={
            totalFirms > 0
              ? `↑ ${Math.round((activeFirms / totalFirms) * 100)}%`
              : undefined
          }
          badgeColor="green.600"
          isLast={false}
        />
        <MetricCell
          label="Suspended"
          value={suspendedFirms}
          icon={<AlertTriangle size={11} />}
          color="#f59e0b"
          iconBg="amber.50"
          isLast
        />
      </HStack>

      {/* Donut chart + legend */}
      {hasData ? (
        <HStack gap={5} align="center" flexWrap="wrap">
          <Box position="relative" w="150px" h="150px">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={60}
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
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              textAlign="center"
              pointerEvents="none"
            >
              <Text
                fontSize="xl"
                fontWeight="700"
                color="gray.900"
                lineHeight="1"
              >
                {totalFirms}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Total
              </Text>
            </Box>
          </Box>

          <Stack gap={1.5}>
            {chartData.map((item) => (
              <HStack key={item.name} gap={2}>
                <Box w="2.5" h="2.5" borderRadius="full" bg={item.color} />
                <Text fontSize="xs" color="gray.600" minW="70px">
                  {item.name}
                </Text>
                <Text fontSize="xs" fontWeight="600" color="gray.900">
                  {item.value}
                </Text>
                <Text fontSize="xs" color="gray.400">
                  ({Math.round(item.percent * 100)}%)
                </Text>
              </HStack>
            ))}
          </Stack>
        </HStack>
      ) : (
        <Box py={6} textAlign="center">
          <Text fontSize="xs" color="gray.400">
            No firms available
          </Text>
        </Box>
      )}
    </Stack>
  );
};

// ============================================================
// Metric Cell — compact inline metric with separator
// ============================================================

interface MetricCellProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  iconBg?: string;
  badge?: string;
  badgeColor?: string;
  isLast: boolean;
}

const MetricCell = ({
  label,
  value,
  icon,
  color,
  iconBg,
  badge,
  badgeColor,
  isLast,
}: MetricCellProps) => (
  <Stack
    gap={0.5}
    flex={1}
    minW="100px"
    pr={isLast ? 0 : 5}
    borderRight={isLast ? "none" : "1px solid"}
    borderColor="gray.100"
  >
    <HStack gap={1.5}>
      <Box
        w="5"
        h="5"
        borderRadius="sm"
        bg={iconBg ?? "gray.100"}
        color={color}
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
    <Text fontSize="xl" fontWeight="700" color="gray.900" lineHeight="1.1">
      {value}
    </Text>
    {badge && (
      <Text fontSize="xs" fontWeight="500" color={badgeColor ?? "gray.500"}>
        {badge}
      </Text>
    )}
  </Stack>
);
