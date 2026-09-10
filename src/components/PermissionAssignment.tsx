import { Box, Card, Flex, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { Control, FieldValues } from "react-hook-form";

import { PermissionResponse } from "@/api/permissionSetup";
import NoDataAvailable from "@/shared/components/NoDataAvailable/NoDataAvailable";
import { useModulePermissionGroups } from "@/shared/hooks/useModulePermissionGroups";

import {
  ControlledPrivilegeCheckboxGroup,
  PrivilegeCheckboxGroup,
} from "./PrivilegeCheckboxGroup";

type SharedCardProps = {
  moduleCode: string;
  moduleName: string;
  permissions: PermissionResponse[];
  readOnly?: boolean;
};

type PermissionModuleCardProps = SharedCardProps & {
  /** RHF mode: form control + field name prefix (`prefix.moduleCode`). */
  control?: Control<FieldValues>;
  fieldNamePrefix?: string;
  /** Controlled mode: selection (permission IDs) owned by the parent. */
  selectedPermissionIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Parent-derived select-all state (global-selection / scoped mode). */
  selectAllState?: { checked: boolean; indeterminate: boolean };
  /** Module-scoped toggle for Enable All (add/remove this module's ids). */
  onToggleAllScoped?: (checked: boolean) => void;
  /** Global-selection toggle for one permission id. */
  onToggleOptionScoped?: (option: string, checked: boolean) => void;
};

const PermissionModuleCard = ({
  moduleCode,
  moduleName,
  permissions,
  readOnly = false,
  control,
  fieldNamePrefix,
  selectedPermissionIds,
  onSelectionChange,
  selectAllState,
  onToggleAllScoped,
  onToggleOptionScoped,
}: PermissionModuleCardProps) => {
  const options = permissions.map((p) => ({
    label: p.action,
    value: p.id,
    disabled: p.isActive === false,
  }));

  const isControlled = !!selectedPermissionIds;

  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      bg="white"
      overflow="hidden"
      _hover={{ borderColor: "gray.300" }}
      transition="border-color 150ms ease"
    >
      {/* Module Card Header */}
      <Flex
        alignItems="center"
        justifyContent="space-between"
        px={{ base: 3, md: 4 }}
        py={3}
        borderBottomWidth="1px"
        borderColor="gray.100"
        bg="white"
      >
        <Stack gap={0}>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="600"
            color="gray.900"
            lineHeight="short"
          >
            {moduleName}
          </Text>
          <Text fontSize="xs" color="gray.400" fontFamily="mono" mt={0.5}>
            {moduleCode}
          </Text>
        </Stack>
        <Box
          bg="primary.50"
          color="primary.600"
          px={2}
          py={0.5}
          borderRadius="full"
          fontSize="xs"
          fontWeight="600"
        >
          {permissions.length} permission
          {permissions.length !== 1 ? "s" : ""}
        </Box>
      </Flex>

      {/* Permission Controls */}
      {isControlled ? (
        <ControlledPrivilegeCheckboxGroup
          value={selectedPermissionIds}
          onChange={onSelectionChange}
          label="Action Permissions"
          options={options}
          readOnly={readOnly}
          selectAllState={selectAllState}
          onToggleAllScoped={onToggleAllScoped}
          onToggleOptionScoped={onToggleOptionScoped}
        />
      ) : control ? (
        <PrivilegeCheckboxGroup
          control={control}
          name={`${fieldNamePrefix}.${moduleCode}` as never}
          label="Action Permissions"
          options={options}
          readOnly={readOnly}
        />
      ) : null}
    </Box>
  );
};

type CommonProps = {
  /** Card heading (defaults to the Role Management heading). */
  heading?: string;
  /** Renders the selection UI in read-only mode (no toggling). */
  readOnly?: boolean;
};

/** React Hook Form mode: each module maps to `${fieldNamePrefix}.${moduleCode}`. */
export type PermissionAssignmentRHFProps<T extends FieldValues> =
  CommonProps & {
    control: Control<T>;
    fieldNamePrefix?: string;
    selectedPermissionIds?: never;
    onSelectionChange?: never;
  };

/** Controlled mode: selection (permission IDs) is owned by the parent. */
export type PermissionAssignmentControlledProps = CommonProps & {
  selectedPermissionIds: string[];
  /** Omit for read-only display (e.g. firm role permission viewers). */
  onSelectionChange?: (ids: string[]) => void;
  control?: never;
  fieldNamePrefix?: never;
};

/**
 * The existing "Menu & Action Permissions" permission assignment UI, shared
 * by Role Management (RHF mode) and Role Templates (controlled mode).
 * Only renders the permission selection interface — data fetching, save /
 * preview flows and API calls stay with the parent screen.
 */
export function PermissionAssignment<T extends FieldValues>(
  props:
    | PermissionAssignmentControlledProps
    | PermissionAssignmentRHFProps<T>
) {
  const { heading = "Menu & Action Permissions", readOnly = false } = props;
  const modeProps = props as Record<string, unknown>;

  const { isLoading, groups, orphanPermissions } = useModulePermissionGroups();

  /**
   * Scope-aware controlled mode (used by the Role Template flow): the
   * select-all control reflects the GLOBAL selection for this module and
   * toggles apply module-scoped add/remove deltas, so other modules are
   * never affected. Only wired when the parent owns a live selection.
   */
  const buildCardProps = (permissions: PermissionResponse[]) => {
    const controlled = props as PermissionAssignmentControlledProps;
    if (
      !Array.isArray(controlled.selectedPermissionIds) ||
      !controlled.onSelectionChange
    ) {
      return modeProps;
    }
    const selected = controlled.selectedPermissionIds;
    // Match the existing non-scoped toggle semantics: inactive permissions
    // are never added/removed by Enable All (they render disabled).
    const enabledIds = permissions
      .filter((p) => p.isActive !== false)
      .map((p) => p.id);
    const allSelected =
      enabledIds.length > 0 && enabledIds.every((id) => selected.includes(id));
    const someSelected = enabledIds.some((id) => selected.includes(id));
    return {
      ...modeProps,
      selectAllState: {
        checked: allSelected,
        indeterminate: someSelected && !allSelected,
      },
      onToggleAllScoped: (checked: boolean) => {
        const next = new Set(selected);
        enabledIds.forEach((id) => {
          if (checked) {
            next.add(id);
          } else {
            next.delete(id);
          }
        });
        controlled.onSelectionChange?.(Array.from(next));
      },
      onToggleOptionScoped: (permissionId: string, checked: boolean) => {
        const next = new Set(selected);
        if (checked) {
          next.add(permissionId);
        } else {
          next.delete(permissionId);
        }
        controlled.onSelectionChange?.(Array.from(next));
      },
    };
  };

  const totalModules = groups.length + (orphanPermissions.length > 0 ? 1 : 0);

  return (
    <Card.Root
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
      overflow="hidden"
    >
      <Card.Header
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "stretch", md: "center" }}
        gap={{ base: 2, md: 4 }}
        px={{ base: 4, md: 6 }}
        py={4}
        bg="gray.50"
        borderBottomWidth="1px"
        borderColor="gray.100"
      >
        <Stack flex={1} gap={0}>
          <Text fontSize="sm" fontWeight="600" color="gray.700">
            {heading}
          </Text>
          <Text fontSize="xs" color="gray.500" mt={0.5}>
            Configure action permissions for each module.{" "}
            {totalModules > 0 &&
              `${totalModules} module${totalModules > 1 ? "s" : ""} available.`}
          </Text>
        </Stack>
      </Card.Header>

      <Card.Body px={{ base: 4, md: 6 }} py={5}>
        {isLoading ? (
          <Stack py={6} align="center">
            <Text fontSize="sm" color="gray.500">
              Loading permissions...
            </Text>
          </Stack>
        ) : groups.length > 0 || orphanPermissions.length > 0 ? (
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            gap={{ base: 4, md: 5 }}
            alignItems="start"
          >
            {/* Grouped module permission cards */}
            {groups.map((group) => (
              <PermissionModuleCard
                key={group.moduleCode}
                moduleCode={group.moduleCode}
                moduleName={group.moduleName}
                permissions={group.permissions}
                readOnly={readOnly}
                {...buildCardProps(group.permissions)}
              />
            ))}

            {/* Orphan permissions not matching any module */}
            {orphanPermissions.length > 0 && (
              <PermissionModuleCard
                key="OTHER"
                moduleCode="OTHER"
                moduleName="Other"
                permissions={orphanPermissions}
                readOnly={readOnly}
                {...buildCardProps(orphanPermissions)}
              />
            )}
          </SimpleGrid>
        ) : (
          <NoDataAvailable content="No menu permissions available" />
        )}
      </Card.Body>
    </Card.Root>
  );
}
