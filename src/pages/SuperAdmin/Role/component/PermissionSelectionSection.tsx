import { Box, Card, Flex, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Control, FieldPath } from "react-hook-form";

import { PrivilegeCheckboxGroup } from "@/components/PrivilegeCheckboxGroup";
import NoDataAvailable from "@/shared/components/NoDataAvailable/NoDataAvailable";

import { PermissionGroup, RoleFormValues } from "../types";

const permissionFieldName = (moduleCode: string) =>
  `permissions.${moduleCode}` as FieldPath<RoleFormValues>;

/**
 * Presentational permission picker: one card per module with a checkbox group
 * per module action. Fully controlled through react-hook-form, so it can be
 * driven either by the complete permission catalogue (Super Admin) or by the
 * Firm Admin ceiling returned from the backend.
 */
export const PermissionSelectionSection = ({
  control,
  groups,
  heading = "Menu & Action Permissions",
  description = "Configure action permissions for each module.",
  notice,
}: {
  control: Control<RoleFormValues>;
  groups: PermissionGroup[];
  heading?: string;
  description?: string;
  notice?: ReactNode;
}) => {
  const totalModules = groups.length;

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
            {description}{" "}
            {totalModules > 0 &&
              `${totalModules} module${totalModules > 1 ? "s" : ""} available.`}
          </Text>
        </Stack>
      </Card.Header>

      {notice && (
        <Box
          px={{ base: 4, md: 6 }}
          py={3}
          bg="blue.50"
          borderBottomWidth="1px"
          borderColor="blue.100"
        >
          {notice}
        </Box>
      )}

      <Card.Body px={{ base: 4, md: 6 }} py={5}>
        {totalModules > 0 ? (
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            gap={{ base: 4, md: 5 }}
            alignItems="start"
          >
            {groups.map(({ moduleCode, moduleName, permissions }) => (
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
                  name={permissionFieldName(moduleCode)}
                  label="Action Permissions"
                  options={permissions.map((permission) => ({
                    label: permission.action,
                    value: permission.id,
                    disabled: permission.disabled,
                  }))}
                />
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <NoDataAvailable content="No menu permissions available" />
        )}
      </Card.Body>
    </Card.Root>
  );
};
