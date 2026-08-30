import { FormWrapperProps } from "@/shared/types";

import { Field } from "../../ui";

export const FormWrapper = ({
  children,
  label,
  disabled,
  required,
  errorText,
}: FormWrapperProps) => {
  return (
    <Field
      label={label}
      disabled={disabled}
      required={required}
      errorText={errorText}
      invalid={!!errorText}
    >
      {children}
    </Field>
  );
};
