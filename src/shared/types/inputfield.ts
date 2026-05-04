import { InputProps } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface InputFieldProps<T extends FieldValues = FieldValues>
  extends InputProps {
  control: Control<T, unknown>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  uppercase?: boolean;
  rightIcon?: ReactNode;
  capitalizeFirst?: boolean;
  minValueMarginAsZero?: boolean;
  customRegex?: RegExp;
  onAdditionalChange?: (e: string) => void;
  handleChange?: (e?: string) => void;
  onAdditionalBlur?: (e: string | number) => void;
  restrictSpace?: boolean;
  restrictDecimal?: boolean;
  hasColorPicker?: boolean;
  subtype?: string;
  filteredDate?: number;
  formatWithCommas?: boolean;
}

export type { InputFieldProps };
