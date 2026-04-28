import React from "react";

export type FormWrapperProps = {
  children: React.ReactNode;

  label?: string;
  disabled?: boolean;
  required?: boolean;
};
