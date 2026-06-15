import { Control } from "react-hook-form";

import { ModuleMenuFields } from "@/components/ModuleMenuFields";
import { MenuSetupFormValues } from "../types";
import { RoleFormValues } from "../../Role/types";

export const MenuSetupForm = ({
  control,
  isEdit,
}: {
  control: Control<MenuSetupFormValues>;
  isEdit?: boolean;
}) => {
  return (
    <ModuleMenuFields control={control as unknown as Control<RoleFormValues>} name="CRM" isEdit={isEdit} />
  );
};
