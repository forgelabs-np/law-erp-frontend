import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

import { Sparkline } from "./charts/Sparkline";

export interface HeroStat {
  label: string;
  value: string | number;
  icon?: ReactNode;
}

interface HeroBandProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Headline metric rendered large on the left. */
  primary: { label: string; value: string | number };
  /**
   * Real series for the hero sparkline. Omit to render none — the hero never
   * invents a trend curve.
   */
  primaryTrend?: number[];
  /** Supporting stats rendered as a divided row under the headline. */
  stats?: HeroStat[];
  /** Right-hand slot — typically a ProgressRing. */
  aside?: ReactNode;
  action?: ReactNode;
}

/**
 * Dashboard header with subtle visual depth. Keeps the clean white foundation
 * from the reference design but adds restrained brand colour, soft background
 * tinting, structured metric separators, and a hint of composition behind the
 * aside (ProgressRing) area.
 */
export const HeroBand = ({
  eyebrow,
  title,
  subtitle,
  primary,
  primaryTrend,
  stats = [],
  aside,
  action,
}: HeroBandProps) => (
  <Box
    position="relative"
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="xl"
    boxShadow="0 1px 3px rgba(16,24,40,0.04), 0 4px 12px rgba(16,24,40,0.02)"
    px={{ base: 5, md: 7 }}
    py={{ base: 5, md: 4 }}
    overflow="hidden"
  >
    {/* ── Subtle right-side background tint ─────────────────────────── */}
    <Box
      position="absolute"
      top={0}
      right={0}
      bottom={0}
      w={{ base: "40%", md: "35%" }}
      bgGradient="to-bl"
      gradientFrom="primary.50"
      gradientTo="white"
      opacity={0.5}
      pointerEvents="none"
    />

    {/* ── Very faint decorative arc behind the ring area ────────────── */}
    {/* <Box
      position="absolute"
      top="-30%"
      right="-8%"
      w="260px"
      h="260px"
      borderRadius="full"
      border="1px solid"
      borderColor="primary.100"
      opacity={0.35}
      pointerEvents="none"
    /> */}

    <HStack
      gap={{ base: 5, md: 8 }}
      align="center"
      justify="space-between"
      flexWrap="wrap"
      position="relative"
    >
      {/* ── Left: title + metrics ──────────────────────────────────── */}
      <Stack gap={1.5} flex="1" minW="260px">
        {eyebrow && (
          <HStack gap={1.5} align="center">
            {/* <Box w="1.5" h="1.5" borderRadius="full" bg="primary.500" /> */}
            <Text
              fontSize="10px"
              fontWeight={700}
              letterSpacing="0.1em"
              textTransform="uppercase"
              color="primary.600"
            >
              {eyebrow}
            </Text>
          </HStack>
        )}
        <Text fontSize="xl" fontWeight="700" color="gray.900" lineHeight="1.2">
          {title}
        </Text>
        {subtitle && (
          <Text fontSize="sm" color="gray.500" maxW="520px" lineHeight="1.5">
            {subtitle}
          </Text>
        )}

        {/* ── Metrics row ────────────────────────────────────────── */}
        <HStack
          gap={0}
          flexWrap="wrap"
          mt={3}
          align="flex-start"
          bg="gray.50/60"
          border="1px solid"
          borderColor="gray.100"
          borderRadius="lg"
          px={4}
          py={3}
        >
          {/* Primary metric */}
          <Stack
            gap={0}
            pr={5}
            mr={5}
            borderRight="1px solid"
            borderColor="gray.200"
          >
            <Text
              fontSize="10px"
              fontWeight={600}
              letterSpacing="0.06em"
              textTransform="uppercase"
              color="gray.500"
            >
              {primary.label}
            </Text>
            <Text
              color="gray.900"
              fontSize="3xl"
              fontWeight={800}
              lineHeight="1.1"
            >
              {primary.value}
            </Text>
            {primaryTrend && primaryTrend.length > 1 && (
              <Box w="120px" mt={1}>
                <Sparkline
                  id="hero-primary"
                  data={primaryTrend}
                  color="#0056FF"
                  height={24}
                />
              </Box>
            )}
          </Stack>

          {/* Secondary metrics with separators */}
          {stats.map((stat, index) => {
            const isLast = index === stats.length - 1;
            return (
              <HStack
                key={stat.label}
                gap={0}
                pr={isLast ? 0 : 5}
                mr={isLast ? 0 : 5}
                borderRight={isLast ? "none" : "1px solid"}
                borderColor="gray.200"
                align="flex-start"
              >
                <Stack gap={0}>
                  <HStack gap={1.5}>
                    {stat.icon && (
                      <Box color="primary.500" display="flex" opacity={0.7}>
                        {stat.icon}
                      </Box>
                    )}
                    <Text
                      fontSize="10px"
                      fontWeight={600}
                      letterSpacing="0.06em"
                      textTransform="uppercase"
                      color="gray.500"
                    >
                      {stat.label}
                    </Text>
                  </HStack>
                  <Text
                    color="gray.900"
                    fontSize="xl"
                    fontWeight={700}
                    lineHeight="1.2"
                  >
                    {stat.value}
                  </Text>
                </Stack>
              </HStack>
            );
          })}
        </HStack>
      </Stack>

      {/* ── Right: ProgressRing + Refresh ────────────────────────── */}
      <Stack gap={5} align="center" flexShrink={0} position="relative">
        {action}
        {aside}
      </Stack>
    </HStack>
  </Box>
);
