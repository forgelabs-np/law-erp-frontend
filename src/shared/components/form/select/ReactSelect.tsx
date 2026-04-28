import { useController, useFormContext } from "react-hook-form";
import Select from "react-select";

import { SelectOptionType, ReactSelectProps } from "@/shared/types";

import { selectStyles } from "./styles";
import { FormWrapper } from "../wrapper";

export const ReactSelect = ({
  name,
  options,
  label,
  placeholder,
  disabled,
  required,
  isMulti,
  isSearchable = true,
  extraOnChange,
}: ReactSelectProps) => {
  // this prevents the application crash when invalid options is passed
  if (!Array.isArray(options)) options = [];

  const { control } = useFormContext();

  const { field } = useController({
    name,
    control,
  });

  const handleChange = (value: unknown) => {
    if (disabled) return;

    const selectedValue = isMulti
      ? (value as SelectOptionType[])?.map((item) => item.value)
      : (value as SelectOptionType)?.value;

    field.onChange(selectedValue);
    extraOnChange?.(selectedValue);
  };

  const formattedValue = isMulti
    ? options.filter((item) => field.value?.includes(item.value))
    : options.find((item) => item.value === field.value);

  return (
    <FormWrapper label={label} disabled={disabled} required={required}>
      <Select
        isMulti={isMulti}
        value={formattedValue}
        onChange={handleChange}
        options={options}
        styles={selectStyles}
        placeholder={placeholder}
        isDisabled={disabled}
        components={{
          IndicatorSeparator: undefined,
        }}
        closeMenuOnSelect={isMulti ? false : true}
        isSearchable={isSearchable}
      />
    </FormWrapper>
  );
};
