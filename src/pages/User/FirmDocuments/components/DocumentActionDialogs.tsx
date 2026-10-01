import { DocumentViewer } from "@/shared/components/documents";

import { requestFirmDocumentDownloadUrl } from "../api/firmDocuments.api";
import { DocumentActions } from "../hooks/useDocumentActions";
import { ArchiveDocumentDialog } from "./ArchiveDocumentDialog";
import { DocumentVisibilityDialog } from "./DocumentVisibilityDialog";

/**
 * The three document dialogs (archive confirmation, visibility confirmation and
 * the shared preview) rendered once per surface from `useDocumentActions()`.
 *
 * Keeping them together means the document library and the folder detail views
 * cannot drift: any surface that lists documents renders exactly this layer.
 */
export const DocumentActionDialogs = ({
  actions,
}: {
  actions: DocumentActions;
}) => {
  const {
    documentToView,
    documentToArchive,
    documentToShare,
    closeView,
    closeArchive,
    closeVisibility,
    confirmArchive,
    confirmVisibilityChange,
    isArchiving,
    isChangingVisibility,
  } = actions;

  return (
    <>
      <ArchiveDocumentDialog
        document={documentToArchive}
        open={Boolean(documentToArchive)}
        onClose={closeArchive}
        onConfirm={confirmArchive}
        isPending={isArchiving}
      />

      <DocumentVisibilityDialog
        fileName={documentToShare?.fileName}
        nextVisibility={
          documentToShare
            ? documentToShare.visibility === "SHARED"
              ? "PRIVATE"
              : "SHARED"
            : null
        }
        open={Boolean(documentToShare)}
        onClose={closeVisibility}
        onConfirm={confirmVisibilityChange}
        isPending={isChangingVisibility}
      />

      {/* The signed URL is requested lazily by the viewer, only while open. */}
      <DocumentViewer
        document={documentToView}
        onClose={closeView}
        requestDownloadUrl={requestFirmDocumentDownloadUrl}
      />
    </>
  );
};
