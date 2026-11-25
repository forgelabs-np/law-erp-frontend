import {
  ActiveModule,
  Plan,
  PlanCreateRequest,
  PlanUpdateRequest,
} from "@/shared/types/plan";
import { bytesToGb, gbToBytes } from "@/shared/utils/storage";

import { PlanFormValues } from "@/validations/plan.validation";

/**
 * Builds a top-level module tree from the `admin/modules/active` response.
 * The endpoint may return a nested `subModules` tree, a flat list with
 * `parentId`, or a mix of both — all three are normalised here.
 */
export const buildModuleTree = (modules: ActiveModule[]): ActiveModule[] => {
  const flat: ActiveModule[] = [];

  const flatten = (list: ActiveModule[], parentId?: string) => {
    list.forEach((module) => {
      flat.push({
        ...module,
        parentId: module.parentId ?? parentId ?? null,
        subModules: null,
      });
      if (module.subModules?.length) {
        flatten(module.subModules, module.id);
      }
    });
  };
  flatten(modules);

  const byId = new Map<string, ActiveModule>();
  flat.forEach((module) => {
    if (!byId.has(module.id)) {
      byId.set(module.id, { ...module, subModules: [] });
    }
  });

  const roots: ActiveModule[] = [];
  byId.forEach((module) => {
    const parent = module.parentId ? byId.get(module.parentId) : undefined;
    if (parent && parent.id !== module.id) {
      parent.subModules = parent.subModules ?? [];
      if (!parent.subModules.some((child) => child.id === module.id)) {
        parent.subModules.push(module);
      }
    } else {
      roots.push(module);
    }
  });

  const sortRecursive = (list: ActiveModule[]) => {
    list.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    list.forEach((module) => sortRecursive(module.subModules ?? []));
  };
  sortRecursive(roots);

  return roots;
};

export const emptyPlanFormValues: PlanFormValues = {
  code: "",
  name: "",
  tagline: "",
  description: "",
  monthlyPrice: "",
  yearlyPrice: "",
  currency: "NPR",
  vatIncluded: false,
  unlimitedUsers: false,
  maxUsers: "",
  unlimitedStorage: false,
  maxStorageGb: "",
  badge: "",
  sortOrder: "0",
  isPublic: true,
  isActive: true,
};

export const planToFormValues = (plan: Plan): PlanFormValues => ({
  code: plan.code,
  name: plan.name,
  tagline: plan.tagline ?? "",
  description: plan.description ?? "",
  monthlyPrice: String(plan.monthlyPrice),
  yearlyPrice: plan.yearlyPrice === null ? "" : String(plan.yearlyPrice),
  currency: plan.currency,
  vatIncluded: plan.vatIncluded,
  unlimitedUsers: plan.maxUsers === null,
  maxUsers: plan.maxUsers === null ? "" : String(plan.maxUsers),
  unlimitedStorage: plan.maxStorageBytes === null,
  maxStorageGb:
    plan.maxStorageBytes === null ? "" : String(bytesToGb(plan.maxStorageBytes)),
  badge: plan.badge ?? "",
  sortOrder: String(plan.sortOrder),
  isPublic: plan.isPublic,
  isActive: plan.isActive,
});

const toNullableText = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

const toNullableNumber = (value: string): number | null => {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

/** The editable fields shared by the create and update payloads. */
const buildEditableFields = (
  values: PlanFormValues
): Omit<PlanUpdateRequest, "moduleIds"> => ({
  name: values.name.trim(),
  tagline: toNullableText(values.tagline),
  description: toNullableText(values.description),
  monthlyPrice: Number(values.monthlyPrice),
  // Cleared yearly price stays null → the plan is monthly-only.
  yearlyPrice: toNullableNumber(values.yearlyPrice),
  currency: values.currency.trim().toUpperCase(),
  vatIncluded: values.vatIncluded,
  // Null means unlimited — never 0.
  maxUsers: values.unlimitedUsers ? null : Number(values.maxUsers),
  maxStorageBytes: values.unlimitedStorage
    ? null
    : gbToBytes(Number(values.maxStorageGb)),
  badge: toNullableText(values.badge),
  sortOrder: Number(values.sortOrder),
  isPublic: values.isPublic,
  isActive: values.isActive,
});

/**
 * `POST /super-admin/plans`. `code` is uppercase and immutable afterwards;
 * `trialDays` is never sent.
 */
export const buildPlanCreatePayload = (
  values: PlanFormValues,
  moduleIds: string[]
): PlanCreateRequest => ({
  code: values.code.trim().toUpperCase(),
  ...buildEditableFields(values),
  moduleIds,
});

/**
 * `PUT /super-admin/plans/{planId}` — a full replacement.
 *
 * `moduleIds` is omitted when the selection was not touched, which keeps the
 * plan's existing modules; an empty array removes them all.
 */
export const buildPlanUpdatePayload = (
  values: PlanFormValues,
  moduleIds: string[] | undefined
): PlanUpdateRequest => ({
  ...buildEditableFields(values),
  ...(moduleIds ? { moduleIds } : {}),
});
