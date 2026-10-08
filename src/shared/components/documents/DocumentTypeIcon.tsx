import { Icon } from "@chakra-ui/react";
import {
  File,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  Presentation,
  type LucideIcon,
} from "lucide-react";

import { DocumentRecord } from "@/shared/types/documents";

// ============================================================
// File icons — visual only, never affects download behaviour.
// Shared by the firm library and the client portal.
// ============================================================

interface FileTypeVisual {
  icon: LucideIcon;
  color: string;
}

const FILE_TYPE_VISUALS: Record<string, FileTypeVisual> = {
  pdf: { icon: FileText, color: "#DC2626" },
  doc: { icon: FileText, color: "#2563EB" },
  docx: { icon: FileText, color: "#2563EB" },
  rtf: { icon: FileText, color: "#2563EB" },
  txt: { icon: FileText, color: "#4B5563" },
  csv: { icon: FileSpreadsheet, color: "#059669" },
  xls: { icon: FileSpreadsheet, color: "#059669" },
  xlsx: { icon: FileSpreadsheet, color: "#059669" },
  ppt: { icon: Presentation, color: "#EA580C" },
  pptx: { icon: Presentation, color: "#EA580C" },
  jpg: { icon: FileImage, color: "#7C3AED" },
  jpeg: { icon: FileImage, color: "#7C3AED" },
  png: { icon: FileImage, color: "#7C3AED" },
  gif: { icon: FileImage, color: "#7C3AED" },
  webp: { icon: FileImage, color: "#7C3AED" },
  zip: { icon: FileArchive, color: "#B45309" },
  rar: { icon: FileArchive, color: "#B45309" },
  "7z": { icon: FileArchive, color: "#B45309" },
};

const DEFAULT_VISUAL: FileTypeVisual = { icon: File, color: "#64748B" };

const resolveVisual = (
  document: Pick<DocumentRecord, "extension" | "contentType">
): FileTypeVisual => {
  const extension = document.extension?.replace(/^\./, "").trim().toLowerCase();

  if (extension && FILE_TYPE_VISUALS[extension]) {
    return FILE_TYPE_VISUALS[extension];
  }

  // Fall back to the content-type family (e.g. `image/*`, `application/zip`).
  const contentType = document.contentType?.toLowerCase() ?? "";

  if (contentType.startsWith("image/")) return FILE_TYPE_VISUALS.png;
  if (contentType.startsWith("text/")) return FILE_TYPE_VISUALS.txt;
  if (contentType.includes("pdf")) return FILE_TYPE_VISUALS.pdf;
  if (contentType.includes("spreadsheet") || contentType.includes("excel")) {
    return FILE_TYPE_VISUALS.xlsx;
  }
  if (
    contentType.includes("presentation") ||
    contentType.includes("powerpoint")
  ) {
    return FILE_TYPE_VISUALS.pptx;
  }
  if (contentType.includes("wordprocessing") || contentType.includes("word")) {
    return FILE_TYPE_VISUALS.docx;
  }
  if (contentType.includes("zip") || contentType.includes("compressed")) {
    return FILE_TYPE_VISUALS.zip;
  }

  return DEFAULT_VISUAL;
};

export const DocumentTypeIcon = ({
  document,
  /** Chakra size token or pixel number; defaults to the table-row size. */
  boxSize = 4,
}: {
  document: Pick<DocumentRecord, "extension" | "contentType">;
  boxSize?: number | string;
}) => {
  const { icon, color } = resolveVisual(document);

  return <Icon as={icon} boxSize={boxSize} color={color} flexShrink={0} />;
};
