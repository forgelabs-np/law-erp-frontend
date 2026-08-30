import * as yup from "yup";

export const clientSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  username: yup
    .string()
    .trim()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address"),
  mobileNo: yup
    .string()
    .trim()
    .required("Mobile number is required")
    .min(10, "Enter a valid mobile number"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  portalAccessEnabled: yup.boolean().required(),
});

export type ClientSchemaType = yup.InferType<typeof clientSchema>;
