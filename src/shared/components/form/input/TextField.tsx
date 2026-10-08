import { Input } from "@chakra-ui/react";
import React from "react";
import { useController, useFormContext } from "react-hook-form";

import { TextFieldInputProps } from "@/shared/types";

import { InputGroup } from "../../ui";
import { FormWrapper } from "../wrapper";
import {
  AUTH_PILL_INPUT_PROPS,
  AUTH_PILL_INPUT_STYLE,
  AUTH_PILL_INVALID_STYLE,
} from "./authPill";

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
  inputHeight,
  inputBorderRadius,
  maxLength,
  variant = "default",
  hideLabel = false,
}: TextFieldInputProps & {
  inputHeight?: string;
  inputBorderRadius?: string;
  /**
   * `authPill` opts into the large pill styling used by the authentication
   * screens (rounded, right-aligned icon, borderless label). Defaults to the
   * standard form input so every existing usage stays untouched.
   */
  variant?: "default" | "authPill";
  /**
   * Visually hides the label while keeping it in the accessibility tree.
   * Only used together with `variant="authPill"`.
   */
  hideLabel?: boolean;
}) => {
  const isAuthPill = variant === "authPill";
  const { control } = useFormContext();

  const {
    field: { value, onChange: hookFormOnChange, ref, onBlur },
    fieldState: { error },
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
    <FormWrapper
      label={isAuthPill && hideLabel ? undefined : label}
      disabled={disabled}
      required={required}
      errorText={error?.message}
    >
      <InputGroup
        endElement={endElement}
        startElement={startElement}
        endElementProps={
          isAuthPill ? AUTH_PILL_INPUT_PROPS.endElementProps : undefined
        }
      >
        <Input
          ref={ref}
          type={type}
          maxLength={maxLength}
          value={value ?? ""} // to prevent the error --> component is changing from uncontrolled to controlled
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          aria-label={isAuthPill && hideLabel ? label : undefined}
          paddingLeft={
            startElement && !isAuthPill ? "10 !important" : undefined
          }
          paddingRight={
            endElement && !isAuthPill ? "10 !important" : undefined
          }
          autoComplete={autoComplete}
          height={isAuthPill ? AUTH_PILL_INPUT_PROPS.height : inputHeight}
          fontSize={isAuthPill ? AUTH_PILL_INPUT_PROPS.fontSize : undefined}
          px={isAuthPill ? AUTH_PILL_INPUT_PROPS.px : undefined}
          borderRadius={
            isAuthPill ? AUTH_PILL_INPUT_PROPS.borderRadius : inputBorderRadius
          }
          bg={isAuthPill ? AUTH_PILL_INPUT_PROPS.bg : undefined}
          borderWidth={isAuthPill ? AUTH_PILL_INPUT_PROPS.borderWidth : undefined}
          borderStyle={isAuthPill ? AUTH_PILL_INPUT_PROPS.borderStyle : undefined}
          borderColor={
            isAuthPill
              ? AUTH_PILL_INPUT_PROPS.borderColor
              : error
                ? "red.500"
                : undefined
          }
          _placeholder={
            isAuthPill ? AUTH_PILL_INPUT_PROPS._placeholder : undefined
          }
          _hover={isAuthPill ? AUTH_PILL_INPUT_PROPS._hover : undefined}
          _focusVisible={
            isAuthPill
              ? error
                ? AUTH_PILL_INVALID_STYLE
                : AUTH_PILL_INPUT_STYLE
              : undefined
          }
          _focus={
            isAuthPill
              ? error
                ? AUTH_PILL_INVALID_STYLE
                : AUTH_PILL_INPUT_STYLE
              : undefined
          }
          _disabled={
            isAuthPill ? AUTH_PILL_INPUT_PROPS._disabled : undefined
          }
        />
      </InputGroup>
    </FormWrapper>
  );
};
