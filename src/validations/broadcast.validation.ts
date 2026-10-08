import * as yup from "yup";

export const broadcastSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Title is required")
    .max(200, "Title must be at most 200 characters"),
  body: yup
    .string()
    .trim()
    .required("Message is required")
    .max(2000, "Message must be at most 2000 characters"),
  audience: yup.string().required("Audience is required"),
});

export type BroadcastSchemaType = yup.InferType<typeof broadcastSchema>;
