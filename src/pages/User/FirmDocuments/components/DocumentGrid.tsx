import { SimpleGrid } from "@chakra-ui/react";

import { DocumentRecord } from "@/shared/types/documents";

import { DocumentCard } from "./DocumentCard";
import { DocumentCardSkeleton } from "./DocumentCardSkeleton";

/** Documents rendered while loading (also keeps the grid height stable). */
const SKELETON_COUNT = 6;
/** Same responsive rhythm as the folder grid: 1 → 2 → 3 → 4 per row. */
const DOCUMENT_GRID_COLUMNS = {
  base: 1,
  md: 2,
  xl: 3,
  "2xl": 4,
} as const;

interface DocumentGridProps {
  documents: DocumentRecord[];
  /** Shows card skeletons instead of the documents. */
  isLoading?: boolean;
  /** DOCUMENT_MANAGEMENT:SHARE */
  canShare: boolean;
  /** DOCUMENT_MANAGEMENT:EDIT */
  canEdit: boolean;
  onRequestView: (document: DocumentRecord) => void;
  onRequestVisibilityChange: (document: DocumentRecord) => void;
  onRequestArchive: (document: DocumentRecord) => void;
}

/**
 * Responsive grid of `DocumentCard`s, shared by the library search results,
 * the folder detail views and the Matter/Project document tabs.
 *
 * Loading is rendered as skeleton cards rather than an empty grid so the page
 * never jumps once the data arrives.
 */
export const DocumentGrid = ({
  documents,
  isLoading,
  canShare,
  canEdit,
  onRequestView,
  onRequestVisibilityChange,
  onRequestArchive,
}: DocumentGridProps) => {
  if (isLoading) {
    return (
      <SimpleGrid columns={DOCUMENT_GRID_COLUMNS} gap={5}>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <DocumentCardSkeleton key={index} />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid columns={DOCUMENT_GRID_COLUMNS} gap={5}>
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          canShare={canShare}
          canEdit={canEdit}
          onRequestView={onRequestView}
          onRequestVisibilityChange={onRequestVisibilityChange}
          onRequestArchive={onRequestArchive}
        />
      ))}
    </SimpleGrid>
  );
};
