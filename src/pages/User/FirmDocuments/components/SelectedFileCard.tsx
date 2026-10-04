import {
  Box,
  HStack,
  IconButton,
  Image,
  Progress,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AlertCircle, CheckCircle2, RotateCcw, X } from "lucide-react";

import { DocumentTypeIcon } from "@/shared/components/documents";
import {
  formatFileSize,
  getDocumentContentType,
  getDocumentExtension,
  getFileTypeLabel,
} from "@/shared/utils/documents";
import {
  DocumentUploadStage,
  uploadStageLabel,
} from "../types/firmDocument.types";

interface SelectedFileCardProps {
  file: File;
  /** Temporary `URL.createObjectURL` thumbnail for image files (revoked by the owner). */
  previewUrl?: string | null;
  /** Client-side validation error — the file must be removed/replaced, no upload allowed. */
  validationError?: string;
  stage: DocumentUploadStage;
  /** Real upload progress, 0-100. */
  progress: number;
  /** Backend/storage error message when `stage === "error"`. */
  uploadError?: string;
  isUploading: boolean;
  onRemove: () => void;
  onRetry: () => void;
}

/**
 * The selected-file card: thumbnail/icon, name, size, live status and the
 * real upload progress bar (driven by `upload.onprogress`, never a timer).
 *
 * Success is only ever shown for the `success` stage — i.e. after the server
 * responds to the single multipart POST — so an in-flight request can never
 * look like a completed upload.
 */
export const SelectedFileCard = ({
  file,
  previewUrl,
  validationError,
  stage,
  progress,
  uploadError,
  isUploading,
  onRemove,
  onRetry,
}: SelectedFileCardProps) => {
  const isSuccess = stage === "success";
  const isUploadError = stage === "error";
  const isInvalid = Boolean(validationError);
  const isError = isInvalid || isUploadError;

  // Progress reflects the real byte upload only. At 100% the request is still
  // open (server validating/storing) — the label reads "Finalizing…" then.
  const showProgress = stage === "uploading";
  const showPercent = showProgress;

  const statusText = isInvalid
    ? "Invalid file"
    : stage === "idle"
      ? "Ready to upload"
      : stage === "error"
        ? "Upload failed"
        : stage === "success"
          ? "Uploaded"
          : (uploadStageLabel({ stage, progress }) ?? "Uploading document...");

  const statusColor = isError
    ? "red.600"
    : isSuccess
      ? "green.600"
      : "gray.600";

  const borderColor = isError
    ? "red.200"
    : isSuccess
      ? "green.200"
      : "gray.200";
  const background = isError ? "red.50" : isSuccess ? "green.50" : "white";

  const typeLabel = getFileTypeLabel({
    extension: getDocumentExtension(file.name),
    contentType: file.type || getDocumentContentType(file.name),
  });

  return (
    <Box
      border="1px solid"
      borderColor={borderColor}
      bg={background}
      borderRadius="xl"
      px={4}
      py={3}
      transition="border-color 150ms ease, background-color 150ms ease"
    >
      <HStack align="flex-start" gap={3}>
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt=""
            boxSize={10}
            objectFit="cover"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
            flexShrink={0}
          />
        ) : (
          <Box
            bg="gray.100"
            borderRadius="md"
            p={2}
            display="inline-flex"
            flexShrink={0}
          >
            <DocumentTypeIcon
              document={{
                extension: getDocumentExtension(file.name),
                contentType: file.type || getDocumentContentType(file.name),
              }}
            />
          </Box>
        )}

        <Stack gap={1} flex="1" minW={0}>
          <Text
            fontSize="sm"
            fontWeight={600}
            color="gray.800"
            truncate
            title={file.name}
          >
            {file.name}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {typeLabel} · {formatFileSize(file.size)}
          </Text>

          <HStack justify="space-between" gap={2}>
            <HStack gap={1.5} minW={0}>
              {isSuccess && (
                <Box color="green.600" display="inline-flex">
                  <CheckCircle2 size={14} />
                </Box>
              )}
              {isError && (
                <Box color="red.600" display="inline-flex">
                  <AlertCircle size={14} />
                </Box>
              )}
              {isUploading && <Spinner size="xs" color="primary.500" />}
              <Text fontSize="xs" color={statusColor} truncate>
                {statusText}
              </Text>
            </HStack>
            {showPercent && (
              <Text fontSize="xs" color="gray.500" flexShrink={0}>
                {progress}%
              </Text>
            )}
          </HStack>

          {showProgress && (
            <Progress.Root
              value={progress}
              size="sm"
              borderRadius="full"
              h="1.5"
            >
              <Progress.Track bg="gray.100">
                <Progress.Range bg="primary.500" />
              </Progress.Track>
            </Progress.Root>
          )}
        </Stack>

        <IconButton
          variant="ghost"
          size="sm"
          color="gray.400"
          aria-label={`Remove ${file.name}`}
          onClick={onRemove}
          disabled={isUploading}
          flexShrink={0}
        >
          <X size={16} />
        </IconButton>
      </HStack>

      {isInvalid && (
        <Text fontSize="sm" color="red.600" mt={2}>
          {validationError}
        </Text>
      )}

      {!isInvalid && isUploadError && (
        <HStack justify="space-between" gap={3} mt={2} align="flex-start">
          <Text fontSize="sm" color="red.600" minW={0}>
            {uploadError ?? "Upload failed. Please try again."}
          </Text>
          <IconButton
            variant="ghost"
            size="sm"
            color="red.600"
            aria-label={`Retry uploading ${file.name}`}
            onClick={onRetry}
            flexShrink={0}
          >
            <RotateCcw size={14} />
          </IconButton>
        </HStack>
      )}
    </Box>
  );
};
