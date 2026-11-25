import { format } from "date-fns";

import { Plan, SubscriptionStatus } from "@/shared/types/plan";
import { priceWithComma } from "@/shared/utils/priceWithComma";

/**
 * Formats a backend timestamp.
 *
 * The API may return ISO-8601 values without a timezone offset (for example
 * `2026-12-01T09:00:00`), which represent server-local time. They are parsed as
 * local time and never shifted, so the displayed date matches what the server
 * meant.
 */
export const formatServerDate = (value: string | null | undefined): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return format(date, "d MMM yyyy");
};

export const SUBSCRIPTION_STATUS_META: Record<
  SubscriptionStatus,
  { label: string; bg: string; color: string }
> = {
  TRIAL: { label: "Trial", bg: "blue.50", color: "blue.700" },
  ACTIVE: { label: "Active", bg: "green.50", color: "green.700" },
  EXPIRED: { label: "Expired", bg: "red.50", color: "red.700" },
  CANCELLED: { label: "Cancelled", bg: "gray.100", color: "gray.600" },
};

/** Label used in the plan dropdowns of the trial and conversion dialogs. */
export const planOptionLabel = (plan: Plan): string => {
  return `${plan.name} (${plan.code}) · ${plan.currency} ${priceWithComma(
    plan.monthlyPrice
  )}/month`;
};

/** Only active plans may be used to start a trial or convert a subscription. */
export const getActivePlanOptions = (plans: Plan[]): Plan[] => {
  return plans.filter((plan) => plan.isActive);
};
