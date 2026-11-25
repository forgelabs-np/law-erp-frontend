import * as yup from "yup";

/**
 * Plan form values. Numeric inputs are kept as strings because the shared
 * `TextFieldInput` is a plain text control; values are converted to numbers
 * (and GB → bytes) only when the request payload is built.
 */
export interface PlanFormValues {
  code: string;
  name: string;
  tagline: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  currency: string;
  vatIncluded: boolean;
  unlimitedUsers: boolean;
  maxUsers: string;
  unlimitedStorage: boolean;
  maxStorageGb: string;
  badge: string;
  sortOrder: string;
  isPublic: boolean;
  isActive: boolean;
}

const isBlank = (value: string | undefined | null) => !value || !value.trim();

/** A non-negative number field, optionally required. */
const amountField = (label: string, required: boolean) =>
  yup
    .string()
    .trim()
    .test(
      "required",
      `${label} is required`,
      (value) => !required || !isBlank(value)
    )
    .test(
      "non-negative-number",
      `${label} must be 0 or greater`,
      (value) => {
        if (isBlank(value)) return true;
        const parsed = Number(value);
        return !Number.isNaN(parsed) && parsed >= 0;
      }
    );

export const planSchema = yup.object({
  code: yup.string().when("$isEdit", {
    is: true,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) =>
      schema
        .trim()
        .required("Plan code is required")
        .max(30, "Plan code must be 30 characters or fewer")
        .matches(
          /^[A-Za-z][A-Za-z0-9_]*$/,
          "Plan code must start with a letter and use only letters, numbers and underscores"
        ),
  }),
  name: yup
    .string()
    .trim()
    .required("Plan name is required")
    .max(60, "Plan name must be 60 characters or fewer"),
  tagline: yup.string().trim().notRequired(),
  description: yup.string().trim().notRequired(),
  monthlyPrice: amountField("Monthly price", true),
  yearlyPrice: amountField("Yearly price", false),
  currency: yup
    .string()
    .trim()
    .required("Currency is required")
    .length(3, "Currency must be exactly 3 characters"),
  vatIncluded: yup.boolean().default(false),
  unlimitedUsers: yup.boolean().default(false),
  maxUsers: yup.string().when("unlimitedUsers", {
    is: true,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) =>
      schema
        .trim()
        .required("User limit is required")
        .test(
          "valid-user-limit",
          "User limit must be a whole number of at least 1",
          (value) => {
            if (isBlank(value)) return false;
            const parsed = Number(value);
            return Number.isInteger(parsed) && parsed >= 1;
          }
        ),
  }),
  unlimitedStorage: yup.boolean().default(false),
  maxStorageGb: yup.string().when("unlimitedStorage", {
    is: true,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) =>
      schema
        .trim()
        .required("Storage limit is required")
        .test(
          "valid-storage-limit",
          "Storage limit must be greater than 0 GB",
          (value) => {
            if (isBlank(value)) return false;
            const parsed = Number(value);
            return !Number.isNaN(parsed) && parsed > 0;
          }
        ),
  }),
  badge: yup.string().trim().notRequired(),
  sortOrder: yup
    .string()
    .trim()
    .required("Sort order is required")
    .test(
      "valid-sort-order",
      "Sort order must be a whole number of 0 or greater",
      (value) => {
        if (isBlank(value)) return false;
        const parsed = Number(value);
        return Number.isInteger(parsed) && parsed >= 0;
      }
    ),
  isPublic: yup.boolean().default(true),
  isActive: yup.boolean().default(true),
});

export type PlanSchemaType = yup.InferType<typeof planSchema>;
