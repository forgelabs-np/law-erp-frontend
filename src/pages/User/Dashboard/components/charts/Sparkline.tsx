import { Box } from "@chakra-ui/react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface SparklineProps {
  /** Real, chronologically ordered values. Renders nothing for <2 points. */
  data: number[];
  color?: string;
  height?: number;
  /** Unique suffix so multiple sparkline gradients never collide. */
  id: string;
}

/**
 * Compact trend curve used inside metric tiles and the hero band. Deliberately
 * axis-less: it communicates direction without competing with the value.
 */
export const Sparkline = ({
  data,
  color = "#0056FF",
  height = 34,
  id,
}: SparklineProps) => {
  if (data.length < 2) return null;

  const gradientId = `spark-${id}`;
  const points = data.map((value, index) => ({ index, value }));

  return (
    <Box h={`${height}px`} w="100%" minW={0} pointerEvents="none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={points}
          margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.34} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.75}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive
            animationDuration={600}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};
