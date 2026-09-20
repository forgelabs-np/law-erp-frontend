import { Box, HStack, Skeleton, VStack } from "@chakra-ui/react";

/**
 * Loading placeholder that mirrors the `MatterCard` layout so the grid
 * keeps its shape while matters are being fetched.
 */
export const MatterCardSkeleton = () => (
  <Box
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="xl"
    boxShadow="0 1px 2px rgba(16, 24, 40, 0.04)"
    overflow="hidden"
  >
    <VStack align="stretch" gap={3.5} p={5}>
      <HStack justify="space-between">
        <HStack gap={2.5}>
          <Skeleton w="9" h="9" borderRadius="lg" />
          <Skeleton w="14" h="5" borderRadius="full" />
        </HStack>
        <Skeleton w="16" h="5" borderRadius="full" />
      </HStack>

      <VStack align="stretch" gap={2}>
        <Skeleton h="4" w="88%" />
        <Skeleton h="4" w="58%" />
      </VStack>
    </VStack>

    <Box borderTop="1px solid" borderColor="gray.100" />

    <VStack align="stretch" gap={2.5} px={5} py={4}>
      <Skeleton h="4" w="40%" />
      <Skeleton h="4" w="68%" />
    </VStack>

    <HStack
      justify="space-between"
      px={5}
      py={3.5}
      borderTop="1px solid"
      borderColor="gray.100"
      bg="gray.50"
    >
      <Skeleton h="4" w="32%" />
      <Skeleton h="8" w="28" borderRadius="lg" />
    </HStack>
  </Box>
);
