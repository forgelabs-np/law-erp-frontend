import { Box, HStack, Stack, Text } from "@chakra-ui/react";

interface CaseDiaryWorkspaceProps {
  title: string;
  subtitle?: string;
  /** Existing page-level actions (e.g. Schedule Event), rendered top-right. */
  actions?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Rounded, subtly tinted container that sets the Case Diary apart from the
 * page surface. Inner event rows are white cards layered on top of it, so the
 * diary reads as one cohesive workspace instead of loose white sections.
 */
export const CaseDiaryWorkspace = ({
  title,
  subtitle,
  actions,
  children,
}: CaseDiaryWorkspaceProps) => {
  return (
    <Box
      bg="gray.100"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={{ base: 3, md: 5 }}
      w="100%"
    >
      <HStack
        justify="space-between"
        align="flex-start"
        gap={3}
        flexWrap="wrap"
        mb={{ base: 4, md: 5 }}
      >
        <Box minW={0}>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="700"
            color="gray.900"
            letterSpacing="-0.01em"
            lineHeight="1.25"
          >
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="sm" color="gray.500" mt={1} lineHeight="1.5">
              {subtitle}
            </Text>
          )}
        </Box>

        {actions && (
          <HStack gap={2} flexShrink={0} flexWrap="wrap">
            {actions}
          </HStack>
        )}
      </HStack>

      <Stack gap={{ base: 4, md: 5 }} align="stretch">
        {children}
      </Stack>
    </Box>
  );
};
