import { HStack } from "@chakra-ui/react";
import { useController, useFormContext } from "react-hook-form";

import { RadioGroupProps } from "@/shared/types";

import { ChakraRadio, ChakraRadioGroup } from "../../ui";

export const RadioGroup = ({ name, options }: RadioGroupProps) => {
  // prevent unintentional crashing in case of dynamic options
  if (!Array.isArray(options)) options = [];

  const { control } = useFormContext();

  const { field } = useController({
    name,
    control,
  });

  const { value, onChange } = field;

  return (
    <ChakraRadioGroup
      value={value}
      onValueChange={(event) => onChange(event.value)}
    >
      <HStack gap="6">
        {options.map((option) => (
          <ChakraRadio key={option?.value} value={option?.value}>
            {option?.label}
          </ChakraRadio>
        ))}
      </HStack>
    </ChakraRadioGroup>
  );
};
