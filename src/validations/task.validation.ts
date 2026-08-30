import * as yup from "yup";

export const createTaskSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Task title is required")
    .min(2, "Task title must be at least 2 characters"),
  description: yup.string().trim().notRequired(),
  taskType: yup.string().required("Task type is required"),
  priority: yup.string().required("Priority is required"),
  status: yup.string().notRequired(),
  assignedLawyer: yup.string().trim().notRequired(),
  client: yup.string().trim().notRequired(),
  startDate: yup.string().notRequired(),
  endDate: yup.string().notRequired(),
});

export type CreateTaskSchemaType = yup.InferType<typeof createTaskSchema>;
