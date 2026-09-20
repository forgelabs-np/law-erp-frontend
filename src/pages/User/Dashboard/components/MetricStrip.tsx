import { Box, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { StatTileModel, TONE_HEX, toDomId } from "../types";
import { Sparkline } from "./charts/Sparkline";

interface MetricStripProps {
  metrics: StatTileModel[];
  /** Optional caption rendered above the strip. */
  caption?: string;
}

const DeltaBadge = ({ delta }: { delta: number }) => {
  if (delta === 0) return null;
  const positive = delta > 0;

  return (
    <HStack
      gap={0.5}
      px={1.5}
      py={0.5}
      borderRadius="full"
      bg={positive ? "green.50" : "red.50"}
      color={positive ? "green.700" : "red.600"}
      flexShrink={0}
    >
      {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
      <Text fontSize="10px" fontWeight={700}>
        {Math.abs(delta)}
      </Text>
    </HStack>
  );
};

const MetricCell = ({ metric }: { metric: StatTileModel }) => {
  const { label, value, icon, tone, hint, onClick, spark, delta } = metric;
  const hex = TONE_HEX[tone];
  const interactive = Boolean(onClick);

  const body = (
    <>
      <HStack justify="space-between" align="flex-start" gap={3}>
        <Stack gap={0.5} minW={0}>
          <Text
            fontSize="10px"
            fontWeight={600}
            color="gray.500"
            letterSpacing="0.06em"
            textTransform="uppercase"
            lineClamp={1}
          >
            {label}
          </Text>
          <HStack gap={2} align="baseline">
            <Text
              fontSize="2xl"
              fontWeight={700}
              color="gray.900"
              lineHeight="1.1"
            >
              {value}
            </Text>
            {typeof delta === "number" && <DeltaBadge delta={delta} />}
          </HStack>
        </Stack>

        <Box
          w="8"
          h="8"
          borderRadius="md"
          bg={`${tone}.50`}
          color={hex}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          {icon}
        </Box>
      </HStack>

      {spark && spark.length > 1 && (
        <Box mt={3} mx={-1}>
          <Sparkline id={toDomId(label)} data={spark} color={hex} height={32} />
        </Box>
      )}

      {hint && (
        <Text fontSize="10px" color="gray.400" mt={spark ? 1 : 3} lineClamp={1}>
          {hint}
        </Text>
      )}
    </>
  );

  const shell = {
    position: "relative" as const,
    p: 4,
    borderRadius: "lg",
    bg: "white",
    border: "1px solid",
    borderColor: "gray.200",
    overflow: "hidden" as const,
    minW: 0,
    transition: "border-color 0.15s ease",
  };

  if (!interactive) {
    return <Box {...shell}>{body}</Box>;
  }

  return (
    <Box
      {...shell}
      role="button"
      tabIndex={0}
      cursor="pointer"
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
      _hover={{
        borderColor: "gray.300",
      }}
      _focusVisible={{ outline: "2px solid", outlineColor: `${tone}.400` }}
    >
      {body}
    </Box>
  );
};

/**
 * Compact metric strip with clean bordered tiles. No accent rails or glow
 * effects — just clear numbers, subtle icons, and optional sparklines.
 */
export const MetricStrip = ({ metrics, caption }: MetricStripProps) => {
  if (metrics.length === 0) return null;

  return (
    <Box>
      {caption && (
        <Text
          fontSize="10px"
          fontWeight={700}
          color="gray.400"
          letterSpacing="0.08em"
          textTransform="uppercase"
          mb={2}
        >
          {caption}
        </Text>
      )}
      <SimpleGrid
        columns={{ base: 2, md: 3, xl: Math.min(metrics.length, 5) }}
        gap={3}
      >
        {metrics.map((metric) => (
          <MetricCell key={metric.label} metric={metric} />
        ))}
      </SimpleGrid>
    </Box>
  );
};
