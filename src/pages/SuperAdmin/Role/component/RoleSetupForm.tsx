import { Box, Card, Grid, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { Control } from "react-hook-form";

import { useGetModuleMenusQuery } from "@/api/menuSetup";
import {
  PermissionResponse,
  useGetPermissionsQuery,
} from "@/api/permissionSetup";
import { PrivilegeCheckboxGroup } from "@/components/PrivilegeCheckboxGroup";
import InputField from "@/shared/components/inputField";
import NoDataAvailable from "@/shared/components/NoDataAvailable/NoDataAvailable";

import { RoleFormValues } from "../types";

export const RoleSetupForm = ({
  control,
}: {
  isOpen: boolean;
  control: Control<RoleFormValues>;
}) => {
  const { data: permissionsResponse } = useGetPermissionsQuery();
  const { data: modulesResponse } = useGetModuleMenusQuery();

  const allPermissions: PermissionResponse[] = useMemo(
    () => (permissionsResponse as any)?.data ?? [],
    [permissionsResponse]
  );

  const allModules: any[] = useMemo(
    () => (modulesResponse as any)?.data ?? [],
    [modulesResponse]
  );

  const groupedByModule = useMemo(() => {
    return allModules
      .map((mod: any) => {
        const modCode = mod.code;
        const permsForModule = allPermissions.filter((perm: any) => {
          const permModuleCode = perm.code?.split(":")[0];
          return permModuleCode === modCode;
        });
        return {
          moduleCode: modCode,
          moduleName: mod.name,
          permissions: permsForModule,
        };
      })
      .filter((group: any) => group.permissions.length > 0);
  }, [allModules, allPermissions]);

  const knownModuleCodes = useMemo(
    () => new Set(allModules.map((m: any) => m.code)),
    [allModules]
  );
  const orphanPermissions = useMemo(
    () =>
      allPermissions.filter((perm: any) => {
        const permModuleCode = perm.code?.split(":")[0];
        return !permModuleCode || !knownModuleCodes.has(permModuleCode);
      }),
    [allPermissions, knownModuleCodes]
  );

  return (
    <Stack gap={6}>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={6}>
        <InputField
          control={control}
          name="name"
          label="Role Name"
          placeholder="eg. Admin"
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

      <Card.Root>
        <Card.Header flexDirection={{ base: "column", md: "row" }} gap={4}>
          <Stack flex={1} gap={0}>
            <Text textStyle="subtitle_large">Menu & Action Permissions</Text>
            <Text textStyle="paragraph_small" color="gray.500">
              Select action permissions for each menu
            </Text>
          </Stack>
        </Card.Header>
        <Card.Body>
          {groupedByModule.length > 0 || orphanPermissions.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              {/* Grouped module cards */}
              {groupedByModule.map(
                ({ moduleCode, moduleName, permissions }: any) => (
                  <Box
                    key={moduleCode}
                    p={4}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="12px"
                    bg="white"
                  >
                    <Stack gap="1" mb="3">
                      <Text fontSize="18px" fontWeight={600} color="black">
                        {moduleName}
                      </Text>
                      <Text fontSize="12px" color="gray.500">
                        {moduleCode}
                      </Text>
                    </Stack>

                    <PrivilegeCheckboxGroup
                      control={control}
                      name={`permissions.${moduleCode}` as any}
                      label="Action Permissions"
                      options={permissions.map((p: any) => ({
                        label: p.action,
                        value: p.id,
                      }))}
                    />
                  </Box>
                )
              )}

              {/* Orphan permissions not matching any module */}
              {orphanPermissions.length > 0 && (
                <Box
                  key="OTHER"
                  p={4}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="12px"
                  bg="white"
                >
                  <Stack gap="1" mb="3">
                    <Text fontSize="18px" fontWeight={600} color="black">
                      Other
                    </Text>
                  </Stack>

                  <PrivilegeCheckboxGroup
                    control={control}
                    name={`permissions.OTHER` as any}
                    label="Action Permissions"
                    options={orphanPermissions.map((p: any) => ({
                      label: p.action,
                      value: p.id,
                    }))}
                  />
                </Box>
              )}
            </SimpleGrid>
          ) : (
            <NoDataAvailable content="No menu permissions available" />
          )}
        </Card.Body>
      </Card.Root>
    </Stack>
  );
};
