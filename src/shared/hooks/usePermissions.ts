import { useMemo, useRef } from "react";

import { useAuthStore, UserModule } from "@/shared/stores/auth.store";

// ─── TYPES ──────────────────────────────────────────────────────────────────

export type PermissionAction =
  | "ACCESS"
  | "VIEW"
  | "CREATE"
  | "EDIT"
  | "DELETE"
  | "ASSIGN"
  | "ARCHIVE"
  | "UPDATE_STATUS"
  | "SCHEDULE"
  | "EXPORT"
  | "CREDENTIAL_VIEW"
  | "CREDENTIAL_REVEAL"
  | "RESET_MFA";

/**
 * The shape returned by `useModulePermissions(moduleCode)`.
 * Every boolean is `false` when data is missing, module is disabled,
 * or the action is not present in the module's actions array.
 */
export interface ModulePermissions {
  /** Whether the module exists, is enabled, and has at least ACCESS */
  canAccess: boolean;
  /** VIEW action */
  canView: boolean;
  /** CREATE action */
  canCreate: boolean;
  /** EDIT action */
  canEdit: boolean;
  /** DELETE action */
  canDelete: boolean;
  /** ASSIGN action */
  canAssign: boolean;
  /** ARCHIVE action */
  canArchive: boolean;
  /** UPDATE_STATUS action */
  canUpdateStatus: boolean;
  /** SCHEDULE action */
  canSchedule: boolean;
  /** EXPORT action */
  canExport: boolean;
  /** CREDENTIAL_VIEW action (Project Management) */
  canCredentialView: boolean;
  /** CREDENTIAL_REVEAL action (Project Management) */
  canCredentialReveal: boolean;
  /** RESET_MFA action (User Management) */
  canResetMFA: boolean;
  /**
   * Generic check: does the module have this action?
   * Always safe — returns false for unknown actions or missing data.
   */
  hasAction: (action: string) => boolean;
  /** Raw actions array from the module (empty if not found / disabled) */
  actions: string[];
  /** Whether the module is enabled */
  enabled: boolean;
}

// ─── STATIC NO-PERMISSION OBJECT (avoids re-creation) ──────────────────────

const NO_PERMISSION: ModulePermissions = {
  canAccess: false,
  canView: false,
  canCreate: false,
  canEdit: false,
  canDelete: false,
  canAssign: false,
  canArchive: false,
  canUpdateStatus: false,
  canSchedule: false,
  canExport: false,
  canCredentialView: false,
  canCredentialReveal: false,
  canResetMFA: false,
  hasAction: () => false,
  actions: [],
  enabled: false,
};

// ─── PURE HELPERS (no hooks) ────────────────────────────────────────────────

/**
 * Pure helper: check if a module has a specific action.
 * Does NOT use hooks — safe to call from outside React components.
 */
export function moduleHasAction(
  modules: UserModule[],
  moduleCode: string,
  action: string
): boolean {
  if (!moduleCode || !action) return false;
  const mod = modules.find((m) => m.moduleCode === moduleCode);
  if (!mod || !mod.enabled) return false;
  return mod.actions.includes(action);
}

/**
 * Pure helper: check if a module is enabled.
 */
export function isModuleEnabled(
  modules: UserModule[],
  moduleCode: string
): boolean {
  if (!moduleCode) return false;
  const mod = modules.find((m) => m.moduleCode === moduleCode);
  return !!mod && mod.enabled;
}

// ─── HOOKS ──────────────────────────────────────────────────────────────────

/**
 * Primary hook: get all permission booleans for a specific module.
 *
 * @example
 * const { canCreate, canEdit, canDelete } = useModulePermissions("CLIENT_MANAGEMENT");
 */
export function useModulePermissions(moduleCode: string): ModulePermissions {
  const modules = useAuthStore((state) => state.modules);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  // Use a ref to stabilize the hasAction function reference
  const hasActionRef = useRef<Record<string, (action: string) => boolean>>({});

  return useMemo(() => {
    if (!isInitialized || !modules || modules.length === 0 || !moduleCode) {
      return NO_PERMISSION;
    }

    const mod = modules.find((m) => m.moduleCode === moduleCode);
    if (!mod || !mod.enabled) {
      return NO_PERMISSION;
    }

    const actions = mod.actions ?? [];
    const has = (action: string) => actions.includes(action);

    // Stabilize the hasAction function per moduleCode
    if (!hasActionRef.current[moduleCode]) {
      hasActionRef.current[moduleCode] = (action: string) =>
        actions.includes(action);
    }

    return {
      canAccess: has("ACCESS"),
      canView: has("VIEW"),
      canCreate: has("CREATE"),
      canEdit: has("EDIT"),
      canDelete: has("DELETE"),
      canAssign: has("ASSIGN"),
      canArchive: has("ARCHIVE"),
      canUpdateStatus: has("UPDATE_STATUS"),
      canSchedule: has("SCHEDULE"),
      canExport: has("EXPORT"),
      canCredentialView: has("CREDENTIAL_VIEW"),
      canCredentialReveal: has("CREDENTIAL_REVEAL"),
      canResetMFA: has("RESET_MFA"),
      hasAction: hasActionRef.current[moduleCode],
      actions,
      enabled: true,
    };
  }, [modules, moduleCode, isInitialized]);
}

/**
 * Backward-compatible hook matching the existing `useGetAccessVariables` pattern.
 *
 * Maps to the same underlying data but uses familiar naming:
 * - VIEW   → canRead
 * - CREATE → canCreate
 * - EDIT   → canUpdate
 * - DELETE → canDelete
 *
 * Also exposes all action-specific booleans and the generic `hasAction`.
 *
 * @example
 * const { canRead, canCreate, canUpdate, canDelete } = useGetAccessVariables("CASE_MANAGEMENT");
 */
export function useGetAccessVariables(moduleCode: string): ModulePermissions & {
  canRead: boolean;
  canUpdate: boolean;
} {
  const perms = useModulePermissions(moduleCode);

  return useMemo(
    () => ({
      ...perms,
      /** VIEW → canRead */
      canRead: perms.canView,
      /** EDIT → canUpdate */
      canUpdate: perms.canEdit,
    }),
    [perms]
  );
}

/**
 * Check if the current user has access to a specific module route.
 * Used by route guards — returns true only when the module exists,
 * is enabled, and has ACCESS action.
 */
export function useCanAccessModule(moduleCode: string): boolean {
  const perms = useModulePermissions(moduleCode);
  return perms.canAccess;
}

/**
 * Get the raw modules array from the auth store.
 * Useful for cases where you need to iterate or display module info.
 */
export function useAllModules(): UserModule[] {
  return useAuthStore((state) => state.modules);
}
