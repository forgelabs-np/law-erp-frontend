import { Box, Stack, Text } from "@chakra-ui/react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

interface ProgressRingProps {
  /** Current value; the ring fills `value / max`. */
  value: number;
  max: number;
  label: string;
  color?: string;
  size?: number;
  thickness?: number;
  /** Overrides the auto-computed percentage label. */
  display?: string;
}

/**
 * Compact ratio indicator (e.g. active firms, collection rate). Rendered with
 * the same chart library as the rest of the dashboard for visual consistency.
 */
export const ProgressRing = ({
  value,
  max,
  label,
  color = "#0056FF",
  size = 132,
  thickness = 12,
  display,
}: ProgressRingProps) => {
  const safeMax = max > 0 ? max : 0;
  const percent =
    safeMax > 0 ? Math.min(100, Math.round((value / safeMax) * 100)) : 0;

  return (
    <Stack gap={1} align="center" flexShrink={0}>
      <Box position="relative" w={`${size}px`} h={`${size}px`}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={[{ name: label, value: percent }]}
            innerRadius={`${100 - thickness * 2}%`}
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={thickness}
              fill={color}
              background={{ fill: "#eef2ff" }}
              isAnimationActive
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <Stack
          position="absolute"
          inset={0}
          align="center"
          justify="center"
          gap={0}
          pointerEvents="none"
        >
          <Text fontSize="xl" fontWeight={700} color="gray.900" lineHeight="1">
            {display ?? `${percent}%`}
          </Text>
        </Stack>
      </Box>
      <Text
        fontSize="10px"
        color="gray.500"
        textTransform="uppercase"
        letterSpacing="0.06em"
        textAlign="center"
      >
        {label}
      </Text>
    </Stack>
  );
};
