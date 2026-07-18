import { Box, Grid, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { Control, FieldPath } from "react-hook-form";

import { RoleFormValues } from "@/pages/SuperAdmin/Role/types";
import { DeleteIcon } from "@/shared/assets";
import { TextFieldInput } from "@/shared/components";
import { Switch } from "@/shared/components/ui";
import { PRIVILEGE_OPTIONS } from "@/shared/constants/permission";

import { PrivilegeCheckboxGroup } from "./PrivilegeCheckboxGroup";

export function SubMenuItem({
  control,
  moduleName,
  index,
  subMenuId,
  active = true,
  onRemove,
  onToggle,
}: SubMenuItemProps) {
  const privilegeName =
    `${moduleName}.subMenus.${index}.privilege` as FieldPath<RoleFormValues>;
  const hasId = !!subMenuId;

  return (
    <Box
      p={4}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="12px"
      bg="white"
    >
      <HStack justifyContent="space-between" mb={3}>
        <Text fontSize="sm" fontWeight={600} color="gray.600">
          {index + 1}.Sub Menu
        </Text>
        {hasId ? (
          <Switch
            checked={active}
            onCheckedChange={() => subMenuId && onToggle?.(subMenuId)}
          />
        ) : (
          <IconButton
            type="button"
            variant="ghost"
            size="md"
            colorPalette="red"
            aria-label="Remove sub menu"
            onClick={onRemove}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </HStack>

      <Stack gap={2} width="full">
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 2fr 2fr" }}
          gap={6}
          w="full"
        >
          <TextFieldInput
            type="text"
            name={`${moduleName}.subMenus.${index}.displayOrder`}
            label="Display Order"
            placeholder="Enter Display Order"
            required
          />
          <TextFieldInput
            name={`${moduleName}.subMenus.${index}.menuName`}
            label="Sub Menu Name"
            placeholder="Enter Sub Menu Name"
            required
          />
          <TextFieldInput
            name={`${moduleName}.subMenus.${index}.menuCode`}
            label="Menu Code"
            placeholder="e.g. CATEGORY_SETUP"
            required
            disabled={hasId}
          />
        </Grid>
        <PrivilegeCheckboxGroup
          control={control}
          name={privilegeName}
          label="Action Permissions"
          options={PRIVILEGE_OPTIONS}
        />
      </Stack>
    </Box>
  );
}

interface SubMenuItemProps {
  control: Control<RoleFormValues>;
  moduleName: "CRM" | "CMS"|"menu";
  index: number;
  subMenuId?: string;
  active?: boolean;
  onRemove: () => void;
  onToggle?: (submenuId: string) => void;
}
