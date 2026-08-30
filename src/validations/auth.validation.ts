import * as yup from "yup";

export const loginSchema = yup.object({
  lawFirmCode: yup.string().trim(),
  username: yup
    .string()
    .trim()
    .required("Username is required")
    .min(1, "Username is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(1, "Password is required"),
});

export const superAdminLoginSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required("Username is required")
    .min(1, "Username is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(1, "Password is required"),
});

export const signupSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters"),
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
  username: yup
    .string()
    .trim()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  barCouncilNumber: yup.string().trim().notRequired(),
  panNumber: yup.string().trim().required("PAN Number is required"),
  address: yup
    .string()
    .trim()
    .required("Address is required")
    .min(2, "Address must be at least 2 characters"),
});

export type LoginSchemaType = yup.InferType<typeof loginSchema>;
export type SuperAdminLoginSchemaType = yup.InferType<
  typeof superAdminLoginSchema
>;
export type SignupSchemaType = yup.InferType<typeof signupSchema>;

// Change Password
export const changePasswordSchema = yup.object({
  newPassword: yup
    .string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

export type ChangePasswordSchemaType = yup.InferType<
  typeof changePasswordSchema
>;

// MFA Verification
export const mfaVerificationSchema = yup.object({
  totpCode: yup
    .string()
    .required("Verification code is required")
    .length(6, "Code must be exactly 6 digits"),
});

export type MfaVerificationSchemaType = yup.InferType<
  typeof mfaVerificationSchema
>;
