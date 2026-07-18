export interface MasterModule {
  id: string;
  name: string;
  code: string;
}

export interface FirmModule {
  id: string;
  moduleId: string;
  moduleName: string;
  moduleCode: string;
  isEnabled: boolean;
  enabledAt: string | null;
  expiresAt: string | null;
  isTrial: boolean;
  maxFileSizeMb: number | null;
  allowedExtensions: string | null;
  notes: string | null;
}

export interface MergedModule {
  moduleId: string;
  moduleName: string;
  moduleCode: string;
  isAssigned: boolean;
  isEnabled: boolean;
  enabledAt: string | null;
  expiresAt: string | null;
  isTrial: boolean;
  maxFileSizeMb: number | null;
  allowedExtensions: string | null;
  notes: string | null;
}

export interface ConfigureModulePayload {
  moduleId: string;
  isEnabled: boolean;
  trialDays: number | null;
  maxFileSizeMb: number | null;
  allowedExtensions: string | null;
  notes: string | null;
}

export interface ConfigureModuleFormValues {
  isEnabled: boolean;
  isTrial: boolean;
  trialDays: number;
  maxFileSizeMb: number;
  allowedExtensions: string;
  notes: string;
}

export type ModuleStatusFilter = "all" | "assigned" | "not_assigned" | "enabled" | "disabled";
