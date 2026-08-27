import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";
import type { Insight, InsightType } from "./types";

interface QuickInsightsProps {
  insights: Insight[];
}

const ICON_MAP: Record<
  InsightType,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  success: {
    icon: <CheckCircle2 size={16} />,
    color: "green.600",
    bg: "green.50",
  },
  info: {
    icon: <Info size={16} />,
    color: "blue.600",
    bg: "blue.50",
  },
  warning: {
    icon: <AlertTriangle size={16} />,
    color: "amber.600",
    bg: "amber.50",
  },
  danger: {
    icon: <ShieldAlert size={16} />,
    color: "red.600",
    bg: "red.50",
  },
};

export const QuickInsights = ({ insights }: QuickInsightsProps) => {
  if (insights.length === 0) return null;

  return (
    <Stack gap={3}>
      <HStack gap={2}>
        <Box
          w="7"
          h="7"
          borderRadius="md"
          bg="green.50"
          color="green.500"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CheckCircle2 size={14} />
        </Box>
        <Text fontSize="sm" fontWeight="600" color="gray.900">
          Quick Insights
        </Text>
      </HStack>

      <Stack gap={2}>
        {insights.map((insight, i) => {
          const config = ICON_MAP[insight.type];
          return (
            <HStack
              key={`${insight.title}-${i}`}
              gap={3}
              p={3}
              bg="white"
              border="1px solid"
              borderColor="gray.100"
              borderRadius="lg"
              align="flex-start"
            >
              <Box
                w="7"
                h="7"
                borderRadius="md"
                bg={config.bg}
                color={config.color}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
                mt={0.5}
              >
                {config.icon}
              </Box>
              <Stack gap={0}>
                <Text fontSize="sm" fontWeight="600" color="gray.900">
                  {insight.title}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {insight.description}
                </Text>
              </Stack>
            </HStack>
          );
        })}
      </Stack>
    </Stack>
  );
};
