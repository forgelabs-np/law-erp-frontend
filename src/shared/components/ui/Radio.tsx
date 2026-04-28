import { RadioGroup } from "@chakra-ui/react";
import React from "react";

import { ChakraRadioProps } from "@/shared/types";

export const ChakraRadio = React.forwardRef<HTMLInputElement, ChakraRadioProps>(
  function Radio(props, ref) {
    const { children, inputProps, rootRef, ...rest } = props;
    return (
      <RadioGroup.Item ref={rootRef} {...rest}>
        <RadioGroup.ItemHiddenInput ref={ref} {...inputProps} />
        <RadioGroup.ItemIndicator />
        {children && <RadioGroup.ItemText>{children}</RadioGroup.ItemText>}
      </RadioGroup.Item>
    );
  }
);

export const ChakraRadioGroup = RadioGroup.Root;
