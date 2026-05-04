import React from "react";

export type FormWrapperProps = {
  children: React.ReactNode;

  variant?: "editable";
  label?: string;
  disabled?: boolean;
  required?: boolean;
  errorText?: string;
  readOnly?: boolean;
};
