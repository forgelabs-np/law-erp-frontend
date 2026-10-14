import { Box, HStack, Skeleton, VStack } from "@chakra-ui/react";

/**
 * Loading placeholder that mirrors `DocumentCard` so the document grid keeps
 * its shape (and height) while a folder's documents are being fetched.
 */
export const DocumentCardSkeleton = () => (
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
    <VStack align="stretch" gap={3} p={5} flex="1">
      <HStack justify="space-between" align="flex-start">
        <Skeleton w="10" h="10" borderRadius="lg" />
        <Skeleton w="14" h="5" borderRadius="full" />
      </HStack>
      <VStack align="stretch" gap={2}>
        <Skeleton h="4" w="88%" />
        <Skeleton h="3" w="46%" />
      </VStack>
    </VStack>

    <Box borderTop="1px solid" borderColor="gray.100" />

    <Box px={5} py={3}>
      <Skeleton h="3" w="36%" />
    </Box>

    <HStack
      justify="space-between"
      px={5}
      py={3}
      bg="gray.50"
      borderTop="1px solid"
      borderColor="gray.100"
    >
      <Skeleton h="8" w="20" borderRadius="lg" />
      <Skeleton h="8" w="8" borderRadius="lg" />
    </HStack>
  </Box>
);
