import { Box, HStack, Skeleton, Stack, VStack } from "@chakra-ui/react";

export const AuditLogsSkeleton = () => {
  return (
    <Stack gap={8}>
      {[1, 2, 3].map((group) => (
        <Stack key={group} gap={4}>
          {/* Date header skeleton */}
          <Skeleton height="20px" width="150px" borderRadius="md" />

          {/* Timeline items */}
          <Stack gap={4} pl={2}>
            {[1, 2].map((item) => (
              <HStack key={item} align="start" gap={4}>
                {/* Time skeleton */}
                <Skeleton height="16px" width="60px" borderRadius="md" />

                {/* Timeline node skeleton */}
                <Box
                  width="32px"
                  height="32px"
                  borderRadius="full"
                  bg="gray.200"
                  flexShrink={0}
                />

                {/* Event card skeleton */}
                <VStack gap={3} flex={1} align="stretch">
                  <HStack gap={2}>
                    <Skeleton height="24px" width="100px" borderRadius="md" />
                    <Skeleton height="20px" width="200px" borderRadius="md" />
                  </HStack>
                  <HStack gap={4}>
                    <Skeleton height="16px" width="120px" borderRadius="md" />
                    <Skeleton height="16px" width="100px" borderRadius="md" />
                    <Skeleton height="16px" width="140px" borderRadius="md" />
                  </HStack>
                </VStack>
              </HStack>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
