import { FirmResponse, FirmStatus } from "@/api/firmManagement";

/**
 * Determines which lifecycle actions are available for a firm based on its
 * firmStatus field from the backend.
 *
 * firmStatus is the single source of truth:
 * - "TRIAL"    → Extend Trial, Convert to Permanent, Suspend
 * - "ACTIVE"   → Suspend
 * - "SUSPENDED" → Activate
 * - "EXPIRED"  → no lifecycle actions (unless explicitly supported by backend)
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
  const { firmStatus } = firm;

  switch (firmStatus) {
    case "TRIAL":
      return {
        canSuspend: true,
        canActivate: false,
        canExtendTrial: true,
        canConvertToPermanent: true,
      };

    case "ACTIVE":
      return {
        canSuspend: true,
        canActivate: false,
        canExtendTrial: false,
        canConvertToPermanent: false,
      };

    case "SUSPENDED":
      return {
        canSuspend: false,
        canActivate: true,
        canExtendTrial: false,
        canConvertToPermanent: false,
      };

    case "EXPIRED":
      // No lifecycle actions unless backend explicitly supports transitions
      return {
        canSuspend: false,
        canActivate: false,
        canExtendTrial: false,
        canConvertToPermanent: false,
      };

    default:
      // Unknown status — show no lifecycle actions
      return {
        canSuspend: false,
        canActivate: false,
        canExtendTrial: false,
        canConvertToPermanent: false,
      };
  }
}

/**
 * Returns the status badge configuration for display.
 */
export function getFirmStatusBadge(status: FirmStatus | undefined) {
  switch (status) {
    case "TRIAL":
      return { label: "Trial", color: "blue" as const };
    case "ACTIVE":
      return { label: "Active", color: "green" as const };
    case "SUSPENDED":
      return { label: "Suspended", color: "orange" as const };
    case "EXPIRED":
      return { label: "Expired", color: "red" as const };
    default:
      return { label: "Unknown", color: "gray" as const };
  }
}
