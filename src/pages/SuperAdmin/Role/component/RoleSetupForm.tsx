import {
  Box,
  Card,
  Grid,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Control, FieldPath } from "react-hook-form";

import { PrivilegeCheckboxGroup } from "@/components/PrivilegeCheckboxGroup";
import InputField from "@/shared/components/inputField";
import NoDataAvailable from "@/shared/components/NoDataAvailable/NoDataAvailable";
import { Tabs } from "@/shared/components/ui/Tabs";
import { MODULE_TYPE_OPTIONS } from "@/shared/constants/permission";
import { SelectOptionType } from "@/shared/types";
import { capitalizeWords } from "@/shared/utils/captlizeWords";
import { buildMenuListFromApi } from "@/shared/utils/menu";
import { MenuItem } from "@/types/menu";

import { RoleFormValues } from "../types";

export const RoleSetupForm = ({
  // isOpen,
  control,
}: {
  isOpen: boolean;
  control: Control<RoleFormValues>;
}) => {
  const [selectedModule, setSelectedModule] = useState<string>("CRM");

  //   const { data: menu } = useGetDropdownMenuQuery(selectedModule, isOpen);

  const menu = {
    datalist: [
      {
        menus: [
          {
            id: "1",
            menuId: "1",
            menuName: "Dashboard",
            menuCode: "DASHBOARD",
            moduleType: "CRM" as const,
            displayOrder: "1",
            privilege: ["VIEW"],
          },
          {
            id: "2",
            menuId: "2",
            menuName: "User Management",
            menuCode: "USER_MANAGEMENT",
            moduleType: "CRM" as const,
            displayOrder: "2",
            privilege: ["VIEW", "CREATE", "UPDATE", "DELETE"],
            subMenus: [
              {
                id: "2-1",
                menuId: "2-1",
                menuName: "Users",
                menuCode: "USERS",
                moduleType: "CRM" as const,
                displayOrder: "1",
                privilege: ["VIEW", "CREATE", "UPDATE", "DELETE"],
              },
              {
                id: "2-2",
                menuId: "2-2",
                menuName: "Roles",
                menuCode: "ROLES",
                moduleType: "CRM" as const,
                displayOrder: "2",
                privilege: ["VIEW", "CREATE", "UPDATE", "DELETE"],
              },
            ],
          },
        ],
      },
    ],
  };
  const menuList = useMemo(
    () => buildMenuListFromApi(menu?.datalist?.[0]?.menus),
    [menu?.datalist]
  );

  const permissionKey = (item: MenuItem) => item.menuId ?? item.menuCode;

  // const methods = useForm();

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
          <HStack justify="flex-end" flexShrink={0}>
            <Tabs
              value={selectedModule}
              onValueChange={setSelectedModule}
              options={MODULE_TYPE_OPTIONS as unknown as SelectOptionType[]}
            />
          </HStack>
        </Card.Header>
        <Card.Body>
          {menuList?.length ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              {menuList?.map((item) => {
                const key = permissionKey(item);
                const fieldName =
                  `permissions.${key}` as FieldPath<RoleFormValues>;

                return (
                  <Box
                    key={key}
                    p={4}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="12px"
                    bg="white"
                  >
                    <Stack gap="1" mb="1">
                      <Text fontSize="18px" fontWeight={600} color="black">
                        {item.menuName}
                      </Text>
                      <Text fontSize="14px" fontWeight={600} color="gray.500">
                        {item.menuCode}
                      </Text>
                    </Stack>

                    <PrivilegeCheckboxGroup
                      control={control}
                      name={fieldName}
                      label="Action Permissions"
                      options={
                        Array.isArray(item?.privilege)
                          ? item.privilege.map((priv) => ({
                              label: capitalizeWords(priv),
                              value: priv,
                            }))
                          : typeof item?.privilege === "string"
                            ? [
                                {
                                  label: capitalizeWords(item.privilege),
                                  value: item.privilege,
                                },
                              ]
                            : []
                      }
                    />
                  </Box>
                );
              })}
            </SimpleGrid>
          ) : (
            <NoDataAvailable content="No menu permissions available" />
          )}
        </Card.Body>
      </Card.Root>
    </Stack>
  );
};
