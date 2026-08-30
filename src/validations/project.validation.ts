import * as yup from "yup";

export const projectSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Project name is required")
    .min(2, "Project name must be at least 2 characters")
    .max(200, "Project name must not exceed 200 characters"),
  clientName: yup
    .string()
    .trim()
    .required("Client name is required")
    .min(2, "Client name must be at least 2 characters")
    .max(200, "Client name must not exceed 200 characters"),
  clientUserId: yup.string().notRequired(),
  ownerId: yup.string().required("Project owner is required"),
  startDate: yup
    .string()
    .required("Start date is required"),
  targetEndDate: yup
    .string()
    .when("startDate", {
      is: (val: string) => !!val,
      then: (schema) =>
        schema.test(
          "is-after-start",
          "End date cannot be before start date",
          (value, context) => {
            if (!value) return true;
            return value >= (context.parent.startDate || "");
          }
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
  description: yup.string().trim().notRequired().max(1000, "Description must not exceed 1000 characters"),
});

export type ProjectSchemaType = yup.InferType<typeof projectSchema>;

// Credential Form
export const credentialSchema = yup.object({
  siteName: yup
    .string()
    .trim()
    .required("Site name is required"),
  siteType: yup
    .string()
    .trim()
    .required("Site type is required"),
  siteUrl: yup.string().trim().notRequired(),
  usernameOrEmail: yup
    .string()
    .trim()
    .required("Username or email is required"),
  password: yup.string().when("$isEdit", {
    is: false,
    then: (schema) => schema.required("Password is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  contactPerson: yup.string().trim().notRequired(),
  contactPhone: yup.string().trim().notRequired(),
  contactEmail: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .notRequired(),
  notes: yup.string().trim().notRequired(),
});

export type CredentialSchemaType = yup.InferType<typeof credentialSchema>;
