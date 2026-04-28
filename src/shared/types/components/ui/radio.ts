import { RadioGroup as ChakraRadioGroup } from "@chakra-ui/react";

export type ChakraRadioProps = ChakraRadioGroup.ItemProps & {
  rootRef?: React.Ref<HTMLDivElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};
