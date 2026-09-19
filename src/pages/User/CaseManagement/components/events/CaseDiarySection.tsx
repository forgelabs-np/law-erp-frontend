import { Box, Center, HStack, Text } from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";

interface CaseDiarySectionProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  /** Right-aligned meta such as an event count. */
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Groups a block of event rows inside `CaseDiaryWorkspace`. Deliberately not a
 * card of its own: the workspace supplies the tinted surface and the rows are
 * the white cards, so the diary never nests card inside card inside card.
 */
export const CaseDiarySection = ({
  title,
  subtitle,
  icon: Icon,
  meta,
  actions,
  children,
}: CaseDiarySectionProps) => {
  return (
    <Box w="100%">
      <HStack
        justify="space-between"
        align="center"
        gap={3}
        flexWrap="wrap"
        mb={3}
      >
        <HStack gap={2.5} align="center" minW={0}>
          {Icon && (
            <Center
              w="7"
              h="7"
              borderRadius="md"
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              color="primary.500"
              flexShrink={0}
            >
              <Icon size={14} />
            </Center>
          )}
          <Box minW={0}>
            <Text
              fontSize="xs"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.08em"
              color="gray.600"
            >
              {title}
            </Text>
            {subtitle && (
              <Text fontSize="xs" color="gray.500" mt={0.5} lineHeight="1.4">
                {subtitle}
              </Text>
            )}
          </Box>
        </HStack>

        <HStack gap={2} flexShrink={0} flexWrap="wrap">
          {meta}
          {actions}
        </HStack>
      </HStack>

      {children}
    </Box>
  );
};
