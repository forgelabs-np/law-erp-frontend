import {
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Download, FileText, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { AxiosResponse } from "axios";

import {
  DialogBackdrop,
  DialogContent,
  DialogRoot,
} from "@/shared/components/ui/Dialog";
import { DocumentDownloadUrl, DocumentRecord } from "@/shared/types/documents";
import { ApiResponse } from "@/shared/types/response";
import {
  formatFileSize,
  getBackendErrorMessage,
  getDocumentPreviewKind,
  getFileTypeLabel,
  isDocumentDownloadable,
} from "@/shared/utils/documents";
import { DocumentTypeIcon } from "./DocumentTypeIcon";
import { useDocumentDownload } from "./useDocumentDownload";

export interface DocumentViewerProps {
  /** The document to preview. `null` closes the viewer. */
  document: DocumentRecord | null;
  onClose: () => void;
  /**
   * Requests a short-lived signed URL for this document. Supplied by the
   * owning scope so the firm and client endpoints stay separate. Deliberately
   * a plain async call (never a query/mutation) so the signed URL can never
   * land in the React Query cache.
   */
  requestDownloadUrl: (
    documentId: number
  ) => Promise<AxiosResponse<ApiResponse<DocumentDownloadUrl>>>;
}

/**
 * The single in-app document preview, shared by `/folder`, the Matter
 * Documents tab and the Project Documents tab.
 *
 * Security contract for the signed URL (a bearer credential):
 * - requested only when the viewer is open for a previewable document —
 *   never when rendering a table row, never preloaded
 * - held in component state only, never logged, persisted or cached
 * - cleared as soon as the viewer closes (the effect below resets it when
 *   `document` becomes `null`, and state dies with the component on unmount)
 *
 * PDFs render in an iframe (browser-native viewer), images render in an `<img>`
 * with `object-fit: contain`. Everything else gets a professional fallback
 * with a Download action — never a broken iframe.
 */
export const DocumentViewer = ({
  document,
  onClose,
  requestDownloadUrl,
}: DocumentViewerProps) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  // Bumped by "Try Again" to re-request the signed URL.
  const [attempt, setAttempt] = useState(0);

  const { download, isDownloading } = useDocumentDownload(requestDownloadUrl);

  const documentId = document?.id ?? null;
  const previewKind = document
    ? getDocumentPreviewKind(document)
    : ("unsupported" as const);
  // Still consulted by the fallback card's Download action.
  const isAvailable = document ? isDocumentDownloadable(document) : false;
  // Previewability is decided by the FILE TYPE alone. The upload status is a
  // backend lifecycle detail and never hides the preview: the signed URL is
  // always requested, so a document that cannot be served surfaces as a
  // retryable error instead of a dead-end disabled control.
  const canPreview = previewKind !== "unsupported";

  // Fetch the signed URL only while the viewer is open on a previewable
  // document. All dependencies are primitives derived from the document, so
  // a background list refetch (new object identity, same document) never
  // re-requests the URL.
  useEffect(() => {
    if (documentId === null || !canPreview) {
      // Viewer closed (or unsupported type): drop any URL we hold.
      setSignedUrl(null);
      setIsLoadingUrl(false);
      setUrlError(null);
      return;
    }

    let cancelled = false;

    setSignedUrl(null);
    setUrlError(null);
    setIsLoadingUrl(true);

    requestDownloadUrl(documentId)
      .then((response) => {
        if (cancelled) return;

        const payload = response?.data;

        if (!payload?.success || !payload.data?.downloadUrl) {
          setUrlError(payload?.message ?? "Unable to load this document.");
          return;
        }

        setSignedUrl(payload.data.downloadUrl);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setUrlError(
          getBackendErrorMessage(error) ?? "Unable to load this document."
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoadingUrl(false);
      });

    return () => {
      cancelled = true;
    };
  }, [documentId, canPreview, attempt, requestDownloadUrl]);

  const isOpen = document !== null;

  const handleOpenChange = (event: { open: boolean }) => {
    if (!event.open) onClose();
  };

  if (!document) return null;

  const typeLabel = getFileTypeLabel(document);
  const sizeLabel = formatFileSize(document.sizeBytes);

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={handleOpenChange}
      closeOnInteractOutside={false}
    >
      <DialogBackdrop />
      <DialogContent
        p={0}
        borderRadius="2xl"
        overflow="hidden"
        w={["calc(100vw - 24px)", "calc(100vw - 48px)", "960px"]}
        maxW="960px"
        h={["calc(100dvh - 48px)", "min(85vh, 800px)"]}
        maxH="800px"
        display="flex"
        flexDirection="column"
      >
        {/* ---------- Header ---------- */}
        <HStack
          justify="space-between"
          gap={3}
          px={5}
          py={3}
          borderBottom="1px solid"
          borderColor="gray.200"
          flexShrink={0}
        >
          <HStack gap={2} minW={0}>
            <DocumentTypeIcon document={document} />
            <Text
              fontSize="sm"
              fontWeight={600}
              color="gray.800"
              truncate
              title={document.fileName}
            >
              {document.fileName}
            </Text>
          </HStack>

          <HStack gap={2} flexShrink={0}>
            <Button
              variant="outline"
              size="sm"
              disabled={!isAvailable}
              loading={isDownloading}
              onClick={() => void download(document)}
              aria-label="Download document"
            >
              <Download size={16} /> Download
            </Button>
            <IconButton
              aria-label="Close document viewer"
              variant="ghost"
              size="sm"
              color="gray.500"
              onClick={onClose}
            >
              <X size={18} />
            </IconButton>
          </HStack>
        </HStack>

        {/* ---------- Body ---------- */}
        <Box
          flex="1"
          minH={0}
          bg={previewKind === "unsupported" ? "gray.50" : "gray.900"}
          display="flex"
          flexDirection="column"
        >
          {previewKind === "unsupported" ? (
            /* ---- Fallback: never a broken iframe, always a Download ---- */
            <Stack
              flex="1"
              align="center"
              justify="center"
              gap={3}
              px={6}
              py={8}
              textAlign="center"
            >
              <Box color="gray.400">
                <FileText size={44} strokeWidth={1.4} />
              </Box>
              <Text fontSize="sm" fontWeight={600} color="gray.700">
                Document preview is not available for this file type.
              </Text>
              <Text fontSize="sm" color="gray.500" title={document.fileName}>
                {document.fileName}
              </Text>
              <Text fontSize="xs" color="gray.400">
                {typeLabel} · {sizeLabel}
              </Text>
              <Button
                variant="primary"
                size="sm"
                mt={2}
                disabled={!isAvailable}
                loading={isDownloading}
                onClick={() => void download(document)}
                aria-label={`Download ${document.fileName}`}
              >
                <Download size={16} /> Download Document
              </Button>
            </Stack>
          ) : isLoadingUrl ? (
            <Stack flex="1" align="center" justify="center" gap={3}>
              <Spinner size="lg" color="white" />
              <Text fontSize="sm" color="gray.300">
                Loading document...
              </Text>
            </Stack>
          ) : urlError || (!signedUrl && canPreview) ? (
            <Stack
              flex="1"
              align="center"
              justify="center"
              gap={4}
              px={6}
              textAlign="center"
            >
              <Text fontSize="sm" color="gray.200">
                {urlError ?? "Unable to load this document."}
              </Text>
              <HStack gap={3}>
                <Button
                  variant="surface"
                  size="sm"
                  onClick={() => setAttempt((value) => value + 1)}
                >
                  <RotateCcw size={16} /> Try Again
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  loading={isDownloading}
                  onClick={() => void download(document)}
                  aria-label={`Download ${document.fileName}`}
                >
                  <Download size={16} /> Download
                </Button>
              </HStack>
            </Stack>
          ) : previewKind === "pdf" ? (
            <iframe
              src={signedUrl ?? undefined}
              title={`Preview of ${document.fileName}`}
              referrerPolicy="no-referrer"
              style={{ width: "100%", height: "100%", border: "0" }}
            />
          ) : (
            <Box
              flex="1"
              minH={0}
              overflow="auto"
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={4}
            >
              <Image
                src={signedUrl ?? undefined}
                alt={`Preview of ${document.fileName}`}
                maxW="100%"
                maxH="100%"
                objectFit="contain"
              />
            </Box>
          )}
        </Box>

        {/* ---------- Footer ---------- */}
        <HStack
          justify="space-between"
          px={5}
          py={2.5}
          borderTop="1px solid"
          borderColor="gray.200"
          bg="gray.50"
          flexShrink={0}
        >
          <Text fontSize="xs" color="gray.600">
            {typeLabel}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {sizeLabel}
          </Text>
        </HStack>
      </DialogContent>
    </DialogRoot>
  );
};
