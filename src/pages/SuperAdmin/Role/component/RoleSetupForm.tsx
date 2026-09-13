import { Card, Grid, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { Control } from "react-hook-form";

import { useGetModuleMenusQuery } from "@/api/menuSetup";
import {
  PermissionResponse,
  useGetPermissionsQuery,
} from "@/api/permissionSetup";
import InputField from "@/shared/components/inputField";

import { PermissionGroup, RoleFormValues } from "../types";
import { PermissionSelectionSection } from "./PermissionSelectionSection";

export const RoleSetupForm = ({
  control,
}: {
  isOpen: boolean;
  control: Control<RoleFormValues>;
}) => {
  const { data: permissionsResponse } = useGetPermissionsQuery();
  const { data: modulesResponse } = useGetModuleMenusQuery();

  const allPermissions: PermissionResponse[] = useMemo(
    () => permissionsResponse?.data ?? [],
    [permissionsResponse]
  );

  const allModules = useMemo(
    () => modulesResponse?.data ?? [],
    [modulesResponse]
  );

  const permissionGroups: PermissionGroup[] = useMemo(() => {
    const groups = allModules
      .map((module) => {
        const permissions = allPermissions.filter((permission) => {
          const permissionModuleCode = permission.code?.split(":")[0];
          return permissionModuleCode === module.code;
        });
        return {
          moduleCode: module.code,
          moduleName: module.name,
          permissions: permissions.map((permission) => ({
            id: permission.id,
            action: permission.action,
            disabled: permission.isActive === false,
          })),
        };
      })
      .filter((group) => group.permissions.length > 0);

    const knownModuleCodes = new Set(allModules.map((module) => module.code));
    const orphanPermissions = allPermissions.filter((permission) => {
      const permissionModuleCode = permission.code?.split(":")[0];
      return (
        !permissionModuleCode || !knownModuleCodes.has(permissionModuleCode)
      );
    });

    if (orphanPermissions.length > 0) {
      groups.push({
        moduleCode: "OTHER",
        moduleName: "Other",
        permissions: orphanPermissions.map((permission) => ({
          id: permission.id,
          action: permission.action,
          disabled: permission.isActive === false,
        })),
      });
    }

    return groups;
  }, [allModules, allPermissions]);

  return (
    <Stack gap={6}>
      {/* ── Role Details ────────────────────────────────────────── */}
      <Card.Root
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.200"
        overflow="hidden"
      >
        <Card.Header
          px={{ base: 4, md: 6 }}
          py={4}
          bg="gray.50"
          borderBottomWidth="1px"
          borderColor="gray.100"
        >
          <Text fontSize="sm" fontWeight="600" color="gray.700">
            Role Details
          </Text>
        </Card.Header>
        <Card.Body px={{ base: 4, md: 6 }} py={5}>
          <Grid
            templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
            gap={{ base: 4, md: 5 }}
          >
            <InputField
              control={control}
              name="name"
              label="Role Name"
              placeholder="e.g. Admin"
              required
            />
            <InputField
              control={control}
              name="code"
              label="Role Code"
              placeholder="Enter Role Code"
              required
            />
            <InputField
              control={control}
              name="description"
              label="Description"
              placeholder="Enter Description"
            />
          </Grid>
        </Card.Body>
      </Card.Root>

      {/* ── Permissions Section ──────────────────────────────────── */}
      <PermissionSelectionSection control={control} groups={permissionGroups} />
    </Stack>
  );
};
