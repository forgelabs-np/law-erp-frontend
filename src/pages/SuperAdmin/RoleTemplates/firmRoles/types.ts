export interface FirmRoleFormValues {
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  parentRoleId: string;
  permissions?: Record<string, string[]>;
}
