import { Box, Text, VStack } from "@chakra-ui/react";
import { SidebarSectionProps } from "@/shared/types";

export const SidebarSection = ({ title, items }: SidebarSectionProps) => {
  return (
    <Box mb="5">
      {title && (
        <Text
          fontSize="11px"
          fontWeight="700"
          color="gray.400"
          px="3"
          mb="2.5"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          {title}
        </Text>
      )}
      <VStack alignItems="stretch" gap="1.5">
        {items}
      </VStack>
    </Box>
  );
};
