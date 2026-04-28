import { Field as ChakraField } from "@chakra-ui/react";

export type FieldProps = Omit<ChakraField.RootProps, "label"> & {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  optionalText?: React.ReactNode;
};
