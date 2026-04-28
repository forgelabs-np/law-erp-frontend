import {
  CheckboxGroup as ChakraCheckboxGroup,
  Fieldset,
} from "@chakra-ui/react";
import { useController, useFormContext } from "react-hook-form";

import { CheckboxGroupProps } from "@/shared/types";

import { Checkbox } from "../../ui";

export const CheckboxGroup = ({ name, options, label }: CheckboxGroupProps) => {
  // prevent unintentional crashing in case of dynamic options
  if (!Array.isArray(options)) options = [];

  const { control } = useFormContext();

  const { field } = useController({
    name,
    control,
  });

  const { value, onChange } = field;

  return (
    <Fieldset.Root>
      <ChakraCheckboxGroup name={name} value={value} onValueChange={onChange}>
        {label && (
          <Fieldset.Legend fontSize="sm" mb="2">
            {label}
          </Fieldset.Legend>
        )}

        <Fieldset.Content>
          {options.map((option) => (
            <Checkbox key={option?.value} value={option?.value}>
              {option?.label}
            </Checkbox>
          ))}
        </Fieldset.Content>
      </ChakraCheckboxGroup>
    </Fieldset.Root>
  );
};
