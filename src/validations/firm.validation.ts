import * as yup from "yup";

export const firmSchema = yup.object({
  lawFirmCode: yup.string().trim().notRequired(),
  name: yup
    .string()
    .trim()
    .required("Firm name is required")
    .min(2, "Firm name must be at least 2 characters"),
  firmType: yup.string().required("Firm type is required"),
  email: yup
    .string()
    .trim()
    .required("Firm email is required")
    .email("Enter a valid email address"),
  phone: yup
    .string()
    .trim()
    .required("Phone number is required")
    .min(10, "Enter a valid phone number"),
  address: yup.string().trim().required("Address is required"),
  jurisdiction: yup.string().trim().required("Jurisdiction is required"),
  adminUsername: yup
    .string()
    .trim()
    .required("Admin username is required")
    .min(3, "Username must be at least 3 characters"),
  adminEmail: yup
    .string()
    .trim()
    .required("Admin email is required")
    .email("Enter a valid email address"),
  adminMobileNo: yup
    .string()
    .trim()
    .required("Admin mobile number is required")
    .min(10, "Enter a valid mobile number"),
  adminPassword: yup.string().when("$isEdit", {
    is: false,
    then: (schema) =>
      schema
        .required("Admin password is required")
        .min(6, "Password must be at least 6 characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
  adminFullName: yup
    .string()
    .trim()
    .required("Admin full name is required")
    .min(2, "Admin full name must be at least 2 characters"),
});

export type FirmSchemaType = yup.InferType<typeof firmSchema>;
