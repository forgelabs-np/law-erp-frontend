import * as yup from "yup";

export const roleSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Role name is required")
    .min(2, "Role name must be at least 2 characters"),
  code: yup
    .string()
    .trim()
    .required("Role code is required")
    .min(2, "Role code must be at least 2 characters"),
  description: yup.string().trim().notRequired(),
  permissions: yup
    .object()
    .test(
      "has-permissions",
      "Please select at least one permission",
      (value) => {
        if (!value || typeof value !== "object") return false;
        return Object.values(value).some(
          (arr) => Array.isArray(arr) && arr.length > 0
        );
      }
    ),
});

export type RoleSchemaType = yup.InferType<typeof roleSchema>;

/**
 * Validation for creating a Super Admin custom firm role.
 * parentRoleId is REQUIRED by the backend (the permission ceiling anchor)
 * and must reference an active system template other than SUPER_ADMIN.
 */
export const firmRoleSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Role name is required")
    .min(2, "Role name must be at least 2 characters"),
  code: yup
    .string()
    .trim()
    .required("Role code is required")
    .min(2, "Role code must be at least 2 characters"),
  description: yup.string().trim().notRequired(),
  isActive: yup.boolean().required(),
  parentRoleId: yup
    .string()
    .required("Base template is required")
    .test(
      "not-super-admin",
      "SUPER_ADMIN cannot be used as a base template",
      (value) => value !== "SUPER_ADMIN"
    ),
  permissions: yup
    .object()
    .test(
      "has-permissions",
      "Please select at least one permission",
      (value) => {
        if (!value || typeof value !== "object") return false;
        return Object.values(value).some(
          (arr) => Array.isArray(arr) && arr.length > 0
        );
      }
    ),
});

export type FirmRoleSchemaType = yup.InferType<typeof firmRoleSchema>;

export const firmRoleFormSchema = firmRoleSchema.pick([
  "name",
  "code",
  "description",
  "isActive",
  "parentRoleId",
]);

export type FirmRoleFormSchemaType = yup.InferType<typeof firmRoleFormSchema>;

/** Form-level schema for the Create Firm Role drawer (before permission assignment). */
export const firmRoleCreateFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Role name is required")
    .min(2, "Role name must be at least 2 characters"),
  code: yup
    .string()
    .trim()
    .required("Role code is required")
    .min(2, "Role code must be at least 2 characters"),
  description: yup.string().trim().notRequired(),
  isActive: yup.boolean().required(),
  parentRoleId: yup
    .string()
    .required("Base template is required")
    .test(
      "not-super-admin",
      "SUPER_ADMIN cannot be used as a base template",
      (value) => value !== "SUPER_ADMIN"
    ),
});

export type FirmRoleCreateFormSchemaType = yup.InferType<
  typeof firmRoleCreateFormSchema
>;

