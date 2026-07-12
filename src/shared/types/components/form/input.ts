import React from "react";

type BasicInputProps = {
  name: string;

  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
};

export type TextFieldInputProps = BasicInputProps & {
  type?: "text" | "password" | "date" | "number" | "email";

  endElement?: React.ReactNode;
  startElement?: React.ReactNode;

  autoComplete?: string;
};

export type PasswordInputProps = BasicInputProps;

export type MobileNumberInputProps = BasicInputProps;

export type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;

  placeholder?: string;
};
