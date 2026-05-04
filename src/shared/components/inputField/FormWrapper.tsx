import { FormWrapperProps } from "@/shared/types";

import { Field } from "../ui";

export const FormWrapper = ({
  children,
  label,
  disabled,
  required,
  errorText,
  readOnly,
}: FormWrapperProps) => {
  return (
    <Field
      label={label}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      errorText={errorText}
      invalid={!!errorText}
    >
      {children}
    </Field>
  );
};
