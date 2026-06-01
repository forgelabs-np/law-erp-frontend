import { InitApiResponse } from "@/api/modules";

/**
 * Permission utility helper
 * Use this in components to check if user has permission to access a module/scope
 */

export const hasModuleAccess = (
  moduleData: InitApiResponse | null,
  moduleCode: string
): boolean => {
  if (!moduleData) return false;
  return moduleData.modules.some((m) => m.code === moduleCode && m.active);
};

export const hasScope = (
  moduleData: InitApiResponse | null,
  moduleCode: string,
  scopeCode: string
): boolean => {
  if (!moduleData) return false;
  const module = moduleData.modules.find((m) => m.code === moduleCode);
  if (!module) return false;
  return module.scopes.some((s) => s.code === scopeCode);
};

export const hasAllScopes = (
  moduleData: InitApiResponse | null,
  moduleCode: string,
  scopeCodes: string[]
): boolean => {
  if (!moduleData) return false;
  const module = moduleData.modules.find((m) => m.code === moduleCode);
  if (!module) return false;
  return scopeCodes.every((scopeCode) =>
    module.scopes.some((s) => s.code === scopeCode)
  );
};

export const hasAnyScope = (
  moduleData: InitApiResponse | null,
  moduleCode: string,
  scopeCodes: string[]
): boolean => {
  if (!moduleData) return false;
  const module = moduleData.modules.find((m) => m.code === moduleCode);
  if (!module) return false;
  return scopeCodes.some((scopeCode) =>
    module.scopes.some((s) => s.code === scopeCode)
  );
};
