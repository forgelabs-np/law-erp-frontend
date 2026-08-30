import * as yup from "yup";

export const configureModuleSchema = yup.object({
  isEnabled: yup.boolean().required(),
  isTrial: yup.boolean().required(),
  trialDays: yup
    .number()
    .typeError("Enter a valid number")
    .min(0, "Trial days cannot be negative")
    .when("isTrial", {
      is: true,
      then: (schema) =>
        schema
          .required("Trial days are required when trial mode is enabled")
          .min(1, "Trial days must be at least 1"),
      otherwise: (schema) => schema.notRequired(),
    }),
  maxFileSizeMb: yup
    .number()
    .typeError("Enter a valid number")
    .min(0, "File size cannot be negative")
    .notRequired(),
  allowedExtensions: yup.string().trim().notRequired(),
  notes: yup.string().trim().notRequired(),
});

export type ConfigureModuleSchemaType = yup.InferType<typeof configureModuleSchema>;
