import {
  Box,
  Button,
  Center,
  Grid,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { Control, FieldPath } from "react-hook-form";
import { useFieldArray, useWatch } from "react-hook-form";

import { AddIcon } from "@/assets/svgs";
import { RoleFormValues } from "@/pages/SuperAdmin/Role/types";
import { TextFieldInput } from "@/shared/components";
import { PRIVILEGE_OPTIONS } from "@/shared/constants/permission";

import { PrivilegeCheckboxGroup } from "./PrivilegeCheckboxGroup";
import { SubMenuItem } from "./SubMenuItem";
import { defaultSubMenu } from "./types";

export function ModuleMenuFields({
  control,
  name,
  onSubMenuToggle,
  isEdit,
}: ModuleMenuFieldsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${name}.subMenus`,
  });
  const subMenus = useWatch({ control, name: `${name}.subMenus` }) ?? [];

  const privilegeName = `${name}.privilege` as FieldPath<RoleFormValues>;

  return (
    <Stack gap={6}>
      <HStack justifyContent="space-between">
        <Center w="35%" justifyContent="flex-start">
          <Text>Menu</Text>
          {/* <StepperTextBlock
            title="Menu"
            description="Provide dynamic fields for menu configuration."
          /> */}
        </Center>

        <Stack
          gap={2}
          width="full"
          border="1px solid"
          borderColor="gray.200"
          p={4}
          borderRadius="12px"
          bg="gray.50"
        >
          <Grid
            templateColumns={{ base: "1fr", md: " 1fr 2fr 2fr" }}
            gap={6}
            w="full"
          >
            <TextFieldInput
              name={`${name}.displayOrder`}
              label="Display Order"
              placeholder="Enter Display Order"
              required
            />
            <TextFieldInput
              name={`${name}.menuName`}
              label="Menu Name"
              placeholder="Enter Menu Name"
              required
            />
            <TextFieldInput
              name={`${name}.menuCode`}
              label="Menu Code"
              placeholder="e.g. DASHBOARD"
              required
              disabled={isEdit}
            />
          </Grid>
          <PrivilegeCheckboxGroup
            control={control}
            name={privilegeName}
            label="Action Permissions"
            options={PRIVILEGE_OPTIONS}
          />
        </Stack>
      </HStack>

      <HStack justifyContent="space-between">
        <Center w="35%" justifyContent="flex-start">
          <Text>Sub Menus</Text>
          {/* <StepperTextBlock
            title="Sub Menus"
            description="Add sub menus with their permissions."
          /> */}
        </Center>

        <Box
          border="1px solid"
          borderColor="gray.200"
          p={4}
          borderRadius="12px"
          w="full"
        >
          <HStack justifyContent="flex-end" mb={4}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append(defaultSubMenu)}
            >
              <AddIcon />
              Add Sub Menu
            </Button>
          </HStack>

          {fields.length === 0 ? (
            <Text color="gray.500" fontSize="sm" py={4} textAlign="center">
              No sub menus added. Click &quot;Add Sub Menu&quot; to add one.
            </Text>
          ) : (
            <Stack gap={4}>
              {fields.map((field, index) => {
                const subMenu = subMenus[index];
                return (
                  <SubMenuItem
                    key={field.id}
                    control={control}
                    moduleName={name}
                    index={index}
                    subMenuId={subMenu?.id}
                    active={subMenu?.active ?? true}
                    onRemove={() => remove(index)}
                    onToggle={onSubMenuToggle}
                  />
                );
              })}
            </Stack>
          )}
        </Box>
      </HStack>
    </Stack>
  );
}

export type MODULE_TYPE = "CRM" | "CMS" |"menu";

interface ModuleMenuFieldsProps {
  control: Control<RoleFormValues>;
  name: MODULE_TYPE;
  onSubMenuToggle?: (submenuId: string) => void;
  isEdit?: boolean;
}
