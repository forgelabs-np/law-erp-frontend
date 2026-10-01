import { isAxiosError } from "axios";
import {
  format,
  formatDistanceToNowStrict,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";

import {
  DocumentRecord,
  DocumentStatus,
  DocumentVisibility,
} from "@/shared/types/documents";

// ============================================================
// Display formatting — shared by the firm library, the Matter/Project
// document tabs and the client portal documents page.
// ============================================================

const SIZE_UNITS = ["B", "KB", "MB", "GB", "TB"] as const;

/**
 * Human readable file size: `1024` → `1 KB`, `1048576` → `1 MB`.
 * Returns an em dash for missing values so tables never render `NaN`.
 */
export const formatFileSize = (bytes: number | null | undefined): string => {
  if (bytes === null || bytes === undefined || !Number.isFinite(bytes)) {
    return "—";
  }

  if (bytes <= 0) return "0 B";

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    SIZE_UNITS.length - 1
  );
  const value = bytes / 1024 ** exponent;

  // Whole numbers stay compact (1 KB), fractions get one decimal (1.5 MB).
  const rounded = exponent === 0 ? value : Math.round(value * 10) / 10;

  return `${rounded} ${SIZE_UNITS[exponent]}`;
};

/**
 * Short, human friendly type label. Prefers the backend `extension` and
 * falls back to the `contentType` subtype so `application/pdf` → `PDF`.
 */
export const getFileTypeLabel = (
  document: Pick<DocumentRecord, "extension" | "contentType">
): string => {
  const extension = document.extension?.replace(/^\./, "").trim();

  if (extension) return extension.toUpperCase();

  const subtype = document.contentType?.split("/")[1]?.split("+")[0]?.trim();

  return subtype ? subtype.toUpperCase() : "FILE";
};

/**
 * Formats a document timestamp. `createdAt` is a LocalDateTime with no
 * timezone offset, so it is parsed as local wall-clock time — appending `Z`
 * would shift the day.
 */
export const formatDocumentDate = (
  value: string | null | undefined
): string => {
  if (!value) return "—";

  try {
    return format(parseISO(value), "dd MMM yyyy");
  } catch {
    return value;
  }
};

/**
 * Relative "updated" label for a library folder (`2 hours ago`, `Yesterday`,
 * `29 Sep 2026`). Like `formatDocumentDate`, the TZ-less LocalDateTime is
 * parsed as local wall-clock time.
 */
export const formatDocumentUpdatedLabel = (
  value: string | null | undefined
): string => {
  if (!value) return "—";

  try {
    const date = parseISO(value);

    if (Number.isNaN(date.getTime())) return formatDocumentDate(value);

    if (isToday(date)) {
      const distance = formatDistanceToNowStrict(date, { addSuffix: false });
      return distance === "0 seconds" ? "Just now" : `${distance} ago`;
    }

    if (isYesterday(date)) return "Yesterday";

    return format(date, "dd MMM yyyy");
  } catch {
    return formatDocumentDate(value);
  }
};

// ============================================================
// Folder grouping (document library)
//
// The backend model already carries the grouping key: a document belongs to
// exactly one project OR one matter (`projectCode` / `matterNumber`). Nothing
// is invented here — the loaded page is simply reshaped into folders so the
// library can be browsed project-first / matter-first.
// ============================================================

export type DocumentFolderKind = "project" | "matter";

export interface DocumentFolderGroup {
  kind: DocumentFolderKind;
  /** `projectCode` or `matterNumber` — the existing grouping key. */
  code: string;
  /** The loaded documents of this folder, in server order (newest first). */
  documents: DocumentRecord[];
  /** Newest `createdAt` among the loaded documents. */
  latestCreatedAt: string | null;
}

export interface GroupedDocuments {
  projects: DocumentFolderGroup[];
  matters: DocumentFolderGroup[];
  /**
   * Documents carrying neither reference. The upload contract guarantees one
   * of the two is always set, so this is normally empty — it exists so a
   * malformed row can never disappear from the library.
   */
  unfiled: DocumentRecord[];
}

/** Newest-first ordering key; falls back to 0 for unparseable timestamps. */
const toTime = (value: string | null | undefined): number => {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};

/**
 * Reshapes a page of documents into project / matter folders.
 *
 * A document is placed in the project folder when it has a `projectCode`,
 * otherwise the matter folder — never both, so no document can be duplicated
 * across folders. Folders are ordered by most recently updated.
 *
 * Counts are only ever derived from the documents passed in, which is why the
 * caller must treat them as a window (see the library view).
 */
export const groupDocumentsByFolder = (
  documents: DocumentRecord[]
): GroupedDocuments => {
  const projects = new Map<string, DocumentFolderGroup>();
  const matters = new Map<string, DocumentFolderGroup>();
  const unfiled: DocumentRecord[] = [];

  documents.forEach((document) => {
    const projectCode = document.projectCode?.trim();
    const matterNumber = document.matterNumber?.trim();

    if (!projectCode && !matterNumber) {
      unfiled.push(document);
      return;
    }

    const isProject = Boolean(projectCode);
    const code = (isProject ? projectCode : matterNumber) as string;
    const bucket = isProject ? projects : matters;

    const existing = bucket.get(code);
    const group: DocumentFolderGroup = existing ?? {
      kind: isProject ? "project" : "matter",
      code,
      documents: [],
      latestCreatedAt: null,
    };

    group.documents.push(document);

    if (toTime(document.createdAt) > toTime(group.latestCreatedAt)) {
      group.latestCreatedAt = document.createdAt;
    }

    if (!existing) bucket.set(code, group);
  });

  const byMostRecent = (a: DocumentFolderGroup, b: DocumentFolderGroup) =>
    toTime(b.latestCreatedAt) - toTime(a.latestCreatedAt) ||
    a.code.localeCompare(b.code);

  return {
    projects: [...projects.values()].sort(byMostRecent),
    matters: [...matters.values()].sort(byMostRecent),
    unfiled,
  };
};

export interface DocumentRelatedTo {
  label: "Matter" | "Project";
  value: string;
}

/**
 * A document belongs to either a matter or a project (rarely both), so
 * collect whichever references are present instead of assuming one.
 */
export const getDocumentRelatedTo = (
  document: Pick<DocumentRecord, "matterNumber" | "projectCode">
): DocumentRelatedTo[] => {
  const related: DocumentRelatedTo[] = [];

  if (document.matterNumber) {
    related.push({ label: "Matter", value: document.matterNumber });
  }

  if (document.projectCode) {
    related.push({ label: "Project", value: document.projectCode });
  }

  return related;
};

/**
 * A document can only be downloaded once its object is confirmed in
 * storage (`PENDING_UPLOAD` rows have no uploaded bytes yet).
 */
export const isDocumentDownloadable = (
  document: Pick<DocumentRecord, "status">
): boolean => document.status !== "PENDING_UPLOAD";

export const documentStatusLabel: Record<DocumentStatus, string> = {
  PENDING_UPLOAD: "Pending Upload",
  ACTIVE: "Active",
  ARCHIVED: "Archived",
};

export const documentVisibilityLabel: Record<DocumentVisibility, string> = {
  PRIVATE: "Private",
  SHARED: "Shared",
};

// ============================================================
// Error normalisation
// ============================================================

/**
 * Extracts the backend `message` from a failed request so the UI surfaces
 * the server's own explanation ("Storage quota exceeded", "Document not
 * found: 41") instead of a generic status-code message.
 */
export const getBackendErrorMessage = (error: unknown): string | undefined => {
  if (!isAxiosError(error)) return undefined;

  const data = error.response?.data as { message?: string } | undefined;

  return data?.message?.trim() || undefined;
};

// ============================================================
// Client-side file validation
//
// The backend re-validates the real size and file signature on confirm, so
// this is only fast feedback before an upload ticket is requested.
// ============================================================

/** 50 MiB — binary, never decimal MB. */
export const MAX_DOCUMENT_SIZE_BYTES = 50 * 1024 * 1024;

export const MAX_DOCUMENT_FILENAME_LENGTH = 255;

/** Extension → the MIME types browsers realistically report for it. */
const DOCUMENT_MIME_TYPES: Record<string, string[]> = {
  pdf: ["application/pdf"],
  doc: ["application/msword"],
  docx: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  xls: ["application/vnd.ms-excel"],
  xlsx: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ppt: ["application/vnd.ms-powerpoint"],
  pptx: [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
  txt: ["text/plain"],
  csv: ["text/csv", "application/csv", "application/vnd.ms-excel"],
  rtf: ["application/rtf", "text/rtf", "application/x-rtf"],
  jpg: ["image/jpeg", "image/jpg"],
  jpeg: ["image/jpeg", "image/jpg"],
  png: ["image/png"],
  gif: ["image/gif"],
  webp: ["image/webp"],
  zip: [
    "application/zip",
    "application/x-zip-compressed",
    "application/x-compressed",
    "multipart/x-zip",
  ],
};

export const SUPPORTED_DOCUMENT_EXTENSIONS = Object.keys(DOCUMENT_MIME_TYPES);

/** Generated from the supported extensions for the file input `accept`. */
export const DOCUMENT_ACCEPT_ATTRIBUTE = SUPPORTED_DOCUMENT_EXTENSIONS.map(
  (extension) => `.${extension}`
).join(",");

export const getDocumentExtension = (fileName: string): string =>
  fileName.split(".").pop()?.toLowerCase().trim() ?? "";

export const getDocumentContentType = (fileName: string): string => {
  const extension = getDocumentExtension(fileName);
  return DOCUMENT_MIME_TYPES[extension]?.[0] ?? "application/octet-stream";
};

export interface DocumentFileValidationResult {
  valid: boolean;
  error?: string;
}

// ============================================================
// Preview support
//
// Only formats browsers render natively are previewable; everything else
// (docx, xlsx, zip, ...) gets a professional fallback with a Download action
// instead of a broken iframe.
// ============================================================

export type DocumentPreviewKind = "pdf" | "image" | "unsupported";

const PREVIEWABLE_IMAGE_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "svg",
]);

const PREVIEWABLE_IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

/**
 * Decides how (or whether) a document can be previewed inside the app.
 * Deliberately conservative: anything not explicitly listed falls back to
 * download rather than risking a blank/broken embedded viewer.
 */
export const getDocumentPreviewKind = (
  document: Pick<DocumentRecord, "extension" | "contentType">
): DocumentPreviewKind => {
  const extension = getDocumentExtension(document.extension ?? "");
  const contentType = (document.contentType ?? "")
    .toLowerCase()
    .split(";")[0]
    .trim();

  if (extension === "pdf" || contentType === "application/pdf") {
    return "pdf";
  }

  if (
    PREVIEWABLE_IMAGE_EXTENSIONS.has(extension) ||
    PREVIEWABLE_IMAGE_MIME_TYPES.includes(contentType)
  ) {
    return "image";
  }

  return "unsupported";
};

export const validateDocumentFile = (
  file: File | null | undefined
): DocumentFileValidationResult => {
  if (!file) {
    return { valid: false, error: "Choose a file to upload." };
  }

  const fileName = file.name?.trim();

  if (!fileName) {
    return { valid: false, error: "The selected file has no name." };
  }

  if (fileName.length > MAX_DOCUMENT_FILENAME_LENGTH) {
    return {
      valid: false,
      error: `File names must be ${MAX_DOCUMENT_FILENAME_LENGTH} characters or fewer.`,
    };
  }

  const extension = getDocumentExtension(fileName);

  if (!extension || !DOCUMENT_MIME_TYPES[extension]) {
    return {
      valid: false,
      error: `Unsupported file type. Allowed: ${SUPPORTED_DOCUMENT_EXTENSIONS.join(", ")}.`,
    };
  }

  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return {
      valid: false,
      error: `"${fileName}" is ${formatFileSize(file.size)}. The maximum size is 50 MiB.`,
    };
  }

  // Only reject when the browser reports a known, conflicting type —
  // octet-stream/empty is treated as unknown and left to the backend.
  const reportedType = file.type?.toLowerCase().trim();
  const accepted = DOCUMENT_MIME_TYPES[extension];
  const isUnknownType =
    !reportedType || reportedType === "application/octet-stream";

  if (!isUnknownType && !accepted.includes(reportedType)) {
    return {
      valid: false,
      error: `"${fileName}" does not look like a ${extension.toUpperCase()} file.`,
    };
  }

  return { valid: true };
};
