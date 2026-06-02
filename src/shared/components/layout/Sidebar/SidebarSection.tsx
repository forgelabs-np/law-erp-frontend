import { Box, Text, VStack } from "@chakra-ui/react";
import { SidebarSectionProps } from "@/shared/types";

export const SidebarSection = ({ title, items }: SidebarSectionProps) => {
  return (
    <Box>
      {title && (
        <Text
          fontSize="10px"
          fontWeight="600"
          color="gray.500"
          px="3"
          py="1"
          textTransform="uppercase"
          letterSpacing="wide"
        >
          {title}
        </Text>
      )}
      <VStack alignItems="stretch" gap="0">
        {items}
      </VStack>
    </Box>
  );
};
