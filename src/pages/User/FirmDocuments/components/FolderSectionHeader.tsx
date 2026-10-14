import { Button, HStack, Stack, Text } from "@chakra-ui/react";
import { ArrowRight, Folder } from "lucide-react";

import {
  DocumentFolderKind,
  DocumentFolderKindBadge,
} from "./DocumentFolderKindBadge";

interface FolderSectionHeaderProps {
  kind: DocumentFolderKind;
  code: string;
  /** Project/matter name when it could be resolved. */
  name?: string;
  documentCount: number;
  /**
   * True when the count only covers the documents loaded so far, so it is
   * rendered as `12+` instead of overstating the folder's real total.
   */
  countIsPartial?: boolean;
  /** Opens the folder itself (used by the search results grouping). */
  onOpen?: () => void;
}

/**
 * Heading for a group of document cards (search results grouped by their
 * project/matter, and the per-folder sections of the library).
 *
 * Counts are always derived from the documents actually in hand and marked
 * with `+` while more may exist server-side — the library never claims a
 * precise folder total it cannot know.
 */
export const FolderSectionHeader = ({
  kind,
  code,
  name,
  documentCount,
  countIsPartial = false,
  onOpen,
}: FolderSectionHeaderProps) => {
  const trimmedName = name?.trim();
  const title = trimmedName || code;
  const countLabel = `${documentCount}${countIsPartial ? "+" : ""} ${
    documentCount === 1 ? "document" : "documents"
  }`;

  return (
    <HStack justify="space-between" align="center" gap={3} flexWrap="wrap">
      <HStack gap={2.5} minW={0}>
        <Stack
          w="8"
          h="8"
          borderRadius="lg"
          bg="primary.50"
          color="primary.600"
          display="grid"
          placeItems="center"
          flexShrink={0}
        >
          <Folder size={16} />
        </Stack>

        <Stack gap={0} minW={0}>
          <Text
            fontSize="sm"
            fontWeight={600}
            color="gray.900"
            lineClamp={1}
            title={title}
          >
            {title}
          </Text>
          {trimmedName && (
            <Text fontSize="xs" color="gray.500" fontFamily="monospace">
              {code}
            </Text>
          )}
        </Stack>

        <DocumentFolderKindBadge kind={kind} />
      </HStack>

      <HStack gap={3} flexShrink={0}>
        <Text
          fontSize="sm"
          color="gray.500"
          fontWeight={600}
          whiteSpace="nowrap"
        >
          {countLabel}
        </Text>
        {onOpen && (
          <Button
            variant="ghost"
            size="sm"
            color="primary.600"
            onClick={onOpen}
            aria-label={`Open ${title}`}
          >
            Open <ArrowRight size={14} />
          </Button>
        )}
      </HStack>
    </HStack>
  );
};
