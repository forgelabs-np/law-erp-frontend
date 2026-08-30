import * as yup from "yup";

export const employeeSchema = yup.object({
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
  password: yup.string().when("$isEdit", {
    is: false,
    then: (schema) =>
      schema
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
  roleId: yup.string().required("Role is required"),
  designation: yup
    .string()
    .trim()
    .required("Designation is required"),
  departmentId: yup
    .string()
    .trim()
    .required("Department is required"),
  barCouncilNo: yup.string().trim().notRequired(),
  specialization: yup.string().trim().notRequired(),
  joiningDate: yup
    .string()
    .required("Joining date is required"),
  emergencyContactName: yup.string().trim().notRequired(),
  emergencyContactPhone: yup.string().trim().notRequired(),
  notes: yup.string().trim().notRequired(),
});

export type EmployeeSchemaType = yup.InferType<typeof employeeSchema>;
