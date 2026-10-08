import { Box, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

import { ChartSlice } from "../../types";
import { EmptyState } from "../SectionCard";

interface StackedBarProps {
  data: ChartSlice[];
  /** Bar thickness in pixels. */
  height?: number;
  /** Noun used in the tooltip, e.g. "matters". */
  valueName?: string;
  /** Renders the hover-synced legend grid under the bar. */
  legend?: boolean;
  onSliceClick?: (slice: ChartSlice) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

/**
 * Interactive distribution bar. Segments grow on hover, a floating readout
 * shows the focused slice, and the legend rows stay in sync — the "chart"
 * feels alive without adding a charting dependency or another card.
 */
export const StackedBar = ({
  data,
  height = 16,
  valueName = "items",
  legend = true,
  onSliceClick,
  emptyTitle = "No data to chart",
  emptyDescription,
}: StackedBarProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  const slices = data.filter((slice) => slice.value > 0);

  if (slices.length === 0 || total <= 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const active = activeIndex === null ? null : slices[activeIndex];

  return (
    <Stack gap={4}>
      <Box position="relative" pt={active ? 30 : 0}>
        {/* Floating readout for the focused segment */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          textAlign="center"
          opacity={active ? 1 : 0}
          transform={active ? "translateY(0)" : "translateY(4px)"}
          transition="all 0.18s ease"
          pointerEvents="none"
        >
          {active && (
            <HStack
              as="span"
              display="inline-flex"
              gap={2}
              px={2.5}
              py={1}
              borderRadius="full"
              bg="gray.900"
              color="white"
              fontSize="xs"
              boxShadow="lg"
            >
              <Box
                w="6px"
                h="6px"
                borderRadius="full"
                bg={active.color}
                flexShrink={0}
              />
              <Text fontWeight={600}>{active.label}</Text>
              <Text opacity={0.85}>
                {active.value} {valueName} ·{" "}
                {Math.round((active.value / total) * 100)}%
              </Text>
            </HStack>
          )}
        </Box>

        <HStack
          gap="3px"
          h={`${height}px`}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {slices.map((slice, index) => {
            const isActive = activeIndex === index;
            return (
              <Box
                key={slice.label}
                flex={slice.value}
                minW="4px"
                borderRadius="full"
                cursor={onSliceClick ? "pointer" : "default"}
                transition="transform 0.18s ease, opacity 0.18s ease"
                transform={isActive ? "scaleY(1.35)" : "scaleY(1)"}
                opacity={activeIndex === null || isActive ? 1 : 0.55}
                style={{
                  backgroundImage: `linear-gradient(180deg, ${slice.color}, ${slice.color}b3)`,
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => onSliceClick?.(slice)}
              />
            );
          })}
        </HStack>
      </Box>

      {legend && (
        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={2}>
          {slices.map((slice, index) => (
            <HStack
              key={slice.label}
              gap={2.5}
              px={2.5}
              py={1.5}
              borderRadius="lg"
              bg={activeIndex === index ? "gray.50" : "transparent"}
              transition="background 0.15s ease"
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
              <Text fontSize="xs" color="gray.600" flex={1} lineClamp={1}>
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
                {Math.round((slice.value / total) * 100)}%
              </Text>
            </HStack>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
};
