import { Box, HStack, Progress, Stack, Text } from "@chakra-ui/react";
import { HardDrive } from "lucide-react";

import { StorageUsage } from "../types/firmDocument.types";
import { formatFileSize } from "@/shared/utils/documents";

/**
 * Compact storage summary for the document library.
 *
 * `quotaBytes === 0` / `unlimited === true` means unlimited storage — in that
 * case `availableBytes` is also 0 and must NOT be read as "no space left",
 * so no progress bar is rendered at all.
 */
export const StorageUsageCard = ({
  usage,
  isLoading,
}: {
  usage: StorageUsage | undefined;
  isLoading?: boolean;
}) => {
  const used = formatFileSize(usage?.usedBytes ?? 0);
  const quota = formatFileSize(usage?.quotaBytes ?? 0);
  const available = formatFileSize(usage?.availableBytes ?? 0);
  const isUnlimited =
    Boolean(usage?.unlimited) || (usage?.quotaBytes ?? 0) <= 0;
  const percent = Math.min(100, Math.max(0, usage?.usedPercent ?? 0));

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={4}
      minW={0}
    >
      <HStack justify="space-between" align="center" mb={2} gap={3}>
        <HStack gap={2} minW={0}>
          <HardDrive size={16} color="#4b5563" />
          <Text fontSize="sm" fontWeight={600} color="gray.800">
            Storage
          </Text>
        </HStack>
        <Text fontSize="sm" color="gray.600" whiteSpace="nowrap">
          {isLoading
            ? "Loading..."
            : isUnlimited
              ? `${used} used`
              : `${used} of ${quota}`}
        </Text>
      </HStack>

      {isUnlimited ? (
        <Text fontSize="xs" color="gray.500">
          Unlimited storage
        </Text>
      ) : (
        <Stack gap={2}>
          <Progress.Root value={percent} size="sm" borderRadius="full">
            <Progress.Track bg="gray.100">
              <Progress.Range bg={percent >= 90 ? "red.400" : "primary.500"} />
            </Progress.Track>
          </Progress.Root>
          <HStack justify="space-between" gap={3}>
            <Text fontSize="xs" color="gray.500">
              {percent}% used
            </Text>
            <Text fontSize="xs" color="gray.500">
              {available} available
            </Text>
          </HStack>
        </Stack>
      )}
    </Box>
  );
};
