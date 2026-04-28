import { GroupBase, OptionProps, SingleValueProps } from "react-select";

export type SelectOptionType = {
  label: string;
  value: string;
};

export type ReactSelectProps = {
  name: string;
  options: SelectOptionType[];

  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  extraOnChange?: (value: string | string[]) => void;

  isMulti?: boolean;
  isSearchable?: boolean;
};

export type CountrySelectOption = {
  flag: string;
  label: string;
  value: number;
};

export type CustomCountryOptionProps = OptionProps<
  unknown,
  boolean,
  GroupBase<unknown>
>;

export type CustomSingleValueProps = SingleValueProps<
  unknown,
  boolean,
  GroupBase<unknown>
>;

export type CountrySelectProps = Omit<ReactSelectProps, "options">;
