import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { ArrowRight, Folder } from "lucide-react";
import { useState } from "react";

import { formatDocumentUpdatedLabel } from "@/shared/utils/documents";

import { FOLDER_KIND_LABEL } from "../utils/folderKinds";
import { DocumentFolderKindBadge } from "./DocumentFolderKindBadge";
import type { DocumentFolderKind } from "../utils/folderKinds";

export interface DocumentFolderCardProps {
  kind: DocumentFolderKind;
  /** `projectCode` or `matterNumber` — the existing backend grouping key. */
  code: string;
  /**
   * Human readable name from the project/matter APIs. When it is unavailable
   * (or the caller may not read those modules) only the code is shown — a name
   * is never invented from the code.
   */
  name?: string;
  /** Documents loaded for this folder. */
  documentCount: number;
  /**
   * True when more documents exist server-side than the loaded window, so the
   * count is a lower bound and is rendered as `12+` rather than overstating it.
   */
  countIsPartial?: boolean;
  latestCreatedAt?: string | null;
  onOpen: () => void;
}

/**
 * One project or matter rendered as a folder in the document library.
 *
 * Rendered as a real `<button>` so it is keyboard reachable and announced
 * correctly, with the visual language of the reference design (clean white
 * cards, subtle borders, soft elevation, smooth hover effects).
 */
export const DocumentFolderCard = ({
  kind,
  code,
  name,
  documentCount,
  countIsPartial = false,
  latestCreatedAt,
  onOpen,
}: DocumentFolderCardProps) => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  const trimmedName = name?.trim();
  const title = trimmedName || code;
  const countLabel = `${documentCount}${countIsPartial ? "+" : ""} ${
    documentCount === 1 ? "document" : "documents"
  }`;

  const isProject = kind === "project";

  return (
    <Box
      asChild
      w="100%"
      h="100%"
      textAlign="left"
      bg="white"
      border="1px solid"
      borderColor={isHighlighted ? "blue.300" : "gray.200"}
      borderRadius="18px"
      boxShadow={
        isHighlighted
          ? "0 8px 24px -4px rgba(0, 86, 255, 0.08)"
          : "0 1px 3px 0 rgba(0, 0, 0, 0.04)"
      }
      transition="all 0.2s ease"
      transform={isHighlighted ? "translateY(-2px)" : "translateY(0)"}
      overflow="hidden"
      display="flex"
      flexDirection="column"
      cursor="pointer"
      _focusVisible={{
        outline: "2px solid",
        outlineColor: "blue.500",
        outlineOffset: "2px",
      }}
    >
      <button
        type="button"
        onClick={onOpen}
        onMouseEnter={() => setIsHighlighted(true)}
        onMouseLeave={() => setIsHighlighted(false)}
        onFocus={() => setIsHighlighted(true)}
        onBlur={() => setIsHighlighted(false)}
        aria-label={`Open ${FOLDER_KIND_LABEL[kind]} ${title}, ${countLabel}`}
      >
        <VStack align="stretch" gap={3.5} p={4.5}>
          <HStack justify="space-between" align="flex-start" gap={3}>
            <Box
              w="11"
              h="11"
              borderRadius="12px"
              bg={isProject ? "purple.50" : "blue.50"}
              color={isProject ? "purple.600" : "blue.600"}
              display="grid"
              placeItems="center"
              flexShrink={0}
              transition="transform 0.2s ease"
              transform={isHighlighted ? "scale(1.05)" : "scale(1)"}
            >
              <Folder size={20} />
            </Box>

            <DocumentFolderKindBadge kind={kind} />
          </HStack>

          <VStack align="stretch" gap={1} minW={0}>
            <Text
              fontSize="sm"
              fontWeight={600}
              color="gray.900"
              lineHeight="1.4"
              lineClamp={2}
              wordBreak="break-word"
            >
              {title}
            </Text>
            {trimmedName && (
              <Text
                fontSize="xs"
                color="gray.400"
                fontFamily="monospace"
                lineClamp={1}
              >
                {code}
              </Text>
            )}
          </VStack>
        </VStack>

        <HStack
          justify="space-between"
          align="center"
          gap={3}
          px={4.5}
          py={3}
          bg="gray.50/80"
          borderTop="1px solid"
          borderColor="gray.100"
          mt="auto"
        >
          <VStack align="stretch" gap={0} minW={0}>
            <Text fontSize="xs" fontWeight={600} color="gray.700">
              {countLabel}
            </Text>
            <Text fontSize="11px" color="gray.400" lineClamp={1}>
              Updated {formatDocumentUpdatedLabel(latestCreatedAt)}
            </Text>
          </VStack>

          <HStack
            gap={1}
            flexShrink={0}
            color={isHighlighted ? "blue.600" : "gray.400"}
            transition="color 0.18s ease"
          >
            <Text fontSize="xs" fontWeight={600}>
              Open
            </Text>
            <ArrowRight size={14} />
          </HStack>
        </HStack>
      </button>
    </Box>
  );
};
