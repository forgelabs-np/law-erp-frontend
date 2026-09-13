import * as yup from "yup";

export const configureModuleSchema = yup.object({
  maxFileSizeMb: yup
    .number()
    .typeError("Enter a valid number")
    .min(0, "File size cannot be negative")
    .notRequired(),
  allowedExtensions: yup.string().trim().notRequired(),
  notes: yup.string().trim().notRequired(),
});

export type ConfigureModuleSchemaType = yup.InferType<
  typeof configureModuleSchema
>;
