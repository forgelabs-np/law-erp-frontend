import { Box, Input, Text } from "@chakra-ui/react";
import { CloudUpload } from "lucide-react";
import { ChangeEvent, DragEvent, KeyboardEvent, useRef, useState } from "react";

import {
  DOCUMENT_ACCEPT_ATTRIBUTE,
  SUPPORTED_DOCUMENT_EXTENSIONS,
} from "@/shared/utils/documents";

interface FileDropZoneProps {
  disabled?: boolean;
  /** Receives the raw dropped/picked file; the dialog runs validation. */
  onFileSelected: (file: File) => void;
}

/**
 * Drag-and-drop file picker used by the single DocumentUploadDialog.
 *
 * Click / Enter / Space opens the native file picker (the `<input type=file>`
 * itself is visually hidden but labelled), and a dragged file is highlighted
 * with the brand color before being handed to the caller for validation.
 * No upload logic lives here — this is purely file selection.
 */
export const FileDropZone = ({
  disabled,
  onFileSelected,
}: FileDropZoneProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) onFileSelected(selected);
    // Allow re-selecting the same file later.
    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) setIsDragActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    if (disabled) return;

    const dropped = event.dataTransfer.files?.[0];
    if (dropped) onFileSelected(dropped);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  };

  return (
    <Box
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload your files. Drag and drop a file here, or press Enter to browse"
      aria-disabled={disabled}
      onClick={openPicker}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      border="2px dashed"
      borderColor={isDragActive ? "primary.500" : "gray.300"}
      bg={isDragActive ? "primary.50" : "gray.50"}
      borderRadius="xl"
      px={6}
      py={8}
      textAlign="center"
      cursor={disabled ? "not-allowed" : "pointer"}
      opacity={disabled ? 0.6 : 1}
      transition="border-color 150ms ease, background-color 150ms ease, transform 150ms ease"
      transform={isDragActive ? "scale(1.01)" : "scale(1)"}
      _hover={
        disabled || isDragActive
          ? undefined
          : { borderColor: "gray.400", bg: "gray.100" }
      }
      _focusVisible={{
        outline: "2px solid",
        outlineColor: "primary.500",
        outlineOffset: "2px",
      }}
    >
      <Input
        ref={inputRef}
        type="file"
        accept={DOCUMENT_ACCEPT_ATTRIBUTE}
        onChange={handleChange}
        disabled={disabled}
        aria-label="Choose file to upload"
        display="none"
        tabIndex={-1}
      />

      <Box
        color={isDragActive ? "primary.500" : "gray.500"}
        display="inline-flex"
        transition="color 150ms ease, transform 150ms ease"
        transform={isDragActive ? "scale(1.12)" : "scale(1)"}
      >
        <CloudUpload size={36} strokeWidth={1.5} />
      </Box>

      <Text fontSize="sm" fontWeight={600} color="gray.700" mt={3}>
        Upload your files
      </Text>
      <Text fontSize="sm" color="gray.500" mt={1}>
        Drag &amp; drop files here, or{" "}
        <Text as="span" color="primary.500" fontWeight={600}>
          browse
        </Text>
      </Text>
      <Text fontSize="xs" color="gray.400" mt={2}>
        {SUPPORTED_DOCUMENT_EXTENSIONS.join(", ").toUpperCase()} · max 50 MiB
      </Text>
    </Box>
  );
};
