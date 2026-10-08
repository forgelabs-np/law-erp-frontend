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

/**
 * Role metadata only. Used for the firm role create step, which is a separate
 * call from permission assignment in the current RBAC contract.
 */
export const roleDetailsSchema = yup.object({
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
});

export type RoleSchemaType = yup.InferType<typeof roleSchema>;
export type RoleDetailsSchemaType = yup.InferType<typeof roleDetailsSchema>;
