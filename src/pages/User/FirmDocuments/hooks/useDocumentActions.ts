import { useCallback, useState } from "react";

import { DocumentVisibility } from "@/shared/types/documents";

import {
  useArchiveDocumentMutation,
  useUpdateDocumentVisibilityMutation,
} from "../api/firmDocuments.api";
import { FirmDocument } from "../types/firmDocument.types";

/**
 * The document action state machine (view / change visibility / archive)
 * shared by every firm surface that lists documents.
 *
 * Both the document library and `DocumentsWorkspace` render the same
 * `DocumentActionDialogs` from this one hook, so a card and a table row always
 * behave identically and the archive/visibility flows are implemented once.
 *
 * Nothing here performs any I/O on mount — the mutations only fire when the
 * user confirms a dialog, and the viewer only requests a signed URL once it is
 * actually open.
 */
export const useDocumentActions = () => {
  const [documentToView, setDocumentToView] = useState<FirmDocument | null>(
    null
  );
  const [documentToArchive, setDocumentToArchive] =
    useState<FirmDocument | null>(null);
  const [documentToShare, setDocumentToShare] = useState<FirmDocument | null>(
    null
  );

  const archiveMutation = useArchiveDocumentMutation();
  const visibilityMutation = useUpdateDocumentVisibilityMutation();

  const requestView = useCallback((document: FirmDocument) => {
    setDocumentToView(document);
  }, []);

  const requestVisibilityChange = useCallback((document: FirmDocument) => {
    setDocumentToShare(document);
  }, []);

  const requestArchive = useCallback((document: FirmDocument) => {
    setDocumentToArchive(document);
  }, []);

  const closeView = useCallback(() => setDocumentToView(null), []);
  const closeArchive = useCallback(() => setDocumentToArchive(null), []);
  const closeVisibility = useCallback(() => setDocumentToShare(null), []);

  /** Closed on settle either way — a failure surfaces as a toast. */
  const confirmArchive = useCallback(() => {
    if (!documentToArchive) return;

    archiveMutation.mutate(documentToArchive.id, {
      onSettled: () => setDocumentToArchive(null),
    });
  }, [archiveMutation, documentToArchive]);

  const confirmVisibilityChange = useCallback(() => {
    if (!documentToShare) return;

    const nextVisibility: DocumentVisibility =
      documentToShare.visibility === "SHARED" ? "PRIVATE" : "SHARED";

    visibilityMutation.mutate(
      { documentId: documentToShare.id, visibility: nextVisibility },
      { onSettled: () => setDocumentToShare(null) }
    );
  }, [visibilityMutation, documentToShare]);

  return {
    documentToView,
    documentToArchive,
    documentToShare,
    requestView,
    requestVisibilityChange,
    requestArchive,
    closeView,
    closeArchive,
    closeVisibility,
    confirmArchive,
    confirmVisibilityChange,
    isArchiving: archiveMutation.isPending,
    isChangingVisibility: visibilityMutation.isPending,
  };
};

export type DocumentActions = ReturnType<typeof useDocumentActions>;
