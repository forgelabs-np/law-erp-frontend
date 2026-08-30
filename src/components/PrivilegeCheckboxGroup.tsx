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
    options.length > 0 && options.every((opt) => value.includes(opt.value));

  const toggleAll = (details: { checked: boolean | "indeterminate" }) => {
    onChange(details.checked === true ? options.map((o) => o.value) : []);
  };

  const toggleOption = (option: string, checked: boolean | "indeterminate") => {
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
            <Switch
              checked={allChecked}
              onCheckedChange={toggleAll}
            />
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
          {options.map((opt) => (
            <Flex
              key={opt.value}
              alignItems="center"
              gap={2.5}
              px={3}
              py={2}
              borderRadius="md"
              cursor="pointer"
              _hover={{ bg: "lavender.50" }}
              _focusWithin={{ ring: "2px", ringColor: "primary.400" }}
              transition="backgrounds 150ms ease"
              minH="40px"
              role="checkbox"
              aria-checked={value.includes(opt.value)}
              aria-label={`Permission: ${opt.label}`}
            >
              <Checkbox
                checked={value.includes(opt.value)}
                onCheckedChange={(e) =>
                  toggleOption(
                    opt.value,
                    (e as { checked: boolean | "indeterminate" }).checked
                  )
                }
                cursor="pointer"
                size="sm"
                aria-label={opt.label}
              />
              <Text
                fontSize={{ base: "sm", md: "sm" }}
                color="gray.700"
                fontWeight="400"
                lineHeight="short"
                userSelect="none"
                truncate
              >
                {opt.label}
              </Text>
            </Flex>
          ))}
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
