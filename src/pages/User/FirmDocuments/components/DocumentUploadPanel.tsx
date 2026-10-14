import { Box, Button, Stack, Text, VStack } from "@chakra-ui/react";
import { CloudUpload } from "lucide-react";
import { ChangeEvent, DragEvent, useRef, useState } from "react";

import { DOCUMENT_ACCEPT_ATTRIBUTE } from "@/shared/utils/documents";

interface DocumentUploadPanelProps {
  canUpload: boolean;
  onOpenUploadDialog: (file?: File) => void;
  disabled?: boolean;
}

/**
 * Modern upload panel in the Documents page left sidebar.
 *
 * Provides a prominent, clean drag-and-drop zone and a "Browse Files" button.
 * When a file is dropped or selected, it triggers the upload flow with the
 * pre-selected file.
 */
export const DocumentUploadPanel = ({
  canUpload,
  onOpenUploadDialog,
  disabled = false,
}: DocumentUploadPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const isDisabled = disabled || !canUpload;

  const handleBrowseClick = () => {
    if (isDisabled) return;
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) {
      onOpenUploadDialog(selected);
    }
    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDisabled) setIsDragActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    if (isDisabled) return;

    const dropped = event.dataTransfer.files?.[0];
    if (dropped) {
      onOpenUploadDialog(dropped);
    }
  };

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="20px"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.04)"
      p={5}
      w="100%"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={DOCUMENT_ACCEPT_ATTRIBUTE}
        style={{ display: "none" }}
        onChange={handleFileInputChange}
        tabIndex={-1}
        aria-hidden="true"
      />

      <Box
        border="2px dashed"
        borderColor={
          isDragActive ? "blue.500" : isDisabled ? "gray.200" : "blue.200"
        }
        bg={isDragActive ? "blue.50" : "gray.50"}
        borderRadius="16px"
        p={{ base: 5, sm: 6 }}
        textAlign="center"
        cursor={isDisabled ? "not-allowed" : "pointer"}
        transition="all 0.2s ease"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        _hover={
          isDisabled
            ? undefined
            : {
                borderColor: "blue.400",
                bg: "blue.50/40",
              }
        }
      >
        <VStack gap={3}>
          <Box
            w="14"
            h="14"
            borderRadius="full"
            bg="blue.50"
            color="blue.600"
            display="grid"
            placeItems="center"
            boxShadow="0 2px 8px rgba(0, 86, 255, 0.08)"
            transition="transform 0.2s ease"
            transform={isDragActive ? "scale(1.08)" : "scale(1)"}
          >
            <CloudUpload size={26} />
          </Box>

          <Stack gap={1} align="center">
            <Text fontSize="md" fontWeight="600" color="gray.800">
              Upload Documents
            </Text>
            <Text
              fontSize="xs"
              color="gray.500"
              maxW="240px"
              lineHeight="short"
            >
              Drag and drop your files here, or browse from device
            </Text>
          </Stack>

          <Button
            variant="primary"
            size="sm"
            h="36px"
            px={5}
            borderRadius="10px"
            disabled={isDisabled}
            onClick={(e) => {
              e.stopPropagation();
              handleBrowseClick();
            }}
          >
            Browse Files
          </Button>

          <Text fontSize="11px" color="gray.400">
            PDF, DOCX, XLSX, Images up to 25MB
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};
