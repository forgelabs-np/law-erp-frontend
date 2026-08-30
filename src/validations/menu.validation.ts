import * as yup from "yup";

const subMenuSchema = yup.object({
  id: yup.string().notRequired(),
  displayOrder: yup.string().trim().required("Display order is required"),
  menuName: yup
    .string()
    .trim()
    .required("Sub-menu name is required")
    .min(2, "Sub-menu name must be at least 2 characters"),
  menuCode: yup
    .string()
    .trim()
    .required("Sub-menu code is required")
    .min(2, "Sub-menu code must be at least 2 characters"),
  privilege: yup
    .array()
    .of(yup.string().defined())
    .min(1, "Select at least one privilege for each sub-menu"),
});

export const menuSchema = yup.object({
  menu: yup.object({
    displayOrder: yup.string().trim().required("Display order is required"),
    menuName: yup
      .string()
      .trim()
      .required("Menu name is required")
      .min(2, "Menu name must be at least 2 characters"),
    menuCode: yup
      .string()
      .trim()
      .required("Menu code is required")
      .min(2, "Menu code must be at least 2 characters"),
    privilege: yup
      .array()
      .of(yup.string().defined())
      .min(1, "Select at least one privilege"),
    subMenus: yup.array().of(subMenuSchema).notRequired(),
    moduleType: yup.string().notRequired(),
  }),
});

export type MenuSchemaType = yup.InferType<typeof menuSchema>;
