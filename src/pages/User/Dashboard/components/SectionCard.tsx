import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

import type { StatTone } from "../types";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

/** Shared empty state used inside section cards and lists. */
export const EmptyState = ({ title, description, icon }: EmptyStateProps) => (
  <Stack
    gap={3}
    align="center"
    justify="center"
    py={8}
    textAlign="center"
    border="1px dashed"
    borderColor="gray.200"
    borderRadius="lg"
    bg="gray.50"
  >
    {icon && (
      <Box
        w="10"
        h="10"
        borderRadius="full"
        bg="white"
        color="gray.400"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="xs"
      >
        {icon}
      </Box>
    )}
    <Stack gap={0.5}>
      <Text fontSize="sm" fontWeight={600} color="gray.700">
        {title}
      </Text>
      {description && (
        <Text fontSize="xs" color="gray.400" maxW="280px">
          {description}
        </Text>
      )}
    </Stack>
  </Stack>
);

interface ScalarRowProps {
  label: string;
  value: string;
  tone?: StatTone;
}

/** Compact label/value row for scalar metrics inside a section card. */
export const ScalarRow = ({
  label,
  value,
  tone = "primary",
}: ScalarRowProps) => (
  <Stack
    gap={0.5}
    bg={`${tone}.50`}
    border="1px solid"
    borderColor={`${tone}.100`}
    borderRadius="lg"
    px={3}
    py={2.5}
    minW={0}
  >
    <Text
      fontSize="10px"
      color="gray.500"
      textTransform="uppercase"
      letterSpacing="wide"
    >
      {label}
    </Text>
    <Text
      fontSize="sm"
      fontWeight={600}
      color="gray.900"
      wordBreak="break-word"
    >
      {value}
    </Text>
  </Stack>
);

interface SectionCardProps {
  title: string;
  icon: ReactNode;
  tone?: StatTone;
  subtitle?: string;
  action?: ReactNode;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  children: ReactNode;
}

/**
 * The card shell used across all role dashboards: tinted icon tile, hairline
 * divider under the header, soft shadow and a hover lift so panels feel
 * layered rather than like flat white blocks.
 */
export const SectionCard = ({
  title,
  icon,
  tone = "primary",
  subtitle,
  action,
  isEmpty = false,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  emptyIcon,
  children,
}: SectionCardProps) => (
  <Box
    position="relative"
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="xl"
    boxShadow="0 1px 2px rgba(16,24,40,0.04)"
    transition="box-shadow 0.2s ease, border-color 0.2s ease"
    _hover={{ boxShadow: "0 6px 18px -12px rgba(16,24,40,0.35)" }}
    h="100%"
    minW={0}
    overflow="hidden"
  >
    {/* Tinted wash for depth */}
    <Box
      position="absolute"
      top={0}
      right={0}
      w="160px"
      h="76px"
      pointerEvents="none"
      bgGradient="to-bl"
      gradientFrom={`${tone}.50`}
      gradientTo="transparent"
    />

    <Stack gap={0} position="relative">
      <HStack
        justify="space-between"
        align="center"
        gap={3}
        px={5}
        py={3.5}
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        <HStack gap={2.5} minW={0}>
          <Box
            w="8"
            h="8"
            borderRadius="lg"
            bg={`${tone}.50`}
            color={`${tone}.600`}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            {icon}
          </Box>
          <Stack gap={0} minW={0}>
            <Text fontSize="sm" fontWeight={600} color="gray.900" lineClamp={1}>
              {title}
            </Text>
            {subtitle && (
              <Text fontSize="10px" color="gray.400" lineClamp={1}>
                {subtitle}
              </Text>
            )}
          </Stack>
        </HStack>
        {action}
      </HStack>

      <Box px={5} py={4}>
        {isEmpty ? (
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            icon={emptyIcon}
          />
        ) : (
          children
        )}
      </Box>
    </Stack>
  </Box>
);
