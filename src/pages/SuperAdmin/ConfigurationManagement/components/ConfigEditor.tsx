import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Input, Stack, Text, IconButton, Icon } from "@chakra-ui/react";
import { Trash2, Plus, Save } from "lucide-react";
import { ConfigValues } from "@/api/configManagement";

interface ConfigRow {
  id: string;
  key: string;
  value: string;
  isError?: boolean;
}

interface ConfigEditorProps {
  initialConfig: ConfigValues | undefined;
  onSave: (config: ConfigValues) => void;
  onDeleteKey?: (key: string) => void;
  isLoading: boolean;
  title: string;
}

export const ConfigEditor: React.FC<ConfigEditorProps> = ({
  initialConfig,
  onSave,
  onDeleteKey,
  isLoading,
  title,
}) => {
  const [rows, setRows] = useState<ConfigRow[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialConfig) {
      const initialRows = Object.entries(initialConfig).map(([k, v]) => ({
        id: crypto.randomUUID(),
        key: k,
        value: v,
      }));
      setRows(initialRows);
      setErrorMsg(null);
    }
  }, [initialConfig]);

  const handleAddRow = () => {
    setRows([...rows, { id: crypto.randomUUID(), key: "", value: "" }]);
    setErrorMsg(null);
  };

  const handleRemoveRow = (id: string, key: string) => {
    // If the key exists in initial config and we have a specific delete handler (like for global)
    if (initialConfig && initialConfig[key] !== undefined && onDeleteKey) {
      onDeleteKey(key);
      return;
    }
    // Otherwise, just remove from local state
    setRows(rows.filter((r) => r.id !== id));
    setErrorMsg(null);
  };

  const handleKeyChange = (id: string, newKey: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, key: newKey, isError: false } : r)));
    setErrorMsg(null);
  };

  const handleValueChange = (id: string, newValue: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, value: newValue } : r)));
  };

  const handleSave = () => {
    setErrorMsg(null);
    const newConfig: ConfigValues = {};
    const keys = new Set<string>();
    let hasError = false;

    const updatedRows = rows.map((row) => {
      const trimmedKey = row.key.trim();
      let rowError = false;

      if (!trimmedKey) {
        rowError = true;
      } else if (keys.has(trimmedKey)) {
        rowError = true;
      } else {
        keys.add(trimmedKey);
        newConfig[trimmedKey] = row.value;
      }

      if (rowError) hasError = true;
      return { ...row, key: trimmedKey, isError: rowError };
    });

    if (hasError) {
      setRows(updatedRows);
      setErrorMsg("Please fix the highlighted errors. Keys must be unique and cannot be empty.");
      return;
    }

    onSave(newConfig);
  };

  return (
    <Box borderWidth="1px" borderRadius="md" p={4} bg="white">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          {title}
        </Text>
        <Button size="sm" onClick={handleAddRow}>
          <Icon as={Plus} /> Add Configuration
        </Button>
      </Flex>

      {errorMsg && (
        <Text color="red.500" fontSize="sm" mb={4}>
          {errorMsg}
        </Text>
      )}

      <Stack gap={3}>
        {rows.length === 0 ? (
          <Text color="gray.500" fontSize="sm">
            No configurations found.
          </Text>
        ) : (
          rows.map((row) => (
            <Flex key={row.id} gap={3} alignItems="center">
              <Input
                placeholder="Key (e.g., company.name)"
                value={row.key}
                onChange={(e) => handleKeyChange(row.id, e.target.value)}
                borderColor={row.isError ? "red.500" : undefined}
                flex={1}
                size="sm"
              />
              <Input
                placeholder="Value"
                value={row.value}
                onChange={(e) => handleValueChange(row.id, e.target.value)}
                flex={1}
                size="sm"
              />
              <IconButton
                aria-label="Delete"
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={() => handleRemoveRow(row.id, row.key)}
              >
                <Icon as={Trash2} />
              </IconButton>
            </Flex>
          ))
        )}
      </Stack>

      <Flex justifyContent="flex-end" mt={6}>
        <Button colorScheme="blue" onClick={handleSave} loading={isLoading}>
          <Icon as={Save} /> Save Changes
        </Button>
      </Flex>
    </Box>
  );
};
