import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

// Deep import: the `@/shared/components` barrel pulls the layout/Sidebar, which
// imports the constants barrel and would re-enter pageRoutes while this module
// is being evaluated.
import { Datatable } from "@/shared/components/datatable";
import {
  DocumentDownloadButton,
  DocumentStatusBadge,
  DocumentTypeIcon,
  DocumentViewer,
  DocumentVisibilityBadge,
} from "@/shared/components/documents";
import { TablePaginationProps } from "@/shared/types";
import {
  formatDocumentDate,
  formatFileSize,
  getDocumentRelatedTo,
  getFileTypeLabel,
} from "@/shared/utils/documents";

import {
  isClientDocumentDownloadable,
  requestClientDocumentDownloadUrl,
} from "../api/clientDocuments.api";
import { ClientDocument } from "../types/clientDocument.types";

// ============================================================
// Columns — built by a factory because the file name opens the shared
// viewer (columns need the caller's handler).
// Sorting is intentionally absent: the backend always returns newest-first
// and exposes no sort parameter.
// ============================================================

const buildClientDocumentColumns = (
  onRequestView: (document: ClientDocument) => void
): ColumnDef<ClientDocument>[] => [
  {
    accessorKey: "fileName",
    header: "File Name",
    // The file name is the primary view affordance: the Action column sits at
    // the far right of a wide table and can be scrolled out of sight.
    cell: ({ row }) => (
      <HStack gap={2} maxW="320px" minW={0}>
        <DocumentTypeIcon document={row.original} />
        <Text
          fontSize="sm"
          fontWeight={500}
          color="blue.600"
          cursor="pointer"
          truncate
          title={`View ${row.original.fileName}`}
          onClick={() => onRequestView(row.original)}
          _hover={{ textDecoration: "underline" }}
        >
          {row.original.fileName || "—"}
        </Text>
      </HStack>
    ),
    meta: { width: "300px" },
  },
  {
    id: "fileType",
    header: "Type",
    cell: ({ row }) => (
      <Text fontSize="sm" color="gray.600" whiteSpace="nowrap">
        {getFileTypeLabel(row.original)}
      </Text>
    ),
  },
  {
    id: "relatedTo",
    header: "Related To",
    cell: ({ row }) => {
      const related = getDocumentRelatedTo(row.original);

      if (related.length === 0) {
        return (
          <Text fontSize="sm" color="gray.400">
            —
          </Text>
        );
      }

      return (
        <Stack gap={0.5}>
          {related.map((item) => (
            <HStack key={`${item.label}-${item.value}`} gap={1.5}>
              <Text fontSize="xs" color="gray.500">
                {item.label}
              </Text>
              <Text fontSize="sm" color="gray.800" fontFamily="monospace">
                {item.value}
              </Text>
            </HStack>
          ))}
        </Stack>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <DocumentStatusBadge status={row.original.status} />,
  },
  {
    id: "visibility",
    header: "Visibility",
    cell: ({ row }) => (
      <DocumentVisibilityBadge visibility={row.original.visibility} />
    ),
  },
  {
    id: "size",
    header: "Size",
    cell: ({ row }) => (
      <Text fontSize="sm" color="gray.600" whiteSpace="nowrap">
        {formatFileSize(row.original.sizeBytes)}
      </Text>
    ),
  },
  {
    id: "uploaded",
    header: "Uploaded",
    cell: ({ row }) => (
      <Text fontSize="sm" color="gray.600" whiteSpace="nowrap">
        {formatDocumentDate(row.original.createdAt)}
      </Text>
    ),
  },
  {
    id: "action",
    header: "Action",
    // The client portal stays read-only: viewing and downloading are the only
    // actions, and the route guard already enforces DOCUMENT_MANAGEMENT:VIEW.
    // No upload, share or archive affordance exists anywhere in this module.
    cell: ({ row }) => (
      <HStack justify="flex-end">
        <DocumentDownloadButton
          document={row.original}
          requestDownloadUrl={requestClientDocumentDownloadUrl}
          canDownload={isClientDocumentDownloadable}
          unavailableMessage="This document is not available for download"
        />
      </HStack>
    ),
    meta: { textAlign: "right" },
  },
];

interface ClientDocumentsTableProps {
  documents: ClientDocument[];
  isLoading?: boolean;
  pagination: TablePaginationProps;
}

export const ClientDocumentsTable = ({
  documents,
  isLoading,
  pagination,
}: ClientDocumentsTableProps) => {
  const [documentToView, setDocumentToView] = useState<ClientDocument | null>(
    null
  );

  // `setDocumentToView` is stable, so the columns are built once.
  const columns = useMemo(
    () => buildClientDocumentColumns(setDocumentToView),
    []
  );

  return (
    <Box
      width="100%"
      minWidth={0}
      maxWidth="100%"
      overflowX="auto"
      flex="1"
      minHeight={0}
    >
      <Datatable<ClientDocument>
        isLoading={isLoading}
        columns={columns}
        data={documents}
        pagination={pagination}
      />

      {/* Same shared viewer as the firm library — the client endpoint supplies
          the signed URL, which is only requested while the viewer is open. */}
      <DocumentViewer
        document={documentToView}
        onClose={() => setDocumentToView(null)}
        requestDownloadUrl={requestClientDocumentDownloadUrl}
      />
    </Box>
  );
};
