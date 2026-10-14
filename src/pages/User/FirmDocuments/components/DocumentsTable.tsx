import { Box, HStack, Text } from "@chakra-ui/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

import { Datatable } from "@/shared/components/datatable";
import {
  DocumentStatusBadge,
  DocumentTypeIcon,
  DocumentVisibilityBadge,
} from "@/shared/components/documents";
import { TablePaginationProps } from "@/shared/types";
import {
  formatDocumentDate,
  formatFileSize,
  getFileTypeLabel,
} from "@/shared/utils/documents";
import { FirmDocument } from "../types/firmDocument.types";
import { DocumentRowActions } from "./DocumentRowActions";

interface DocumentsTableProps {
  documents: FirmDocument[];
  isLoading?: boolean;
  pagination: TablePaginationProps;
  canShare: boolean;
  canEdit: boolean;
  onRequestView: (document: FirmDocument) => void;
  onRequestVisibilityChange: (document: FirmDocument) => void;
  onRequestArchive: (document: FirmDocument) => void;
}

/**
 * The list representation of a folder's documents, kept alongside the card
 * grid (the grid/list switch) for users who prefer a dense table.
 *
 * Sorting is intentionally absent: the backend returns newest-first and
 * exposes no sort parameter.
 */
export const DocumentsTable = ({
  documents,
  isLoading,
  pagination,
  canShare,
  canEdit,
  onRequestView,
  onRequestVisibilityChange,
  onRequestArchive,
}: DocumentsTableProps) => {
  const columns = useMemo<ColumnDef<FirmDocument>[]>(() => {
    const baseColumns: ColumnDef<FirmDocument>[] = [
      {
        accessorKey: "fileName",
        header: "File",
        // The file name itself opens the viewer. This is the primary view
        // affordance: the Actions column sits at the far right of a wide
        // table, so on the Matter/Project tabs it can be scrolled out of
        // sight. The name is always visible.
        cell: ({ row }) => (
          <HStack gap={2} maxW="300px" minW={0}>
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
        meta: { width: "280px" },
      },
    ];

    baseColumns.push(
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
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <DocumentRowActions
            document={row.original}
            canShare={canShare}
            canEdit={canEdit}
            onRequestView={onRequestView}
            onRequestVisibilityChange={onRequestVisibilityChange}
            onRequestArchive={onRequestArchive}
          />
        ),
        meta: { textAlign: "right" },
      }
    );

    return baseColumns;
  }, [
    canShare,
    canEdit,
    onRequestView,
    onRequestVisibilityChange,
    onRequestArchive,
  ]);

  return (
    <Box
      width="100%"
      minWidth={0}
      maxWidth="100%"
      overflowX="auto"
      flex="1"
      minHeight={0}
    >
      <Datatable<FirmDocument>
        isLoading={isLoading}
        columns={columns}
        data={documents}
        pagination={pagination}
      />
    </Box>
  );
};
