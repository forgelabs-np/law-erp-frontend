import { FormWrapperProps } from "@/shared/types";

import { Field } from "../../ui";

export const FormWrapper = ({
  children,
  label,
  disabled,
  required,
}: FormWrapperProps) => {
  return (
    <Field label={label} disabled={disabled} required={required}>
      {children}
    </Field>
  );
};
