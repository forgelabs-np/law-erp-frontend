import { Box, Center, HStack, Text } from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";

interface OverviewCardProps {
  title: string;
  /** Optional supporting line rendered under the card title. */
  description?: string;
  icon?: LucideIcon;
  /** Optional controls rendered on the right of the card header. */
  actions?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Card shell used by the Court Case Detail → Overview tab.
 *
 * Scoped to the Overview tab so the shared `SectionCard` (used by other
 * tabs and modules) keeps its existing appearance.
 */
export const OverviewCard = ({
  title,
  description,
  icon: Icon,
  actions,
  children,
}: OverviewCardProps) => {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      boxShadow="0 1px 2px rgba(16, 24, 40, 0.04)"
      overflow="hidden"
      w="100%"
    >
      <HStack
        justify="space-between"
        align="center"
        gap={3}
        px={{ base: 4, md: 5 }}
        py={3.5}
        borderBottom="1px solid"
        borderColor="gray.100"
        bg="gray.50"
        flexWrap="wrap"
      >
        <HStack gap={3} align="center" minW={0}>
          {Icon && (
            <Center
              w="8"
              h="8"
              borderRadius="lg"
              bg="primary.50"
              color="primary.500"
              flexShrink={0}
            >
              <Icon size={16} />
            </Center>
          )}
          <Box minW={0}>
            <Text
              fontSize="14px"
              fontWeight="700"
              color="gray.900"
              letterSpacing="-0.01em"
              lineHeight="1.3"
            >
              {title}
            </Text>
            {description && (
              <Text fontSize="12px" color="gray.500" mt={0.5} lineHeight="1.4">
                {description}
              </Text>
            )}
          </Box>
        </HStack>

        {actions && (
          <HStack gap={2} flexShrink={0} flexWrap="wrap">
            {actions}
          </HStack>
        )}
      </HStack>

      <Box px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}>
        {children}
      </Box>
    </Box>
  );
};
