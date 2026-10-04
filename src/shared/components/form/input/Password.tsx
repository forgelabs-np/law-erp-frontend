import { Grid, useDisclosure } from "@chakra-ui/react";
import { useController, useFormContext } from "react-hook-form";

import { EyeCloseIcon, EyeOpenIcon } from "@/shared/assets";
import { PasswordInputProps } from "@/shared/types";

import { TextFieldInput } from "./TextField";

export const PasswordInput = ({
  name,
  inputHeight,
  inputBorderRadius,
  variant,
  hideLabel,
  ...restProps
}: PasswordInputProps & {
  inputHeight?: string;
  inputBorderRadius?: string;
  variant?: "default" | "authPill";
  hideLabel?: boolean;
}) => {
  const { open, onToggle } = useDisclosure();

  const { control } = useFormContext();

  const { field } = useController({
    control,
    name: name,
  });

  const isAuthPill = variant === "authPill";
  const isIconVisible = field.value?.length > 0;

  return (
    <TextFieldInput
      {...restProps}
      name={name}
      type={open ? "text" : "password"}
      autoComplete="new-password"
      inputHeight={inputHeight}
      inputBorderRadius={inputBorderRadius}
      variant={variant}
      hideLabel={hideLabel}
      endElement={
        isIconVisible || isAuthPill ? (
          <Grid
            placeItems="center"
            width={isAuthPill ? "auto" : "10"}
            height="full"
            cursor="pointer"
            onClick={onToggle}
            color={isAuthPill ? "gray.500" : "system.inputGroup.element"}
            css={{
              "& > svg": {
                boxSize: isAuthPill ? "6" : "5",
              },
            }}
            mr={isAuthPill ? "8" : undefined}
          >
            {open ? <EyeOpenIcon /> : <EyeCloseIcon />}
          </Grid>
        ) : undefined
      }
    />
  );
};