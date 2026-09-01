import {
  Box,
  Card,
  Flex,
  Grid,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
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

  const totalModules =
    groupedByModule.length + (orphanPermissions.length > 0 ? 1 : 0);

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
              Menu & Action Permissions
            </Text>
            <Text fontSize="xs" color="gray.500" mt={0.5}>
              Configure action permissions for each module.{" "}
              {totalModules > 0 &&
                `${totalModules} module${totalModules > 1 ? "s" : ""} available.`}
            </Text>
          </Stack>
        </Card.Header>

        <Card.Body px={{ base: 4, md: 6 }} py={5}>
          {groupedByModule.length > 0 || orphanPermissions.length > 0 ? (
            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              gap={{ base: 4, md: 5 }}
              alignItems="start"
            >
              {/* Grouped module permission cards */}
              {groupedByModule.map(
                ({ moduleCode, moduleName, permissions }: any) => (
                  <Box
                    key={moduleCode}
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
                        <Text
                          fontSize="xs"
                          color="gray.400"
                          fontFamily="mono"
                          mt={0.5}
                        >
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
                    <PrivilegeCheckboxGroup
                      control={control}
                      name={`permissions.${moduleCode}` as any}
                      label="Action Permissions"
                      options={permissions.map((p: any) => ({
                        label: p.action,
                        value: p.id,
                        disabled: p.isActive === false,
                      }))}
                    />
                  </Box>
                )
              )}

              {/* Orphan permissions not matching any module */}
              {orphanPermissions.length > 0 && (
                <Box
                  key="OTHER"
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
                        Other
                      </Text>
                      <Text
                        fontSize="xs"
                        color="gray.400"
                        fontFamily="mono"
                        mt={0.5}
                      >
                        UNCLASSIFIED
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
                      {orphanPermissions.length} permission
                      {orphanPermissions.length !== 1 ? "s" : ""}
                    </Box>
                  </Flex>

                  {/* Permission Controls */}
                  <PrivilegeCheckboxGroup
                    control={control}
                    name={`permissions.OTHER` as any}
                    label="Action Permissions"
                    options={orphanPermissions.map((p: any) => ({
                      label: p.action,
                      value: p.id,
                      disabled: p.isActive === false,
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
