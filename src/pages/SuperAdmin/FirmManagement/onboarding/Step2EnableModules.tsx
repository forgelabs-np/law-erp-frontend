import {
  Badge,
  HStack,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import {
  MasterModule,
  MergedModule,
  useGetAllModulesQuery,
  useGetFirmModulesQuery,
  useConfigureFirmModuleMutation,
} from "@/api/firmModules";
import { Datatable } from "@/shared/components";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import { Switch } from "@/shared/components/ui";

interface Step2EnableModulesProps {
  firmId: string;
  onContinue: () => void;
  onBack: () => void;
}

export const Step2EnableModules = ({
  firmId,
  onContinue: _onContinue,
  onBack: _onBack,
}: Step2EnableModulesProps) => {
  const [moduleToToggle, setModuleToToggle] = useState<MergedModule | null>(
    null
  );
  const [isToggleConfirmOpen, setIsToggleConfirmOpen] = useState(false);

  const { data: masterModulesData, isLoading: isLoadingMaster } =
    useGetAllModulesQuery();
  const { data: firmModulesData, isLoading: isLoadingFirm } =
    useGetFirmModulesQuery(firmId);

  const { mutate: configureModule, isPending: isConfigurePending } =
    useConfigureFirmModuleMutation(firmId);

  const isLoading = isLoadingMaster || isLoadingFirm;

  const mergedModules: MergedModule[] = useMemo(() => {
    if (!masterModulesData) return [];

    return masterModulesData.map((masterModule: MasterModule) => {
      const assignedModule = firmModulesData?.find(
        (fm) => fm.moduleId === masterModule.id
      );

      if (assignedModule) {
        return {
          moduleId: masterModule.id,
          moduleName: assignedModule.moduleName || masterModule.name,
          moduleCode: assignedModule.moduleCode || masterModule.code,
          isAssigned: true,
          isEnabled: assignedModule.isEnabled,
          isTrial: assignedModule.isTrial,
          enabledAt: assignedModule.enabledAt,
          expiresAt: assignedModule.expiresAt,
          maxFileSizeMb: assignedModule.maxFileSizeMb,
          allowedExtensions: assignedModule.allowedExtensions,
          notes: assignedModule.notes,
        };
      }
      return {
        moduleId: masterModule.id,
        moduleName: masterModule.name,
        moduleCode: masterModule.code,
        isAssigned: false,
        isEnabled: false,
        isTrial: false,
        enabledAt: null,
        expiresAt: null,
        maxFileSizeMb: null,
        allowedExtensions: null,
        notes: null,
      };
    });
  }, [masterModulesData, firmModulesData]);

  const enabledCount = mergedModules.filter((m) => m.isEnabled).length;
  const totalCount = mergedModules.length;

  const handleToggleConfirm = () => {
    if (!moduleToToggle) return;

    configureModule(
      {
        moduleId: moduleToToggle.moduleId,
        isEnabled: !moduleToToggle.isEnabled,
        maxFileSizeMb: moduleToToggle.maxFileSizeMb,
        allowedExtensions: moduleToToggle.allowedExtensions,
        notes: moduleToToggle.notes,
      },
      {
        onSuccess: () => {
          setIsToggleConfirmOpen(false);
          setModuleToToggle(null);
        },
      }
    );
  };

  const columns: Array<ColumnDef<MergedModule>> = useMemo(
    () => [
      {
        accessorKey: "moduleName",
        header: "Module",
        cell: ({ row }) => (
          <VStack align="start" gap="0">
            <Text fontSize="sm" fontWeight="500">
              {row.original.moduleName}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {row.original.moduleCode}
            </Text>
          </VStack>
        ),
      },
      {
        accessorKey: "isEnabled",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            bg={row.original.isEnabled ? "green.100" : "gray.100"}
            color={row.original.isEnabled ? "green.700" : "gray.700"}
            px="2"
            py="1"
            borderRadius="md"
            fontSize="xs"
            fontWeight="600"
          >
            {row.original.isEnabled ? "Enabled" : "Not Enabled"}
          </Badge>
        ),
      },
      {
        id: "enable",
        header: "Enable",
        cell: ({ row }) => (
          <Switch
            checked={row.original.isEnabled}
            onCheckedChange={() => {
              setModuleToToggle(row.original);
              setIsToggleConfirmOpen(true);
            }}
          />
        ),
      },
    ],
    []
  );

  if (isLoading) {
    return (
      <Stack gap={4} py={8} alignItems="center">
        <Spinner size="lg" color="primary.500" />
        <Text color="gray.500">Loading modules...</Text>
      </Stack>
    );
  }

  return (
    <Stack gap={5}>
      <Stack gap={1}>
        <Text fontWeight="semibold" fontSize="sm" color="gray.600">
          Select the modules this firm should have access to.
        </Text>
      </Stack>

      {/* Stats */}
      <HStack gap={4} flexWrap="wrap">
        <HStack gap={2} px={4} py={2} bg="gray.50" borderRadius="md">
          <Text fontSize="xs" color="gray.500">
            Total:
          </Text>
          <Text fontSize="sm" fontWeight="600">
            {totalCount}
          </Text>
        </HStack>
        <HStack gap={2} px={4} py={2} bg="green.50" borderRadius="md">
          <Text fontSize="xs" color="green.600">
            Enabled:
          </Text>
          <Text fontSize="sm" fontWeight="600" color="green.700">
            {enabledCount}
          </Text>
        </HStack>
      </HStack>

      {/* Table */}
      <Datatable isLoading={false} columns={columns} data={mergedModules} />

      {/* Toggle Confirmation Dialog */}
      <ConfirmationDialog
        open={isToggleConfirmOpen}
        onClose={() => {
          setIsToggleConfirmOpen(false);
          setModuleToToggle(null);
        }}
        title={moduleToToggle?.isEnabled ? "Disable Module?" : "Enable Module?"}
        action={
          moduleToToggle?.isEnabled
            ? "disable this module"
            : "enable this module"
        }
        handleSubmit={handleToggleConfirm}
        submitActionPending={isConfigurePending}
      />
    </Stack>
  );
};
