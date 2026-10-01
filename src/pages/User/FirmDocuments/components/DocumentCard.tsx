import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { CalendarDays, Eye } from "lucide-react";
import { useState } from "react";

import {
  DocumentStatusBadge,
  DocumentTypeIcon,
  DocumentVisibilityBadge,
} from "@/shared/components/documents";
import { DocumentRecord } from "@/shared/types/documents";
import {
  formatDocumentDate,
  formatFileSize,
  getFileTypeLabel,
} from "@/shared/utils/documents";

import { DocumentCardMenu } from "./DocumentCardMenu";

interface DocumentCardProps {
  document: DocumentRecord;
  /** DOCUMENT_MANAGEMENT:SHARE */
  canShare: boolean;
  /** DOCUMENT_MANAGEMENT:EDIT */
  canEdit: boolean;
  onRequestView: (document: DocumentRecord) => void;
  onRequestVisibilityChange: (document: DocumentRecord) => void;
  onRequestArchive: (document: DocumentRecord) => void;
}

/**
 * One document rendered as a card — the primary representation inside a
 * project/matter folder.
 *
 * Every value is resolved through the shared formatting utilities (file size,
 * type label, local-wall-clock date, human readable status/visibility), so the
 * card never shows a raw backend enum or a raw byte count.
 *
 * The file icon comes from the shared `DocumentTypeIcon`. No thumbnail is
 * requested here: a preview URL is a short-lived bearer credential and is only
 * ever minted when the user asks to view or download the document.
 */
export const DocumentCard = ({
  document,
  canShare,
  canEdit,
  onRequestView,
  onRequestVisibilityChange,
  onRequestArchive,
}: DocumentCardProps) => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  // "Active" is the normal state and adds only noise on every card; anything
  // else (still uploading, archived) is worth surfacing.
  const showStatusBadge = document.status !== "ACTIVE";

  return (
    <VStack
      align="stretch"
      gap={0}
      h="100%"
      bg="white"
      border="1px solid"
      borderColor={isHighlighted ? "primary.200" : "gray.200"}
      borderRadius="xl"
      boxShadow={
        isHighlighted
          ? "0 6px 16px rgba(16, 24, 40, 0.08)"
          : "0 1px 2px rgba(16, 24, 40, 0.04)"
      }
      overflow="hidden"
      transition="all 0.18s ease"
      onMouseEnter={() => setIsHighlighted(true)}
      onMouseLeave={() => setIsHighlighted(false)}
    >
      {/* Identity + lifecycle badges */}
      <VStack align="stretch" gap={3} p={5} flex="1">
        <HStack justify="space-between" align="flex-start" gap={3}>
          <Box
            w="10"
            h="10"
            borderRadius="lg"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.100"
            display="grid"
            placeItems="center"
            flexShrink={0}
          >
            <DocumentTypeIcon document={document} boxSize={5} />
          </Box>

          <VStack align="flex-end" gap={1} flexShrink={0}>
            {showStatusBadge && (
              <DocumentStatusBadge status={document.status} />
            )}
            <DocumentVisibilityBadge visibility={document.visibility} />
          </VStack>
        </HStack>

        <VStack align="stretch" gap={1} minW={0}>
          <Text
            fontSize="sm"
            fontWeight={600}
            color="gray.900"
            lineHeight="1.4"
            lineClamp={2}
            wordBreak="break-word"
            title={document.fileName}
          >
            {document.fileName || "—"}
          </Text>
          <Text fontSize="xs" color="gray.500" lineClamp={1}>
            {getFileTypeLabel(document)} · {formatFileSize(document.sizeBytes)}
          </Text>
        </VStack>
      </VStack>

      <Box borderTop="1px solid" borderColor="gray.100" />

      <HStack gap={1.5} px={5} py={3} color="gray.400">
        <CalendarDays size={12} style={{ flexShrink: 0 }} />
        <Text fontSize="xs" color="gray.500" fontWeight={500}>
          {formatDocumentDate(document.createdAt)}
        </Text>
      </HStack>

      {/* Actions: View is the primary affordance, everything else is in `⋮` */}
      <HStack
        justify="space-between"
        align="center"
        gap={2}
        px={5}
        py={3}
        bg="gray.50"
        borderTop="1px solid"
        borderColor="gray.100"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRequestView(document)}
          aria-label={`View ${document.fileName}`}
        >
          <Eye size={14} /> View
        </Button>

        <DocumentCardMenu
          document={document}
          canShare={canShare}
          canEdit={canEdit}
          onRequestView={onRequestView}
          onRequestVisibilityChange={onRequestVisibilityChange}
          onRequestArchive={onRequestArchive}
        />
      </HStack>
    </VStack>
  );
};
