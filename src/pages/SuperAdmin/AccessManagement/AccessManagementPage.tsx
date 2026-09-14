import {
  Badge,
  Box,
  Button,
  Card,
  HStack,
  NativeSelect,
  Spinner,
  Stack,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetFirmsQuery, FirmResponse } from "@/api/firmManagement";
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
import { ROUTES_CONFIG } from "@/shared/config";

import { ModuleStatusFilter } from "../FirmModules/types";
import { formatDate } from "../FirmModules/utils";
import { ConfigureModuleDrawer } from "../FirmModules/ConfigureModuleDrawer";
import { FirmRolesPanel } from "./FirmRolesPanel";

// ─── MODULE TAB ──────────────────────────────────────────────────────────────

const MODULE_STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Assigned", value: "assigned" },
  { label: "Not Assigned", value: "not_assigned" },
  { label: "Enabled", value: "enabled" },
  { label: "Disabled", value: "disabled" },
];

function ModuleManagementTab({ firmId }: { firmId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ModuleStatusFilter>("all");
  const [selectedModule, setSelectedModule] = useState<MergedModule | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  const mergedModules = useMemo(() => {
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

  const filteredModules = mergedModules.filter((module) => {
    const matchesSearch =
      searchQuery === "" ||
      module.moduleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.moduleCode?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "assigned" && module.isAssigned) ||
      (statusFilter === "not_assigned" && !module.isAssigned) ||
      (statusFilter === "enabled" && module.isEnabled) ||
      (statusFilter === "disabled" && !module.isEnabled);

    return matchesSearch && matchesStatus;
  });

  const totalCount = mergedModules.length;
  const assignedCount = mergedModules.filter((m) => m.isAssigned).length;
  const unassignedCount = totalCount - assignedCount;
  const enabledCount = mergedModules.filter((m) => m.isEnabled).length;
  const disabledCount = totalCount - enabledCount;

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
            {row.original.isAssigned && row.original.isEnabled
              ? "Enabled"
              : "Not Enabled"}
          </Badge>
        ),
      },
      {
        accessorKey: "enable",
        header: "Enable",
        cell: ({ row }) => (
          <Switch
            checked={row.original.isEnabled}
            // disabled={!row.original.isAssigned}
            onCheckedChange={() => {
              setModuleToToggle(row.original);
              setIsToggleConfirmOpen(true);
            }}
          />
        ),
      },
      {
        accessorKey: "enabledAt",
        header: "Enabled On",
        cell: ({ row }) => (
          <Text fontSize="sm">
            {row.original.enabledAt ? formatDate(row.original.enabledAt) : "—"}
          </Text>
        ),
      },
      {
        accessorKey: "expiresAt",
        header: "Expires On",
        cell: ({ row }) => (
          <Text fontSize="sm">
            {row.original.expiresAt ? formatDate(row.original.expiresAt) : "—"}
          </Text>
        ),
      },
      {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ row }) => (
          <Text fontSize="sm">{row.original.notes || "—"}</Text>
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedModule(row.original);
              setIsDrawerOpen(true);
            }}
          >
            Configure
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <Stack gap={5}>
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
        <HStack gap={2} px={4} py={2} bg="gray.50" borderRadius="md">
          <Text fontSize="xs" color="gray.500">
            Assigned:
          </Text>
          <Text fontSize="sm" fontWeight="600">
            {assignedCount}
          </Text>
        </HStack>
        <HStack gap={2} px={4} py={2} bg="gray.50" borderRadius="md">
          <Text fontSize="xs" color="gray.500">
            Unassigned:
          </Text>
          <Text fontSize="sm" fontWeight="600">
            {unassignedCount}
          </Text>
        </HStack>
        <HStack gap={2} px={4} py={2} bg="gray.50" borderRadius="md">
          <Text fontSize="xs" color="gray.500">
            Enabled:
          </Text>
          <Text fontSize="sm" fontWeight="600">
            {enabledCount}
          </Text>
        </HStack>
        <HStack gap={2} px={4} py={2} bg="gray.50" borderRadius="md">
          <Text fontSize="xs" color="gray.500">
            Disabled:
          </Text>
          <Text fontSize="sm" fontWeight="600">
            {disabledCount}
          </Text>
        </HStack>
      </HStack>

      {/* Filters */}
      <HStack gap={4} alignItems="center" flexWrap="wrap">
        <NativeSelect.Root w="150px">
          <NativeSelect.Field
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as ModuleStatusFilter)
            }
          >
            {MODULE_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </HStack>

      {/* Table */}
      <Datatable
        isLoading={isLoading}
        columns={columns}
        data={filteredModules}
        header={{
          title: "Modules",
          hasSearch: true,
          searchText: searchQuery,
          setSearchText: setSearchQuery,
        }}
      />

      {/* Configure Drawer */}
      <ConfigureModuleDrawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedModule(null);
        }}
        module={selectedModule}
        firmId={firmId}
      />

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
}

// ─── PERMISSIONS TAB ─────────────────────────────────────────────────────────
// Super Admin views the firm's roles and overrides their permissions through
// the firm-scoped endpoints: GET /super-admin/firms/{firmId}/roles and
// PUT /super-admin/firms/{firmId}/roles/{roleId}/permissions.

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function AccessManagementPage() {
  const navigate = useNavigate();
  const { firmId } = useParams<{ firmId: string }>();
  const [activeTab, setActiveTab] = useState("modules");

  const { data: firmsData, isLoading: isLoadingFirms } = useGetFirmsQuery();

  const firm = firmsData?.data?.find((f: FirmResponse) => f.firmId === firmId);

  const firmName = firm?.name || "Firm";
  const firmCode = firm?.lawFirmCode || firmId || "";

  return (
    <Stack gap={6} padding={8}>
      {/* Header */}
      <HStack alignItems="center" gap={4}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES_CONFIG.USER.FIRM_MANAGEMENT)}
          aria-label="Back to Firm Management"
        >
          <ArrowLeftIcon size={20} />
        </Button>
        <Stack gap={1}>
          <Text textStyle="heading_4">Manage Access</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Configure modules and permissions for this firm.
          </Text>
        </Stack>
      </HStack>

      {/* Firm Info Card */}
      <Card.Root p={6} bg="gray.50">
        {isLoadingFirms ? (
          <HStack py={4} justifyContent="center">
            <Spinner size="sm" color="primary.500" />
            <Text fontSize="sm" color="gray.500">
              Loading firm details...
            </Text>
          </HStack>
        ) : (
          <HStack gap={8} flexWrap="wrap">
            <VStack align="start" gap={1} flex={1} minW="150px">
              <Text fontSize="xs" color="gray.500">
                Firm Name
              </Text>
              <Text fontSize="sm" fontWeight="500">
                {firmName}
              </Text>
            </VStack>
            <VStack align="start" gap={1} flex={1} minW="120px">
              <Text fontSize="xs" color="gray.500">
                Firm Code
              </Text>
              <Text fontSize="sm" fontWeight="500">
                {firmCode}
              </Text>
            </VStack>
            <VStack align="start" gap={1} flex={1} minW="120px">
              <Text fontSize="xs" color="gray.500">
                Type
              </Text>
              <Badge
                bg={firm?.firmType === "SOLO" ? "blue.100" : "purple.100"}
                color={firm?.firmType === "SOLO" ? "blue.700" : "purple.700"}
                px="2"
                py="1"
                borderRadius="md"
                fontSize="xs"
                textTransform="capitalize"
              >
                {firm?.firmType || "—"}
              </Badge>
            </VStack>
            <VStack align="start" gap={1} flex={1} minW="120px">
              <Text fontSize="xs" color="gray.500">
                Status
              </Text>
              <Badge
                bg={firm?.isActive ? "green.100" : "gray.100"}
                color={firm?.isActive ? "green.700" : "gray.700"}
                px="2"
                py="1"
                borderRadius="md"
                fontSize="xs"
              >
                {firm?.isActive ? "Active" : "Inactive"}
              </Badge>
            </VStack>
            <VStack align="start" gap={1} flex={1} minW="150px">
              <Text fontSize="xs" color="gray.500">
                Email
              </Text>
              <Text fontSize="sm" fontWeight="500">
                {firm?.email || "—"}
              </Text>
            </VStack>
          </HStack>
        )}
      </Card.Root>

      {/* Tabs */}
      <Tabs.Root
        value={activeTab}
        onValueChange={(details) => setActiveTab(details.value)}
        variant="enclosed"
      >
        <Tabs.List>
          <Tabs.Trigger
            value="modules"
            _selected={{ borderColor: "primary.500", color: "primary.500" }}
          >
            Menu & Module Management
          </Tabs.Trigger>
          <Tabs.Trigger
            value="permissions"
            _selected={{ borderColor: "primary.500", color: "primary.500" }}
          >
            Permissions
          </Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>

        <Box mt={4}>
          <Tabs.Content value="modules">
            <ModuleManagementTab firmId={firmId ?? ""} />
          </Tabs.Content>
          <Tabs.Content value="permissions">
            {/* Lazy: only renders when the permissions tab is active, so no
                firm-role request fires until the user opens the tab. */}
            {activeTab === "permissions" && (
              <FirmRolesPanel firmId={firmId ?? ""} />
            )}
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Stack>
  );
}
