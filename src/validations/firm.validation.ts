import * as yup from "yup";

// ─── Shared Regex ───────────────────────────────────────────────────────────────
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// ─── Reusable Phone Number Schema ───────────────────────────────────────────────
export const phoneNumberSchema = (validationName?: string) => {
  validationName = validationName ?? "Phone Number";

  return yup
    .string()
    .trim()
    .required(`${validationName} is required`)
    .test(
      "is-valid-phone-number",
      `${validationName} is not valid`,
      (value) => {
        if (!value) return false;
        // should be numeric
        if (+value !== +value) return false;
        // should not contain negative sign (-)
        if (value.includes("-")) return false;
        // should start from either 98 or 97
        if (!value.startsWith("98") && !value.startsWith("97")) return false;
        return true;
      }
    )
    .test(
      "is-valid-length",
      `${validationName} should be 10 characters`,
      (value) => !!value && value.length === 10
    );
};

// ─── Reusable Email Schema ──────────────────────────────────────────────────────
export const emailRequiredSchema = (
  validationName: string,
  max: number = 100
) => {
  return yup
    .string()
    .trim()
    .max(max, `${validationName} should not exceed ${max} characters`)
    .required(`${validationName} is required`)
    .matches(emailRegex, `${validationName} is not valid`);
};

// ─── Firm Schema ────────────────────────────────────────────────────────────────
export const firmSchema = yup.object({
  lawFirmCode: yup.string().trim().notRequired(),
  name: yup
    .string()
    .trim()
    .required("Firm name is required")
    .min(2, "Firm name must be at least 2 characters"),
  firmType: yup.string().required("Firm type is required"),
  email: emailRequiredSchema("Firm email"),
  phone: phoneNumberSchema("Phone Number"),
  address: yup.string().trim().required("Address is required"),
  jurisdiction: yup.string().trim().required("Jurisdiction is required"),
  adminUsername: yup
    .string()
    .trim()
    .required("Admin username is required")
    .min(3, "Username must be at least 3 characters"),
  adminEmail: emailRequiredSchema("Admin email"),
  adminMobileNo: phoneNumberSchema("Admin mobile number"),
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
