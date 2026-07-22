import { HStack, PinInput } from "@chakra-ui/react";
import React from "react";

export interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  isDisabled?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 6,
  isDisabled = false,
}) => {
  // Ensure we always pass an array of the exact length to prevent "undefined"
  const paddedValue = Array.from({ length }, (_, i) => value[i] || "");

  return (
    <HStack gap={4} justify="center">
      <PinInput.Root
        value={paddedValue}
        onValueChange={(e) => onChange(e.valueAsString)}
        autoFocus
        disabled={isDisabled}
      >
        <PinInput.HiddenInput />
        <PinInput.Control>
          {Array.from({ length }).map((_, index) => (
            <PinInput.Input key={index} index={index} />
          ))}
        </PinInput.Control>
      </PinInput.Root>
    </HStack>
  );
};
