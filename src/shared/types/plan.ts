/**
 * Plans, pricing and trial/subscription contracts.
 *
 * Shapes here mirror the backend contract described in Pricing.md. Every
 * request body is wrapped in `data` by the API service layer — these types
 * describe only the inner object.
 */

// ─── Plans ───────────────────────────────────────────────────────────────────

export interface PlanModule {
  moduleId: string;
  moduleCode: string;
  moduleName: string;
}

export interface Plan {
  id: string;
  code: string;
  name: string;
  tagline: string | null;
  description: string | null;
  monthlyPrice: number;
  /** Total amount for a full year; `null` means the plan is monthly-only. */
  yearlyPrice: number | null;
  currency: string;
  vatIncluded: boolean;
  /** `null` means unlimited users. */
  maxUsers: number | null;
  /** `null` means unlimited storage. */
  maxStorageBytes: number | null;
  badge: string | null;
  sortOrder: number;
  isPublic: boolean;
  isActive: boolean;
  modules: PlanModule[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload for `POST /super-admin/plans`.
 * `code` is immutable after creation and must be sent uppercase.
 * `trialDays` is intentionally absent — trial length is set per firm.
 */
export interface PlanCreateRequest {
  code: string;
  name: string;
  tagline: string | null;
  description: string | null;
  monthlyPrice: number;
  yearlyPrice: number | null;
  currency: string;
  vatIncluded: boolean;
  maxUsers: number | null;
  maxStorageBytes: number | null;
  badge: string | null;
  sortOrder: number;
  isPublic: boolean;
  isActive: boolean;
  /** Top-level module ids only — the backend adds their children. */
  moduleIds?: string[];
}

/**
 * Payload for `PUT /super-admin/plans/{planId}` — a FULL replacement:
 * every editable field is sent on each save. `code` is not editable.
 *
 * Nullable fields (`tagline`, `description`, `yearlyPrice`, `maxUsers`,
 * `maxStorageBytes`, `badge`) must be sent as `null` when cleared.
 * `moduleIds` is omitted when the selection was not touched, so an unrelated
 * edit never wipes the plan's modules.
 */
export type PlanUpdateRequest = Omit<PlanCreateRequest, "code" | "moduleIds"> & {
  moduleIds?: string[];
};

export interface PlanStatusRequest {
  isActive: boolean;
}

// ─── Modules (module picker) ─────────────────────────────────────────────────

export interface ActiveModule {
  id: string;
  code: string;
  name: string;
  description: string | null;
  parentId: string | null;
  subModules: ActiveModule[] | null;
  level: number;
  displayOrder: number;
  icon: string | null;
  path: string | null;
  isActive: boolean;
  permissions: string[];
}

// ─── Trial / subscription ────────────────────────────────────────────────────

export type SubscriptionStatus = "TRIAL" | "ACTIVE" | "EXPIRED" | "CANCELLED";

export type BillingCycle = "MONTHLY" | "YEARLY";

export interface TrialSubscription {
  firmId: string;
  planCode: string;
  planName: string;
  status: SubscriptionStatus;
  /** Total trial days granted (accumulates across extensions). */
  trialDays: number | null;
  trialStartedAt: string | null;
  /** The actual date the trial ends. */
  trialEndsAt: string | null;
  /** The date access is expected to stop (trial end + grace period). */
  graceEndsAt: string | null;
  /** Subscription end for a paid subscription. */
  endsAt: string | null;
  /** Rounded down, floored at zero — not a reliable "is active" signal. */
  daysRemaining: number | null;
  maxUsers: number | null;
  maxStorageBytes: number | null;
  currency: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
}

export interface StartTrialRequest {
  /** Omitted → backend `TRIAL_PLAN_CODE` default. */
  planCode?: string;
  /** Omitted → backend `TRIAL_DEFAULT_DAYS`; 1–365 when supplied. */
  days?: number;
}

export interface ExtendTrialRequest {
  additionalDays: number;
}

export interface ConvertSubscriptionRequest {
  planCode: string;
  billingCycle?: BillingCycle;
}
