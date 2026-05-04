import { Grid, HStack, Separator, Text, VStack } from "@chakra-ui/react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

import { Checkbox, Switch } from "@/shared/components/ui";
import { PRIVILEGE_OPTIONS } from "@/shared/constants/permission";
import { SelectOptionType } from "@/shared/types";
import { capitalizeWords } from "@/shared/utils/captlizeWords";

function CheckboxGroup({
  value,
  onChange,
  label,
  options,
}: CheckboxGroupProps) {
  const allChecked =
    options.length > 0 && options.every((opt) => value.includes(opt.value));

  const toggleAll = (details: { checked: boolean | "indeterminate" }) => {
    onChange(
      details.checked === true ? PRIVILEGE_OPTIONS.map((o) => o.value) : []
    );
  };

  const toggleOption = (option: string, checked: boolean | "indeterminate") => {
    const next =
      checked === true ? [...value, option] : value.filter((v) => v !== option);
    onChange(next);
  };

  return (
    <VStack w="full" borderRadius={12} align="flex-start" gap={2} bg="white">
      <HStack w="full" justifyContent="space-between" alignItems="center">
        <Text textStyle="subtitle_large">{capitalizeWords(label)}</Text>
        {options.length > 1 && (
          <HStack w="fit-content" justifyContent="flex-end" gap={2}>
            <Switch checked={allChecked} onCheckedChange={toggleAll} />
            <Text textStyle="subtitle_large">Enable All</Text>
          </HStack>
        )}
      </HStack>

      <Separator />

      <Grid
        w="full"
        templateColumns="repeat(auto-fit, minmax(100px, 1fr))"
        gap={5}
      >
        {options.map((opt) => (
          <Checkbox
            key={opt.value}
            checked={value.includes(opt.value)}
            onCheckedChange={(e) =>
              toggleOption(
                opt.value,
                (e as { checked: boolean | "indeterminate" }).checked
              )
            }
            cursor="pointer"
            size="sm"
          >
            {opt.label}
          </Checkbox>
        ))}
      </Grid>
    </VStack>
  );
}

export function PrivilegeCheckboxGroup<T extends FieldValues>({
  control,
  name,
  label = "Action Permissions",
  options = [],
}: PrivilegeCheckboxGroupProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const value = Array.isArray(field.value)
          ? (field.value as string[]).filter(
              (v): v is string => typeof v === "string"
            )
          : [];
        return (
          <VStack w="full" align="flex-start" gap={1}>
            <CheckboxGroup
              value={value}
              onChange={field.onChange}
              label={label}
              options={options}
            />
            {error?.message && (
              <Text color="red.500" fontSize="sm">
                {error.message}
              </Text>
            )}
          </VStack>
        );
      }}
    />
  );
}

interface CheckboxGroupProps {
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  options: SelectOptionType[];
}

interface PrivilegeCheckboxGroupProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  options: SelectOptionType[];
}
