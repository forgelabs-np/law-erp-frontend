import { Badge, Box, Button, Card, HStack, NativeSelect, Stack, Text, VStack } from "@chakra-ui/react";
import { ArrowLeftIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MasterModule, MergedModule, useGetAllModulesQuery, useGetFirmModulesQuery } from "@/api/firmModules";
import { Datatable } from "@/shared/components";
import { ROUTES_CONFIG } from "@/shared/config";

import { ModuleStatusFilter } from "./types";
import { formatDate } from "./utils";
import { ConfigureModuleDrawer } from "./ConfigureModuleDrawer";

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Assigned", value: "assigned" },
  { label: "Not Assigned", value: "not_assigned" },
  { label: "Enabled", value: "enabled" },
  { label: "Disabled", value: "disabled" },
];

const FirmModules = () => {
  const navigate = useNavigate();
  const { firmId } = useParams<{ firmId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ModuleStatusFilter>("all");
  const [selectedModule, setSelectedModule] = useState<MergedModule | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: masterModulesData, isLoading: isLoadingMaster } = useGetAllModulesQuery();
  const { data: firmModulesData, isLoading: isLoadingFirm } = useGetFirmModulesQuery(firmId ?? "");

  const isLoading = isLoadingMaster || isLoadingFirm;

  // Merge master modules with firm modules
  const mergedModules = useMemo(() => {
    if (!masterModulesData) return [];

    return masterModulesData.map((masterModule: MasterModule) => {
      const assignedModule = firmModulesData?.find(
        (firmModule) => firmModule.moduleId === masterModule.id
      );

      if (assignedModule) {
        return {
          moduleId: masterModule.id,
          moduleName: assignedModule.moduleName || masterModule.name,
          moduleCode: assignedModule.moduleCode || masterModule.code,
          isAssigned: true,
          isEnabled: assignedModule.isEnabled,
          enabledAt: assignedModule.enabledAt,
          expiresAt: assignedModule.expiresAt,
          isTrial: assignedModule.isTrial,
          maxFileSizeMb: assignedModule.maxFileSizeMb,
          allowedExtensions: assignedModule.allowedExtensions,
          notes: assignedModule.notes,
        };
      } else {
        return {
          moduleId: masterModule.id,
          moduleName: masterModule.name,
          moduleCode: masterModule.code,
          isAssigned: false,
          isEnabled: false,
          enabledAt: null,
          expiresAt: null,
          isTrial: false,
          maxFileSizeMb: null,
          allowedExtensions: null,
          notes: null,
        };
      }
    });
  }, [masterModulesData, firmModulesData]);

  // Filter modules based on search and status
  const filteredModules = mergedModules?.filter((module) => {
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

  // Calculate statistics
  const totalCount = mergedModules?.length ?? 0;
  const assignedCount = mergedModules?.filter((m) => m.isAssigned).length ?? 0;
  const unassignedCount = totalCount - assignedCount;
  const enabledCount = mergedModules?.filter((m) => m.isEnabled).length ?? 0;
  const disabledCount = totalCount - enabledCount;

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
      // {
      //   accessorKey: "isAssigned",
      //   header: "Assignment",
      //   cell: ({ row }) => (
      //     <Badge
      //       bg={row.original.isAssigned ? "green.100" : "gray.100"}
      //       color={row.original.isAssigned ? "green.700" : "gray.700"}
      //       px="2"
      //       py="1"
      //       borderRadius="md"
      //       fontSize="xs"
      //       fontWeight="600"
      //     >
      //       {row.original.isAssigned ? "Assigned" : "Not Assigned"}
      //     </Badge>
      //   ),
      // },
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
            {row.original.isAssigned && row.original.isEnabled ? "Enabled" : "Not Enabled"}
          </Badge>
        ),
      },
      {
        accessorKey: "isTrial",
        header: "Trial",
        cell: ({ row }) => (
          <Badge
            bg={row.original.isTrial ? "blue.100" : "gray.100"}
            color={row.original.isTrial ? "blue.700" : "gray.700"}
            px="2"
            py="1"
            borderRadius="md"
            fontSize="xs"
            fontWeight="600"
          >
            {row.original.isTrial ? "Yes" : "No"}
          </Badge>
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
          <Text fontSize="sm">
            {row.original.notes || "—"}
          </Text>
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
    <Stack gap={6} padding={8}>
      {/* Header */}
      <HStack alignItems="center" gap={4}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES_CONFIG.USER.FIRM_MANAGEMENT)}
        >
          <ArrowLeftIcon size={20} />
        </Button>
        <Stack gap={1}>
          <Text textStyle="heading_4">Manage Modules</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Configure modules available for this firm.
          </Text>
        </Stack>
      </HStack>

      {/* Firm Information Card */}
      <Card.Root p={6} bg="gray.50">
        <HStack gap={8}>
          <VStack align="start" gap={1} flex={1}>
            <Text fontSize="xs" color="gray.500">
              Firm Name
            </Text>
            <Text fontSize="sm" fontWeight="500">
              {firmId}
            </Text>
          </VStack>
          <VStack align="start" gap={1} flex={1}>
            <Text fontSize="xs" color="gray.500">
              Firm Code
            </Text>
            <Text fontSize="sm" fontWeight="500">
              —
            </Text>
          </VStack>
          <VStack align="start" gap={1} flex={1}>
            <Text fontSize="xs" color="gray.500">
              Status
            </Text>
            <Badge bg="green.100" color="green.700" px="2" py="1" borderRadius="md" fontSize="xs">
              Active
            </Badge>
          </VStack>
          <VStack align="start" gap={1} flex={1}>
            <Text fontSize="xs" color="gray.500">
              Admin
            </Text>
            <Text fontSize="sm" fontWeight="500">
              —
            </Text>
          </VStack>
          <VStack align="start" gap={1} flex={1}>
            <Text fontSize="xs" color="gray.500">
              Email
            </Text>
            <Text fontSize="sm" fontWeight="500">
              —
            </Text>
          </VStack>
        </HStack>
      </Card.Root>
        <HStack gap={4} alignItems="center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ModuleStatusFilter)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
              width: "150px",
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

      {/* Toolbar */}
      <HStack justifyContent="space-between" alignItems="center">
        <HStack gap={4} flex={1}>
          <Box flex={1}>
            <Datatable
              isLoading={isLoading}
              columns={columns}
              data={filteredModules ?? []}
              header={{
                title: "Modules",
                hasSearch: true,
                searchText: searchQuery,
                setSearchText: setSearchQuery,
              }}
            />
          </Box>
        </HStack>

      
      </HStack>

      {/* Configure Module Drawer */}
      <ConfigureModuleDrawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedModule(null);
        }}
        module={selectedModule}
        firmId={firmId ?? ""}
      />
    </Stack>
  );
};

export default FirmModules;
