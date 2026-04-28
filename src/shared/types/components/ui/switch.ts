import { Switch as ChakraSwitch } from "@chakra-ui/react";
import React from "react";

export type SwitchProps = ChakraSwitch.RootProps & {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  rootRef?: React.Ref<HTMLLabelElement>;
  trackLabel?: { on: React.ReactNode; off: React.ReactNode };
  thumbLabel?: { on: React.ReactNode; off: React.ReactNode };
};
