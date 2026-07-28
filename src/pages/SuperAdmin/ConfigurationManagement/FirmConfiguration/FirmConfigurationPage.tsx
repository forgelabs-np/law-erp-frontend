import React from "react";
import {
  Badge,
  Box,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Building2, Settings } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";

import { useGetFirmsQuery, FirmResponse } from "@/api/firmManagement";
import {
  useFirmConfigQuery,
  useUpsertFirmConfigMutation,
  ConfigValues,
} from "@/api/configManagement";
import { ReactSelect } from "@/shared/components";
import { ConfigEditor } from "../components/ConfigEditor";

// ─── Empty State ─────────────────────────────────────────────────────────────

const FirmEmptyState: React.FC = () => (
  <Flex
    direction="column"
    alignItems="center"
    justifyContent="center"
    py={16}
    px={8}
    borderWidth="1px"
    borderRadius="lg"
    borderStyle="dashed"
    borderColor="gray.200"
    bg="gray.50"
    color="gray.400"
    gap={3}
    textAlign="center"
  >
    <Box
      p={4}
      borderRadius="full"
      bg="gray.100"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Icon as={Settings} boxSize={7} color="gray.400" />
    </Box>
    <Text fontWeight="600" fontSize="md" color="gray.500">
      Select a Firm
    </Text>
    <Text fontSize="sm" color="gray.400" maxW="300px">
      Choose a firm above to view and manage its configuration values.
    </Text>
  </Flex>
);

// ─── Firm Info Card ───────────────────────────────────────────────────────────

interface FirmInfoCardProps {
  firm: FirmResponse;
}

const FirmInfoCard: React.FC<FirmInfoCardProps> = ({ firm }) => {
  const displayName = (firm as any).firmName || firm.name;
  const displayCode = (firm as any).firmCode || firm.lawFirmCode;

  return (
    <Flex
      alignItems="center"
      gap={4}
      p={4}
      borderWidth="1px"
      borderRadius="md"
      bg="blue.50"
      borderColor="blue.100"
      mb={6}
    >
      <Box
        p={2}
        borderRadius="md"
        bg="blue.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon as={Building2} boxSize={5} color="blue.600" />
      </Box>
      <Stack gap={0} flex={1}>
        <Text fontWeight="600" fontSize="sm" color="gray.700">
          {displayName}
        </Text>
        <Text fontSize="xs" color="gray.500">
          Code: {displayCode}
        </Text>
      </Stack>
      <Badge
        colorScheme={firm.isActive ? "green" : "red"}
        borderRadius="full"
        px={3}
        py={1}
        fontSize="xs"
      >
        {firm.isActive ? "Active" : "Inactive"}
      </Badge>
    </Flex>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const FirmConfigurationPage: React.FC = () => {
  const methods = useForm({ defaultValues: { firmId: "" } });
  const { watch } = methods;
  const selectedFirmId = watch("firmId");

  const { data: firmsResponse, isLoading: isLoadingFirms } = useGetFirmsQuery();

  // The query select returns response?.data which is ApiResponse<FirmResponse[]>
  const firms: FirmResponse[] =
    (firmsResponse as any)?.data ||
    (Array.isArray(firmsResponse) ? firmsResponse : []);

  const selectedFirm = firms.find(
    (f) => (f.id || f.firmId) === selectedFirmId
  );

  const firmOptions = firms.map((firm) => ({
    label: `${(firm as any).firmName || firm.name} (${(firm as any).firmCode || firm.lawFirmCode})`,
    value: firm.id || firm.firmId,
  }));

  const { data: firmConfig, isLoading: isLoadingConfig, isFetching } =
    useFirmConfigQuery(selectedFirmId);

  const upsertMutation = useUpsertFirmConfigMutation();

  const handleSave = (config: ConfigValues) => {
    if (selectedFirmId) {
      upsertMutation.mutate({ firmId: selectedFirmId, config });
    }
  };

  return (
    <Box p={6} maxW="1000px">
      {/* Page Header */}
      <Flex alignItems="center" gap={3} mb={2}>

        <Heading size="lg" fontWeight="700">
          Firm Configuration
        </Heading>
      </Flex>
      <Text color="gray.500" fontSize="sm" mb={8} >
        Manage configuration values specific to individual firms.
      </Text>

      {/* Firm Selector */}
      <Box mb={6}>
        <Text fontWeight="600" fontSize="sm" color="gray.600" mb={2}>
          Select Firm
        </Text>
        <Box maxW="480px">
          <FormProvider {...methods}>
            <ReactSelect
              name="firmId"
              placeholder="Search or select a firm..."
              options={firmOptions}
              disabled={isLoadingFirms}
              isSearchable
            />
          </FormProvider>
        </Box>
      </Box>

      {/* Content Area */}
      {!selectedFirmId ? (
        <FirmEmptyState />
      ) : (
        <Box>
          {/* Firm Info Card */}
          {selectedFirm && <FirmInfoCard firm={selectedFirm} />}

          {/* Configuration Editor */}
          <ConfigEditor
            title="Configuration Values"
            initialConfig={firmConfig}
            onSave={handleSave}
            isLoading={
              upsertMutation.isPending || isLoadingConfig || isFetching
            }
          />
        </Box>
      )}
    </Box>
  );
};

export default FirmConfigurationPage;
