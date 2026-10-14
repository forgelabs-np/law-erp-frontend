import { Button, HStack, Stack, Text } from "@chakra-ui/react";
import { ArrowLeft, Folder } from "lucide-react";
import { ReactNode } from "react";

import {
  DocumentFolderKindBadge,
  DocumentFolderKind,
} from "./DocumentFolderKindBadge";

interface FolderDetailHeaderProps {
  kind: DocumentFolderKind;
  /** `projectCode` or `matterNumber`. */
  code: string;
  /** Project/ matter name from the existing APIs, when readable. */
  name?: string;
  /** Authoritative total for this folder (the scoped endpoint's totalElements). */
  documentCount: number;
  isLoading?: boolean;
  /** Returns to the document library. */
  onBack: () => void;
  /** Scope-specific action (the Upload Document button). */
  action?: ReactNode;
}

/**
 * Header for a library folder (a project or a matter).
 *
 * The count comes from the scoped document endpoint's `totalElements`, so it is
 * the folder's real total rather than a count derived from one page. The
 * breadcrumb is the existing `← Documents` back affordance used by the other
 * detail pages in the application.
 */
export const FolderDetailHeader = ({
  kind,
  code,
  name,
  documentCount,
  isLoading,
  onBack,
  action,
}: FolderDetailHeaderProps) => {
  const trimmedName = name?.trim();
  const title = trimmedName || code;

  const countLabel = isLoading
    ? "Loading documents..."
    : `${documentCount} ${documentCount === 1 ? "document" : "documents"}`;

  return (
    <Stack gap={4} minW={0}>
      {/* Breadcrumb: Documents / <folder> */}
      <HStack gap={2} align="center" flexWrap="wrap">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} /> Documents
        </Button>
        <Text fontSize="sm" color="gray.300" aria-hidden="true">
          /
        </Text>
        <Text
          fontSize="sm"
          fontWeight={600}
          color="gray.600"
          lineClamp={1}
          title={title}
        >
          {title}
        </Text>
      </HStack>

      <HStack
        justify="space-between"
        align="flex-start"
        gap={4}
        flexWrap="wrap"
      >
        <HStack gap={4} minW={0} align="flex-start">
          <Stack
            w="14"
            h="14"
            borderRadius="xl"
            bg="primary.50"
            color="primary.600"
            display="grid"
            placeItems="center"
            flexShrink={0}
          >
            <Folder size={26} />
          </Stack>

          <Stack gap={1} minW={0}>
            <HStack gap={2.5} align="center" minW={0} flexWrap="wrap">
              <Text
                textStyle="heading_4"
                color="gray.900"
                lineClamp={1}
                title={title}
              >
                {title}
              </Text>
              <DocumentFolderKindBadge kind={kind} />
            </HStack>

            {trimmedName && (
              <Text fontSize="sm" color="gray.500" fontFamily="monospace">
                {code}
              </Text>
            )}

            <Text fontSize="sm" color="gray.500">
              {countLabel}
            </Text>
          </Stack>
        </HStack>

        {action}
      </HStack>
    </Stack>
  );
};
