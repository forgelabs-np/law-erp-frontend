import { Input } from "@chakra-ui/react";
import React from "react";
import { useController, useFormContext } from "react-hook-form";

import { TextFieldInputProps } from "@/shared/types";

import { InputGroup } from "../../ui";
import { FormWrapper } from "../wrapper";

export const TextFieldInput = ({
  type = "text",
  name,
  label,
  placeholder,
  disabled,
  required,
  onChange,
  endElement,
  startElement,
  autoComplete,
}: TextFieldInputProps) => {
  const { control } = useFormContext();

  const {
    field: { value, onChange: hookFormOnChange, ref, onBlur },
  } = useController({
    name,
    control,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const value = event.target.value;

    if (onChange) onChange(value);
    hookFormOnChange(value);
  };

  return (
    <FormWrapper label={label} disabled={disabled} required={required}>
      <InputGroup endElement={endElement} startElement={startElement}>
        <Input
          ref={ref}
          type={type}
          value={value ?? ""} // to prevent the error --> component is changing from uncontrolled to controlled
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          paddingLeft={startElement ? "10 !important" : undefined}
          paddingRight={endElement ? "10 !important" : undefined}
          autoComplete={autoComplete}
        />
      </InputGroup>
    </FormWrapper>
  );
};
