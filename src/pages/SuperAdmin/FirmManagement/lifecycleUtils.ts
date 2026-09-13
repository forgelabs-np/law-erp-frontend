import { FirmResponse } from "@/api/firmManagement";

/**
 * Determines which lifecycle actions are available for a firm based on its
 * isTrial and isSuspended flags.
 *
 * When the backend currently returns null for both flags (the case today),
 * the helper falls back to preserving the existing toggle-only behavior so
 * we do not accidentally expose destructive/lifecycle actions.
 *
 * Once the backend starts returning real values the UI will automatically
 * switch to the correct action set without any code changes here.
 */
export interface FirmLifecycleActions {
  canSuspend: boolean;
  canActivate: boolean;
  canExtendTrial: boolean;
  canConvertToPermanent: boolean;
}

export function getFirmLifecycleActions(
  firm: FirmResponse
): FirmLifecycleActions {
  const { isTrial, isSuspended } = firm;

  // ── Backend has started returning real flags ──────────────────────────────
  if (isSuspended === true) {
    return {
      canSuspend: false,
      canActivate: true,
      canExtendTrial: false,
      canConvertToPermanent: false,
    };
  }

  if (isSuspended === false && isTrial === true) {
    return {
      canSuspend: true,
      canActivate: false,
      canExtendTrial: true,
      canConvertToPermanent: true,
    };
  }

  if (isSuspended === false && isTrial === false) {
    return {
      canSuspend: true,
      canActivate: false,
      canExtendTrial: false,
      canConvertToPermanent: false,
    };
  }

  // ── Fallback: flags are null (current backend behaviour) ──────────────────
  // Preserve existing behavior – only show the standard active/inactive toggle.
  // Do NOT guess trial or suspended state.
  return {
    canSuspend: false,
    canActivate: false,
    canExtendTrial: false,
    canConvertToPermanent: false,
  };
}
