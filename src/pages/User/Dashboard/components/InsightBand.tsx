import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { ArrowRight, type LucideIcon } from "lucide-react";

import { StatTone, TONE_HEX } from "../types";

export interface DashboardInsight {
  tone: StatTone;
  label: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
  onClick?: () => void;
}

interface InsightBandProps {
  insights: DashboardInsight[];
  caption?: string;
}

/**
 * Attention strip for things that need action. Uses subtle left color accents
 * and clean borders instead of glow effects for a professional appearance.
 */
export const InsightBand = ({ insights, caption }: InsightBandProps) => {
  if (insights.length === 0) return null;

  return (
    <Stack gap={2}>
      {caption && (
        <Text
          fontSize="10px"
          fontWeight={700}
          color="gray.400"
          letterSpacing="0.08em"
          textTransform="uppercase"
        >
          {caption}
        </Text>
      )}
      <HStack gap={2.5} flexWrap="wrap" align="stretch">
        {insights.map((insight) => {
          const IconComponent = insight.icon;
          const interactive = Boolean(insight.onClick);
          const hex = TONE_HEX[insight.tone];

          return (
            <HStack
              key={insight.label}
              gap={3}
              px={4}
              py={3}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
              bg="white"
              flex="1"
              minW="220px"
              position="relative"
              overflow="hidden"
              cursor={interactive ? "pointer" : "default"}
              transition="border-color 0.15s ease"
              onClick={insight.onClick}
              role={interactive ? "button" : undefined}
              tabIndex={interactive ? 0 : undefined}
              _hover={{
                borderColor: "gray.300",
              }}
            >
              <Box
                position="absolute"
                left={0}
                top={0}
                bottom={0}
                w="3px"
                style={{ backgroundColor: hex }}
              />

              <Box
                w="8"
                h="8"
                borderRadius="md"
                bg={`${insight.tone}.50`}
                color={hex}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <IconComponent size={14} />
              </Box>

              <Stack gap={0} flex="1" minW={0}>
                <HStack gap={2} align="baseline">
                  <Text
                    fontSize="lg"
                    fontWeight={700}
                    color="gray.900"
                    lineHeight="1.1"
                  >
                    {insight.value}
                  </Text>
                  <Text
                    fontSize="xs"
                    fontWeight={600}
                    color="gray.600"
                    lineClamp={1}
                  >
                    {insight.label}
                  </Text>
                </HStack>
                {insight.hint && (
                  <Text fontSize="10px" color="gray.500" lineClamp={1}>
                    {insight.hint}
                  </Text>
                )}
              </Stack>

              {interactive && <ArrowRight size={14} color="#94a3b8" />}
            </HStack>
          );
        })}
      </HStack>
    </Stack>
  );
};
