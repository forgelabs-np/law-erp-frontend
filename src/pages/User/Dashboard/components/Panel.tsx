import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

import { StatTone, TONE_HEX } from "../types";

interface PanelProps {
  /** Omit to render a header-less surface (for content that owns its header). */
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  tone?: StatTone;
  /** Rendered at the right of the header — usually a SegmentedControl. */
  action?: ReactNode;
  /** Removes body padding for panels whose children manage their own layout. */
  flush?: boolean;
  children: ReactNode;
}

/**
 * Clean panel surface. Uses subtle borders and shadows instead of gradient
 * headers and glow effects for a professional, understated appearance.
 */
export const Panel = ({
  title,
  subtitle,
  icon,
  tone = "primary",
  action,
  flush = false,
  children,
}: PanelProps) => {
  const hex = TONE_HEX[tone];

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      boxShadow="0 1px 3px rgba(16,24,40,0.04)"
      overflow="hidden"
      transition="border-color 0.2s ease"
      _hover={{
        borderColor: "gray.300",
      }}
      h="100%"
      minW={0}
    >
      {title && (
        <HStack
          justify="space-between"
          align="center"
          gap={3}
          px={{ base: 4, md: 5 }}
          py={3.5}
          borderBottom="1px solid"
          borderColor="gray.100"
        >
          <HStack gap={2.5} minW={0}>
            {icon && (
              <Box
                w="7"
                h="7"
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
            )}
            <Stack gap={0} minW={0}>
              <Text
                fontSize="sm"
                fontWeight={600}
                color="gray.900"
                lineClamp={1}
              >
                {title}
              </Text>
              {subtitle && (
                <Text fontSize="11px" color="gray.500" lineClamp={1}>
                  {subtitle}
                </Text>
              )}
            </Stack>
          </HStack>
          {action && <Box flexShrink={0}>{action}</Box>}
        </HStack>
      )}

      <Box p={flush ? 0 : { base: 4, md: 5 }} minW={0}>
        {children}
      </Box>
    </Box>
  );
};

interface PanelSectionProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  tone?: StatTone;
  action?: ReactNode;
  /** Draw the hairline above this section. Off for the first section. */
  divided?: boolean;
  children: ReactNode;
}

/** A labelled block inside a `Panel`, separated by hairline dividers. */
export const PanelSection = ({
  title,
  subtitle,
  icon,
  tone = "primary",
  action,
  divided = true,
  children,
}: PanelSectionProps) => (
  <Box
    px={{ base: 4, md: 5 }}
    py={4}
    borderTop={divided ? "1px solid" : undefined}
    borderColor="gray.100"
    minW={0}
  >
    {(title || action) && (
      <HStack justify="space-between" align="center" gap={3} mb={3}>
        <HStack gap={2} minW={0}>
          {icon && (
            <Box
              w="6"
              h="6"
              borderRadius="sm"
              bg={`${tone}.50`}
              color={TONE_HEX[tone]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              {icon}
            </Box>
          )}
          <Stack gap={0} minW={0}>
            {title && (
              <Text
                fontSize="11px"
                fontWeight={600}
                color="gray.600"
                textTransform="uppercase"
                letterSpacing="0.04em"
                lineClamp={1}
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text fontSize="11px" color="gray.400" lineClamp={1}>
                {subtitle}
              </Text>
            )}
          </Stack>
        </HStack>
        {action}
      </HStack>
    )}
    {children}
  </Box>
);
