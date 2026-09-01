import {
  Box,
  Button,
  Grid,
  HStack,
  Stack,
  Text,
  useDisclosure,
  Input,
  VStack,
  NativeSelect,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import {
  useDeletePermissionMutation,
  useGetGroupedPermissionsQuery,
  useTogglePermissionMutation,
} from "@/api/permissionSetup";
import { AddIcon, EditIcon } from "@/assets/svgs";
import { Trash2 } from "lucide-react";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import { Switch } from "@/shared/components/ui/Switch";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/shared/components/ui/Accordion";

import { AddorEditPermissions } from "./AddorEditPermissions";
import * as LucideIcons from "lucide-react";

export const PermissionManagementTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModuleFilter, setSelectedModuleFilter] = useState("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");

  const [selectedId, setSelectedId] = useState<string>();
  const [permissionToToggle, setPermissionToToggle] = useState<{
    id: string;
    active: boolean;
  } | null>(null);
  const [permissionToDelete, setPermissionToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const {
    open: addEditOpen,
    onOpen: onAddEditOpen,
    onClose: onAddEditClose,
  } = useDisclosure();

  const {
    open: toggleConfirmOpen,
    onOpen: onToggleConfirmOpen,
    onClose: onToggleConfirmClose,
  } = useDisclosure();

  const {
    open: deleteConfirmOpen,
    onOpen: onDeleteConfirmOpen,
    onClose: onDeleteConfirmClose,
  } = useDisclosure();

  const { data: menuData, isLoading } = useGetGroupedPermissionsQuery();
  const { mutate: toggleMenu, isPending: isTogglePending } =
    useTogglePermissionMutation();
  const { mutate: deletePermission, isPending: isDeletePending } =
    useDeletePermissionMutation();

  const modules = menuData?.modules || [];

  // Summary counts
  const totalModules = modules.length;
  let totalPermissionsCount = 0;
  let activePermissionsCount = 0;
  let inactivePermissionsCount = 0;

  modules.forEach((module) => {
    totalPermissionsCount += module.permissions.length;
    module.permissions.forEach((perm) => {
      if (perm.isActive) activePermissionsCount++;
      else inactivePermissionsCount++;
    });
  });

  // Filtered data
  const filteredModules = useMemo(() => {
    const q = searchQuery.toLowerCase();

    return modules
      .filter(
        (module) =>
          selectedModuleFilter === "ALL" ||
          module.moduleCode === selectedModuleFilter
      )
      .map((module) => {
        const filteredPerms = module.permissions.filter((perm) => {
          const matchesStatus =
            selectedStatusFilter === "ALL" ||
            (selectedStatusFilter === "ACTIVE" && perm.isActive) ||
            (selectedStatusFilter === "INACTIVE" && !perm.isActive);

          const matchesSearch =
            !q ||
            perm.action.toLowerCase().includes(q) ||
            perm.code.toLowerCase().includes(q) ||
            (perm.description && perm.description.toLowerCase().includes(q)) ||
            module.moduleName.toLowerCase().includes(q) ||
            module.moduleCode.toLowerCase().includes(q) ||
            (module.moduleDescription &&
              module.moduleDescription.toLowerCase().includes(q));

          return matchesStatus && matchesSearch;
        });

        return {
          ...module,
          permissions: filteredPerms,
        };
      })
      .filter(
        (module) =>
          module.permissions.length > 0 ||
          (!q && selectedStatusFilter === "ALL") ||
          (q &&
            (module.moduleName.toLowerCase().includes(q) ||
              module.moduleCode.toLowerCase().includes(q)))
      )
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [modules, searchQuery, selectedModuleFilter, selectedStatusFilter]);

  const moduleOptions = [
    { label: "All Modules", value: "ALL" },
    ...modules.map((m) => ({ label: m.moduleName, value: m.moduleCode })),
  ];

  const statusOptions = [
    { label: "All Status", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ];

  const handleEditClick = (permissionId: string) => {
    setSelectedId(permissionId);
    onAddEditOpen();
  };

  const handleAddClick = () => {
    setSelectedId("");
    onAddEditOpen();
  };

  const DynamicIcon = ({ iconName }: { iconName: string }) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Folder;
    return <IconComponent size={20} />;
  };

  return (
    <Stack gap={6} padding={2}>
      <HStack justifyContent="space-between" alignItems="center">
        <Stack gap={2}>
          <Text textStyle="heading_4">Permission Management</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Manage permissions by module and control access across the system.
          </Text>
        </Stack>

        <Button variant="primary" onClick={handleAddClick}>
          <AddIcon color="white" />
          Add Permission
        </Button>
      </HStack>

      <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4}>
        <SummaryCard title="Total Modules" value={totalModules} />
        <SummaryCard title="Total Permissions" value={totalPermissionsCount} />
        <SummaryCard
          title="Active Permissions"
          value={activePermissionsCount}
          color="green.500"
        />
        <SummaryCard
          title="Inactive Permissions"
          value={inactivePermissionsCount}
          color="red.500"
        />
      </Grid>

      <HStack gap={4} flexWrap="wrap">
        <Box flex="1" minW="250px">
          <Input
            placeholder="Search permissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg="white"
          />
        </Box>
        <Box w="200px">
          <NativeSelect.Root>
            <NativeSelect.Field
              bg="white"
              value={selectedModuleFilter}
              onChange={(e) => setSelectedModuleFilter(e.target.value)}
            >
              {moduleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>
        <Box w="150px">
          <NativeSelect.Root>
            <NativeSelect.Field
              bg="white"
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>
      </HStack>

      {isLoading ? (
        <Text>Loading permissions...</Text>
      ) : filteredModules.length === 0 ? (
        <Box
          p={8}
          textAlign="center"
          bg="white"
          borderRadius="md"
          borderWidth="1px"
        >
          <Text color="gray.500">No matching permissions found.</Text>
          <Button
            mt={4}
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedModuleFilter("ALL");
              setSelectedStatusFilter("ALL");
            }}
          >
            Clear Filters
          </Button>
        </Box>
      ) : (
        <AccordionRoot multiple defaultValue={[filteredModules[0]?.moduleCode]}>
          <Stack gap={4}>
            {filteredModules.map((module) => (
              <AccordionItem
                key={module.moduleCode}
                value={module.moduleCode}
                bg="white"
                borderRadius="md"
                borderWidth="1px"
                overflow="hidden"
              >
                <AccordionItemTrigger px={4} py={3} _hover={{ bg: "gray.50" }}>
                  <HStack justify="space-between" w="full">
                    <HStack gap={4}>
                      <Box color="brand.500">
                        <DynamicIcon iconName={module.icon || "Folder"} />
                      </Box>
                      <VStack align="start" gap={0}>
                        <Text fontWeight="600">{module.moduleName}</Text>
                        {module.moduleDescription && (
                          <Text fontSize="sm" color="gray.500">
                            {module.moduleDescription}
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                    <Text fontSize="sm" color="gray.500" mr={4}>
                      {module.permissions.length} permissions
                    </Text>
                  </HStack>
                </AccordionItemTrigger>
                <AccordionItemContent pb={4} px={4}>
                  {module.permissions.length === 0 ? (
                    <Text color="gray.500" py={4} textAlign="center">
                      No permissions configured for this module.
                    </Text>
                  ) : (
                    <Stack gap={0} separator={<Box h="1px" bg="gray.100" />}>
                      <Grid
                        templateColumns="2fr 1fr 2fr 1fr 1fr"
                        gap={4}
                        py={2}
                        px={4}
                        bg="gray.50"
                        fontSize="sm"
                        fontWeight="600"
                        color="gray.600"
                        borderRadius="md"
                        mt={2}
                      >
                        <Text>Permission</Text>
                        <Text>Scope</Text>
                        <Text>Code</Text>
                        <Text>Status</Text>
                        <Text>Action</Text>
                      </Grid>
                      {module.permissions.map((perm) => (
                        <Grid
                          key={perm.id}
                          templateColumns="2fr 1fr 2fr 1fr 1fr"
                          gap={4}
                          py={3}
                          px={4}
                          alignItems="center"
                          _hover={{ bg: "gray.50" }}
                        >
                          <Text fontWeight="500">{perm.action}</Text>
                          <Text fontSize="sm">{perm.scope}</Text>
                          <Text
                            fontSize="sm"
                            fontFamily="mono"
                            color="gray.600"
                          >
                            {perm.code}
                          </Text>
                          <HStack>
                            <Switch
                              checked={perm.isActive}
                              onCheckedChange={() => {
                                setPermissionToToggle({
                                  id: perm.id,
                                  active: perm.isActive,
                                });
                                onToggleConfirmOpen();
                              }}
                            />
                            <Text
                              fontSize="sm"
                              color={perm.isActive ? "green.600" : "gray.500"}
                            >
                              {perm.isActive ? "Active" : "Inactive"}
                            </Text>
                          </HStack>
                          <HStack gap={1}>
                            <Button
                              size="sm"
                              variant="ghost"
                              aria-label="Edit permission"
                              onClick={() => handleEditClick(perm.id)}
                            >
                              <EditIcon />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              colorPalette="red"
                              aria-label="Delete permission"
                              onClick={() => {
                                setPermissionToDelete({
                                  id: perm.id,
                                  name: perm.action,
                                });
                                onDeleteConfirmOpen();
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </HStack>
                        </Grid>
                      ))}
                    </Stack>
                  )}
                </AccordionItemContent>
              </AccordionItem>
            ))}
          </Stack>
        </AccordionRoot>
      )}

      <AddorEditPermissions
        open={addEditOpen}
        onClose={onAddEditClose}
        id={selectedId}
        setId={setSelectedId}
      />

      <ConfirmationDialog
        open={toggleConfirmOpen}
        onClose={() => {
          onToggleConfirmClose();
          setPermissionToToggle(null);
        }}
        title={
          permissionToToggle?.active
            ? "Deactivate permission?"
            : "Activate permission?"
        }
        action={
          permissionToToggle?.active
            ? "deactivate this permission"
            : "activate this permission"
        }
        handleSubmit={() => {
          if (permissionToToggle) {
            toggleMenu(permissionToToggle.id);
            onToggleConfirmClose();
            setPermissionToToggle(null);
          }
        }}
        submitActionPending={isTogglePending}
      />

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onClose={() => {
          onDeleteConfirmClose();
          setPermissionToDelete(null);
        }}
        title={`Delete "${permissionToDelete?.name ?? ""}" permission?`}
        action="delete this permission"
        handleSubmit={() => {
          if (permissionToDelete) {
            deletePermission(permissionToDelete.id, {
              onSuccess: () => {
                onDeleteConfirmClose();
                setPermissionToDelete(null);
              },
            });
          }
        }}
        submitActionPending={isDeletePending}
      />
    </Stack>
  );
};

const SummaryCard = ({
  title,
  value,
  color = "gray.900",
}: {
  title: string;
  value: number;
  color?: string;
}) => (
  <Box p={4} bg="white" borderRadius="lg" borderWidth="1px" boxShadow="sm">
    <Text fontSize="sm" color="gray.500" mb={2}>
      {title}
    </Text>
    <Text fontSize="2xl" fontWeight="700" color={color}>
      {value}
    </Text>
  </Box>
);

export default PermissionManagementTable;
