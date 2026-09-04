import { HStack, IconButton, PinInput } from "@chakra-ui/react";
import React from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

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
  const [isVisible, setIsVisible] = React.useState(false);

  // Ensure we always pass an array of the exact length to prevent "undefined"
  const paddedValue = Array.from({ length }, (_, i) => value[i] || "");

  const toggleVisibility = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    if (e.button !== 0) return;
    // Prevent the button from stealing focus from the OTP inputs
    e.preventDefault();
    setIsVisible((prev) => !prev);
  };

  return (
    <HStack gap={4} justify="center" wrap="wrap">
      <PinInput.Root
        value={paddedValue}
        onValueChange={(e) => onChange(e.valueAsString)}
        autoFocus
        disabled={isDisabled}
        mask={!isVisible}
      >
        <PinInput.HiddenInput />
        <PinInput.Control>
          {Array.from({ length }).map((_, index) => (
            <PinInput.Input key={index} index={index} />
          ))}
        </PinInput.Control>
      </PinInput.Root>
      <IconButton
        tabIndex={-1}
        variant="ghost"
        size="sm"
        aria-label={isVisible ? "Hide OTP" : "Show OTP"}
        disabled={isDisabled}
        onPointerDown={toggleVisibility}
      >
        {isVisible ? <LuEyeOff /> : <LuEye />}
      </IconButton>
    </HStack>
  );
};
