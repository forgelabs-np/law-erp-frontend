import { Box } from "@chakra-ui/react";

import { DocumentFolderKind, FOLDER_KIND_TONE } from "../utils/folderKinds";

export type { DocumentFolderKind } from "../utils/folderKinds";

/**
 * The Project / Matter chip used wherever a folder is presented (library
 * folder card, folder section headers and the folder detail header) so the
 * vocabulary and colour stay identical across the module.
 */
export const DocumentFolderKindBadge = ({
  kind,
}: {
  kind: DocumentFolderKind;
}) => (
  <Box
    as="span"
    px={2}
    py={0.5}
    borderRadius="full"
    fontSize="xs"
    fontWeight={600}
    whiteSpace="nowrap"
    flexShrink={0}
    bg={FOLDER_KIND_TONE[kind].bg}
    color={FOLDER_KIND_TONE[kind].color}
  >
    {kind === "project" ? "Project" : "Matter"}
  </Box>
);
