import { Box, HStack, Skeleton, VStack } from "@chakra-ui/react";

/**
 * Loading placeholder that mirrors `DocumentFolderCard` so the library grid
 * keeps its shape (and height) while documents are being fetched.
 */
export const DocumentFolderCardSkeleton = () => (
  <Box
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="xl"
    boxShadow="0 1px 2px rgba(16, 24, 40, 0.04)"
    overflow="hidden"
    display="flex"
    flexDirection="column"
    h="100%"
  >
    <VStack align="stretch" gap={3.5} p={5}>
      <HStack justify="space-between" align="flex-start">
        <Skeleton w="12" h="12" borderRadius="xl" />
        <Skeleton w="16" h="5" borderRadius="full" />
      </HStack>
      <VStack align="stretch" gap={2}>
        <Skeleton h="4" w="82%" />
        <Skeleton h="4" w="52%" />
      </VStack>
    </VStack>

    <Box borderTop="1px solid" borderColor="gray.100" mt="auto" />

    <HStack justify="space-between" px={5} py={3.5} bg="gray.50">
      <VStack align="stretch" gap={2}>
        <Skeleton h="4" w="24" />
        <Skeleton h="3" w="32" />
      </VStack>
      <Skeleton h="4" w="12" />
    </HStack>
  </Box>
);
