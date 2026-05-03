import { ModuleType } from "@/components/MenuSetupTabs";

import { capitalizeWords } from "../utils/captlizeWords";

export const ACTION_PERMISSION_NAMES = {
  VIEW: "VIEW",
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
};

export const PRIVILEGE_OPTIONS = [
  {
    value: ACTION_PERMISSION_NAMES.VIEW,
    label: capitalizeWords(ACTION_PERMISSION_NAMES.VIEW),
  },
  {
    value: ACTION_PERMISSION_NAMES.CREATE,
    label: capitalizeWords(ACTION_PERMISSION_NAMES.CREATE),
  },
  {
    value: ACTION_PERMISSION_NAMES.UPDATE,
    label: capitalizeWords(ACTION_PERMISSION_NAMES.UPDATE),
  },
  {
    value: ACTION_PERMISSION_NAMES.DELETE,
    label: capitalizeWords(ACTION_PERMISSION_NAMES.DELETE),
  },
];

export const MODULE_TYPE_OPTIONS = [
  { label: ModuleType.CRM, value: ModuleType.CRM },
  { label: ModuleType.CMS, value: ModuleType.CMS },
];
