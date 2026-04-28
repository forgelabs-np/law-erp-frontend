import { useController, useFormContext } from "react-hook-form";
import Select from "react-select";

import { ChinaFlag, IndiaFlag, NepalFlag } from "@/shared/assets";
import {
  SelectOptionType,
  CountrySelectProps,
  CountrySelectOption,
} from "@/shared/types";

import { CustomCountryOption } from "./CustomCountryOption";
import { CustomCountrySingleValue } from "./CustomCountrySingleValue";
import { FormWrapper } from "../../wrapper";
import { selectStyles } from "../styles";

const countryOptions: CountrySelectOption[] = [
  {
    flag: NepalFlag,
    label: "Nepal",
    value: 1,
  },
  {
    flag: IndiaFlag,
    label: "India",
    value: 2,
  },
  {
    flag: ChinaFlag,
    label: "China",
    value: 3,
  },
];

export const CountrySelect = ({
  name,
  label,
  placeholder,
  disabled,
  required,
  isMulti,
}: CountrySelectProps) => {
  const { control } = useFormContext();

  const { field } = useController({
    name,
    control,
  });

  const { value, onChange } = field;

  const handleChange = (value: unknown) => {
    if (disabled) return;

    const selectedOption = value as SelectOptionType;
    onChange(selectedOption?.value);
  };

  const formattedValue = countryOptions?.find((item) => item.value === value);

  return (
    <FormWrapper label={label} disabled={disabled} required={required}>
      <Select
        isMulti={isMulti}
        value={formattedValue}
        onChange={handleChange}
        options={countryOptions}
        styles={selectStyles}
        placeholder={placeholder}
        isDisabled={disabled}
        components={{
          Option: CustomCountryOption,
          SingleValue: CustomCountrySingleValue,
          IndicatorSeparator: undefined,
        }}
        closeMenuOnSelect={isMulti ? false : true}
      />
    </FormWrapper>
  );
};
