import * as yup from "yup";

export const permissionSchema = yup.object({
  permission: yup.object({
    moduleId: yup.string().required("Module is required"),
    action: yup.string().required("Action is required"),
    scope: yup.string().required("Scope is required"),
    code: yup
      .string()
      .trim()
      .required("Code is required")
      .min(2, "Code must be at least 2 characters"),
    description: yup.string().trim().notRequired(),
  }),
});

export type PermissionSchemaType = yup.InferType<typeof permissionSchema>;
