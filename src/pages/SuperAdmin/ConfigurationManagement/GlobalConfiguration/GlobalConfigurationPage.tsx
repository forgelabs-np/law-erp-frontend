import React, { useState } from "react";
import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { Globe } from "lucide-react";

import {
  useGlobalConfigQuery,
  useUpsertGlobalConfigMutation,
  useDeleteGlobalConfigMutation,
  ConfigValues,
} from "@/api/configManagement";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import { ConfigEditor } from "../components/ConfigEditor";

const GlobalConfigurationPage: React.FC = () => {
  const { data: globalConfig, isLoading: isFetching } = useGlobalConfigQuery();
  const upsertMutation = useUpsertGlobalConfigMutation();
  const deleteMutation = useDeleteGlobalConfigMutation();

  const [deleteKey, setDeleteKey] = useState<string | null>(null);

  const handleSave = (config: ConfigValues) => {
    upsertMutation.mutate(config);
  };

  const handleDeleteRequest = (key: string) => {
    setDeleteKey(key);
  };

  const confirmDelete = () => {
    if (deleteKey) {
      deleteMutation.mutate(deleteKey, {
        onSuccess: () => setDeleteKey(null),
      });
    }
  };

  return (
    <Box p={6} maxW="1000px">
      {/* Page Header */}
      <Flex alignItems="center" gap={3} mb={2}>

        <Heading size="lg" fontWeight="700">
          Global Configuration
        </Heading>
      </Flex>
      <Text color="gray.500" fontSize="sm" mb={8} >
        Manage system-wide configuration values used across the entire application.
      </Text>

      {/* Configuration Editor */}
      <ConfigEditor
        title="Configuration Values"
        initialConfig={globalConfig}
        onSave={handleSave}
        onDeleteKey={handleDeleteRequest}
        isLoading={upsertMutation.isPending || isFetching}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        open={!!deleteKey}
        onClose={() => setDeleteKey(null)}
        title="Delete Configuration Key"
        action={`delete the configuration key "${deleteKey}"`}
        handleSubmit={confirmDelete}
        submitActionPending={deleteMutation.isPending}
      />
    </Box>
  );
};

export default GlobalConfigurationPage;
