import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { FolderOpen } from "lucide-react";

import { DocumentLibraryView } from "../components/DocumentLibraryView";

/**
 * The firm document library (`/folder`).
 *
 * The library is folder-first: projects and matters are the first level and
 * their documents open on their own route (`/folder/projects/:projectCode`,
 * `/folder/matters/:matterNumber`), so the page never presents the whole
 * firm's documents as one flat table.
 *
 * Route access is already enforced by ModuleRouteGuard
 * (DOCUMENT_MANAGEMENT + VIEW); the individual actions are gated by
 * UPLOAD / SHARE / EDIT inside the library view.
 */
const FirmDocumentsPage = () => (
  <Stack gap={6} padding={2} w="100%" maxW="100%" minW={0}>
    <HStack alignItems="center" gap={3} minW={0}>
      <Box
        w="10"
        h="10"
        borderRadius="xl"
        bg="primary.50"
        color="primary.500"
        display="grid"
        placeItems="center"
        flexShrink={0}
      >
        <FolderOpen size={20} />
      </Box>
      <Stack gap={0.5} minW={0}>
        <Text textStyle="heading_4">Documents</Text>
        <Text textStyle="paragraph_regular" color="gray.500">
          Browse your firm&apos;s documents by project and matter.
        </Text>
      </Stack>
    </HStack>

    <DocumentLibraryView />
  </Stack>
);

export default FirmDocumentsPage;
