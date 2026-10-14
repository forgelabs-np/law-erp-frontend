import { Box, HStack, Progress, Stack, Text } from "@chakra-ui/react";
import { HardDrive } from "lucide-react";

import { StorageUsage } from "../types/firmDocument.types";
import { formatFileSize } from "@/shared/utils/documents";

/**
 * Compact storage-capacity summary panel for the document library.
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
  const rawPercent = Math.min(100, Math.max(0, usage?.usedPercent ?? 0));
  const percentDisplay =
    rawPercent > 0 && rawPercent < 1
      ? rawPercent.toFixed(1)
      : Math.round(rawPercent);

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="20px"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.04)"
      p={5}
      w="100%"
    >
      <HStack justify="space-between" align="center" mb={4} gap={3}>
        <HStack gap={3} minW={0}>
          <Box
            w="10"
            h="10"
            borderRadius="12px"
            bg="blue.50"
            color="blue.600"
            display="grid"
            placeItems="center"
            flexShrink={0}
          >
            <HardDrive size={18} />
          </Box>
          <Stack gap={0} minW={0}>
            <Text fontSize="sm" fontWeight={600} color="gray.800">
              Storage Capacity
            </Text>
            <Text fontSize="xs" color="gray.500">
              Workspace cloud storage
            </Text>
          </Stack>
        </HStack>

        <Box
          px={2.5}
          py={1}
          borderRadius="full"
          bg="gray.100"
          fontSize="xs"
          fontWeight={600}
          color="gray.700"
        >
          {isLoading
            ? "Loading..."
            : isUnlimited
              ? "Unlimited"
              : `${percentDisplay}%`}
        </Box>
      </HStack>

      {isUnlimited ? (
        <Stack gap={1}>
          <Text fontSize="sm" fontWeight={600} color="gray.800">
            {used} used
          </Text>
          <Text fontSize="xs" color="gray.500">
            Unlimited storage quota
          </Text>
        </Stack>
      ) : (
        <Stack gap={3}>
          <Progress.Root value={rawPercent} size="sm" borderRadius="full">
            <Progress.Track bg="gray.100" h="8px" borderRadius="full">
              <Progress.Range
                bg={rawPercent >= 90 ? "red.500" : "blue.500"}
                borderRadius="full"
              />
            </Progress.Track>
          </Progress.Root>

          <HStack justify="space-between" align="center" gap={3}>
            <Stack gap={0}>
              <Text
                fontSize="11px"
                color="gray.400"
                fontWeight={500}
                textTransform="uppercase"
                letterSpacing="0.04em"
              >
                Used
              </Text>
              <Text fontSize="sm" fontWeight={600} color="gray.800">
                {used}
              </Text>
            </Stack>

            <Stack gap={0} textAlign="right">
              <Text
                fontSize="11px"
                color="gray.400"
                fontWeight={500}
                textTransform="uppercase"
                letterSpacing="0.04em"
              >
                Total Quota
              </Text>
              <Text fontSize="sm" fontWeight={600} color="gray.800">
                {quota}
              </Text>
            </Stack>
          </HStack>

          <HStack
            justify="space-between"
            align="center"
            pt={2}
            borderTop="1px solid"
            borderColor="gray.100"
          >
            <Text fontSize="xs" color="gray.500">
              Available space
            </Text>
            <Text fontSize="xs" fontWeight={600} color="gray.700">
              {available}
            </Text>
          </HStack>
        </Stack>
      )}
    </Box>
  );
};
