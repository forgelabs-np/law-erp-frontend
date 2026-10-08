// ============================================================
// Folder vocabulary for the document library
//
// A document belongs to exactly one project or one matter, so those two kinds
// are the library's folder types. Label and tone live here (not in a component
// file) so every surface — folder card, section header, detail header — uses
// the same wording and colour.
// ============================================================

export type DocumentFolderKind = "project" | "matter";

export const FOLDER_KIND_LABEL: Record<DocumentFolderKind, string> = {
  project: "Project",
  matter: "Matter",
};

export const FOLDER_KIND_TONE: Record<
  DocumentFolderKind,
  { bg: string; color: string }
> = {
  project: { bg: "blue.50", color: "blue.700" },
  matter: { bg: "primary.50", color: "primary.700" },
};
