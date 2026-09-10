import { Badge, Box, HStack, Progress, Stack, Text } from "@chakra-ui/react";

const ProgressBar = Progress.Root;
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";

import { TemplateSyncJob } from "@/api/roleTemplate";

/**
 * Persistent status banner for a template permission sync job.
 * Renders while the job is pending/running and stays visible with the
 * final outcome (including failures) once a terminal status is reached.
 */
export const TemplateSyncJobStatus = ({
  job,
}: {
  job: TemplateSyncJob;
}) => {
  const stateConfig = (() => {
    switch (job.status) {
      case "PENDING":
        return {
          label: "Queued",
          colorScheme: "gray" as const,
          icon: <Clock size={16} />,
          message: "Permission synchronization is queued.",
          borderColor: "gray.300",
          bg: "gray.50",
          textColor: "gray.700",
        };
      case "RUNNING":
        return {
          label: "Running",
          colorScheme: "blue" as const,
          icon: <Loader2 size={16} className="spin" />,
          message: "Synchronizing permissions across firms...",
          borderColor: "blue.300",
          bg: "blue.50",
          textColor: "blue.700",
        };
      case "COMPLETED":
        return {
          label: "Completed",
          colorScheme: "green" as const,
          icon: <CheckCircle2 size={16} />,
          message: "Permission synchronization completed successfully.",
          borderColor: "green.300",
          bg: "green.50",
          textColor: "green.700",
        };
      case "COMPLETED_WITH_FAILURES":
        return {
          label: "Completed with failures",
          colorScheme: "orange" as const,
          icon: <AlertCircle size={16} />,
          message: "Permission synchronization completed with some failures.",
          borderColor: "orange.300",
          bg: "orange.50",
          textColor: "orange.700",
        };
      case "FAILED":
        return {
          label: "Failed",
          colorScheme: "red" as const,
          icon: <XCircle size={16} />,
          message: "Permission synchronization failed.",
          borderColor: "red.300",
          bg: "red.50",
          textColor: "red.700",
        };
      default:
        return {
          label: job.status,
          colorScheme: "gray" as const,
          icon: <Clock size={16} />,
          message: `Synchronization status: ${job.status}`,
          borderColor: "gray.300",
          bg: "gray.50",
          textColor: "gray.700",
        };
    }
  })();

  const progressPercent =
    job.firmsTotal > 0
      ? Math.round(((job.firmsCompleted + job.firmsFailed) / job.firmsTotal) * 100)
      : 0;

  return (
    <Box
      border="1px solid"
      borderColor={stateConfig.borderColor}
      bg={stateConfig.bg}
      borderRadius="lg"
      p={4}
      w="full"
    >
      <Stack gap={2}>
        <HStack justifyContent="space-between" flexWrap="wrap" gap={2}>
          <HStack gap={2} color={stateConfig.textColor}>
            {stateConfig.icon}
            <Text fontWeight="600" fontSize="sm">
              {stateConfig.message}
            </Text>
            <Badge
              colorScheme={stateConfig.colorScheme}
              fontSize="xs"
              px="2"
              py="0.5"
            >
              {stateConfig.label}
            </Badge>
          </HStack>
          <Text fontSize="xs" color="gray.500" fontFamily="mono">
            {job.templateCode}
          </Text>
        </HStack>

        {/* Progress */}
        {job.firmsTotal > 0 && (
          <Stack gap={1}>
            <ProgressBar
              value={progressPercent}
              size="sm"
              colorPalette={stateConfig.colorScheme}
            />
            <HStack justifyContent="space-between">
              <Text fontSize="xs" color="gray.600">
                {job.firmsCompleted} / {job.firmsTotal} firms completed
              </Text>
              {job.firmsFailed > 0 && (
                <Text fontSize="xs" color="red.600" fontWeight="600">
                  {job.firmsFailed} failed
                </Text>
              )}
            </HStack>
          </Stack>
        )}

        {/* Error summary — never hidden */}
        {job.errorSummary && (
          <Box
            bg="white"
            border="1px solid"
            borderColor="red.200"
            borderRadius="md"
            px={3}
            py={2}
          >
            <Text fontSize="xs" fontWeight="600" color="red.600" mb={0.5}>
              Error summary
            </Text>
            <Text fontSize="xs" color="red.600">
              {job.errorSummary}
            </Text>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
