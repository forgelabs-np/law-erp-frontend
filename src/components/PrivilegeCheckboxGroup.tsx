import {
  Box,
  Flex,
  Grid,
  HStack,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

import { Checkbox, Switch } from "@/shared/components/ui";
import { SelectOptionType } from "@/shared/types";
import { capitalizeWords } from "@/shared/utils/captlizeWords";

function CheckboxGroup({
  value,
  onChange,
  label,
  options,
}: CheckboxGroupProps) {
  const allChecked =
    options.length > 0 &&
    options
      .filter((opt) => !opt.disabled)
      .every((opt) => value.includes(opt.value));

  const toggleAll = (details: { checked: boolean | "indeterminate" }) => {
    if (details.checked === true) {
      // Enable all non-disabled options
      const enabledOptions = options
        .filter((o) => !o.disabled)
        .map((o) => o.value);
      onChange(enabledOptions);
    } else {
      // Disable all non-disabled options (keep only disabled ones that were selected)
      const disabledOptionValues = options
        .filter((o) => o.disabled)
        .map((o) => o.value);
      const currentlySelectedDisabled = value.filter((v) =>
        disabledOptionValues.includes(v)
      );
      onChange(currentlySelectedDisabled);
    }
  };

  const toggleOption = (option: string, checked: boolean | "indeterminate") => {
    // Guard: do not allow toggling disabled/inactive permissions
    const opt = options.find((o) => o.value === option);
    if (opt?.disabled) return;
    const next =
      checked === true ? [...value, option] : value.filter((v) => v !== option);
    onChange(next);
  };

  return (
    <VStack w="full" align="stretch" gap={0}>
      {/* Header Row: Label + Enable All */}
      <Flex
        w="full"
        justifyContent="space-between"
        alignItems="center"
        px={{ base: 3, md: 4 }}
        py={3}
        bg="gray.50"
        borderTopRadius="lg"
      >
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="600"
          color="gray.700"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          {capitalizeWords(label)}
        </Text>
        {options.length > 1 && (
          <HStack
            gap={2}
            cursor="pointer"
            px={3}
            py={1.5}
            borderRadius="md"
            _hover={{ bg: "primary.50" }}
            transition="backgrounds 150ms ease"
            role="group"
            aria-label="Toggle all permissions"
          >
            <Switch checked={allChecked} onCheckedChange={toggleAll} />
            <Text
              fontSize="xs"
              fontWeight="600"
              color={allChecked ? "primary.600" : "gray.600"}
              transition="colors 150ms ease"
            >
              Enable All
            </Text>
          </HStack>
        )}
      </Flex>

      {/* Permission Options Grid */}
      <Box px={{ base: 3, md: 4 }} py={3}>
        <Grid
          w="full"
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(auto-fit, minmax(140px, 1fr))",
          }}
          gap={{ base: 1, md: 2 }}
        >
          {options.map((opt) => {
            const isDisabled = opt.disabled === true;
            return (
              <Flex
                key={opt.value}
                alignItems="center"
                gap={2.5}
                px={3}
                py={2}
                borderRadius="md"
                cursor={isDisabled ? "not-allowed" : "pointer"}
                opacity={isDisabled ? 0.5 : 1}
                _hover={!isDisabled ? { bg: "lavender.50" } : undefined}
                _focusWithin={{ ring: "2px", ringColor: "primary.400" }}
                transition="backgrounds 150ms ease, opacity 150ms ease"
                minH="40px"
                role="checkbox"
                aria-checked={value.includes(opt.value)}
                aria-disabled={isDisabled}
                aria-label={`Permission: ${opt.label}${isDisabled ? " (inactive)" : ""}`}
                title={
                  isDisabled
                    ? "This permission is currently inactive"
                    : undefined
                }
              >
                <Checkbox
                  checked={value.includes(opt.value)}
                  onCheckedChange={(e) =>
                    toggleOption(
                      opt.value,
                      (e as { checked: boolean | "indeterminate" }).checked
                    )
                  }
                  disabled={isDisabled}
                  cursor={isDisabled ? "not-allowed" : "pointer"}
                  size="sm"
                  aria-label={opt.label}
                />
                <Text
                  fontSize={{ base: "sm", md: "sm" }}
                  color={isDisabled ? "gray.400" : "gray.700"}
                  fontWeight="400"
                  lineHeight="short"
                  userSelect="none"
                  truncate
                >
                  {opt.label}
                </Text>
              </Flex>
            );
          })}
        </Grid>
      </Box>
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
          <VStack w="full" align="stretch" gap={1}>
            <CheckboxGroup
              value={value}
              onChange={field.onChange}
              label={label}
              options={options}
            />
            {error?.message && (
              <Text color="red.500" fontSize="sm" px={4}>
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
