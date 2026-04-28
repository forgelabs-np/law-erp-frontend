import { Checkbox as ChakraCheckbox } from "@chakra-ui/react";

export type CheckboxProps = ChakraCheckbox.RootProps & {
  icon?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  rootRef?: React.Ref<HTMLLabelElement>;
};
