import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { MotionConfig, motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { LiquidProgress } from "@/shared/components/ui";

import {
  COURT_SYNC_COMPLETION_MS,
  COURT_SYNC_MAX_WAIT_MS,
  CourtSyncPhase,
} from "../useCourtSync";

interface CourtSyncProgressPanelProps {
  phase: CourtSyncPhase;
  progress: number;
  elapsedMs: number;
  /** Court/date the running sync was started with (not the current selection). */
  courtName?: string;
  dateBs?: string;
  onRetry: () => void;
}

const formatElapsed = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

/**
 * Progress / timeout experience for the Court Data Sync run.
 *
 * The percentage is an estimate of elapsed time, not scraper progress, and the
 * copy says so. Nothing here claims the server-side scrape was cancelled.
 */
export const CourtSyncProgressPanel = ({
  phase,
  progress,
  elapsedMs,
  courtName,
  dateBs,
  onRetry,
}: CourtSyncProgressPanelProps) => {
  if (phase === "idle") return null;

  if (phase === "timedOut") {
    return (
      <Box
        p={5}
        bg="#FFFBEB"
        borderWidth="1px"
        borderColor="#FDE68A"
        borderRadius="lg"
        role="status"
        data-probe="sync-timeout"
      >
        <Stack gap={3}>
          <HStack gap={2} align="center">
            <AlertTriangle size={18} color="#B45309" />
            <Text fontSize="sm" fontWeight="600" color="#92400E">
              Sync timed out
            </Text>
          </HStack>

          <Text fontSize="sm" color="#92400E">
            Sync is taking longer than expected. The request timed out after 2
            minutes. Please try again.
          </Text>

          <Text fontSize="xs" color="#B45309">
            The sync may still be finishing on the server, so court data can
            still update shortly. Waited {formatElapsed(elapsedMs)}.
          </Text>

          <Button
            size="sm"
            variant="outline"
            borderColor="#B45309"
            color="#92400E"
            _hover={{ bg: "#FEF3C7" }}
            onClick={onRetry}
            maxW="fit-content"
            aria-label="Retry court data sync"
          >
            <HStack gap={2}>
              <RefreshCw size={14} />
              <Text>Retry Sync</Text>
            </HStack>
          </Button>
        </Stack>
      </Box>
    );
  }

  const isCompleting = phase === "completing";

  return (
    <MotionConfig reducedMotion="user">
      <Box
        p={5}
        bg="#0056FF"
        borderWidth="1px"
        borderColor="#E5E7EB"
        borderRadius="lg"
        aria-busy="true"
        data-probe="sync-progress"
      >
        <Stack gap={4}>
          <HStack gap={2} align="center">
            <motion.span
              style={{ display: "inline-flex" }}
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              aria-hidden="true"
            >
              <Box boxSize="10px" borderRadius="full" bg="#FFFFFF" />
            </motion.span>
            <Text
              fontSize="sm"
              fontWeight="600"
              color="#FFFFFF"
              data-probe="sync-heading"
            >
              {isCompleting
                ? "Finalising court data sync"
                : "Syncing Court Data"}
            </Text>
          </HStack>

          <Text fontSize="sm" color="#FFFFFF">
            Fetching and processing the latest court records. This may take a
            few moments.
          </Text>

          {(courtName || dateBs) && (
            <Text fontSize="xs" color="#FFFFFF" data-probe="sync-context">
              {courtName ? `${courtName}` : "Selected court"}
              {dateBs ? ` · ${dateBs}` : ""}
            </Text>
          )}

          <LiquidProgress
            progress={progress}
            height="14px"
            duration={isCompleting ? COURT_SYNC_COMPLETION_MS : 200}
            ariaLabel="Court data sync progress"
            valueText={`${Math.round(progress)} percent, estimated`}
          />

          <HStack justify="space-between" gap={4} flexWrap="wrap">
            <Text
              fontSize="xs"
              color="#FFFFFF"
              fontFamily="monospace"
              data-probe="sync-percent"
            >
              {Math.round(progress)}%
            </Text>
            <Text
              fontSize="xs"
              color="#FFFFFF"
              fontFamily="monospace"
              data-probe="sync-elapsed"
            >
              Elapsed {formatElapsed(elapsedMs)} · up to{" "}
              {formatElapsed(COURT_SYNC_MAX_WAIT_MS)}
            </Text>
          </HStack>

          <Text fontSize="xs" color="#FFFFFF">
            Progress is an estimate while the sync runs.
          </Text>
        </Stack>
      </Box>
    </MotionConfig>
  );
};

export default CourtSyncProgressPanel;
