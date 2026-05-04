import { Control } from "react-hook-form";

import { RoleFormValues } from "@/pages/SuperAdmin/Role/types";
import { Tabs } from "@/shared/components/ui/Tabs";
import { MODULE_TYPE_OPTIONS } from "@/shared/constants/permission";

import { ModuleMenuFields } from "./ModuleMenuFields";

export const ModuleType = {
  CMS: "CMS",
  CRM: "CRM",
  DEALER: "DEALER",
} as const;

export function MenuSetupTabs({
  control,
  value,
  onValueChange,
  onSubMenuToggle,
  isEdit,
}: MenuSetupTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={onValueChange}
      options={MODULE_TYPE_OPTIONS}
      renderContent={(module) => (
        <ModuleMenuFields
          control={control}
          name={module as "CRM" | "CMS"}
          onSubMenuToggle={onSubMenuToggle}
          isEdit={isEdit}
        />
      )}
    />
  );
}

interface MenuSetupTabsProps {
  control: Control<RoleFormValues>;
  value: string;
  onValueChange?: (value: string) => void;
  onSubMenuToggle?: (submenuId: string) => void;
  isEdit?: boolean;
}
