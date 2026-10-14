import { Checkbox as ChakraCheckbox } from "@chakra-ui/react";
import React from "react";

import { CheckboxProps } from "@/shared/types";

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    const {
      icon,
      children,
      inputProps,
      rootRef,
      cursor = "pointer",
      ...rest
    } = props;
    return (
      <ChakraCheckbox.Root
        ref={rootRef}
        cursor={cursor}
        _disabled={{ cursor: "not-allowed" }}
        {...rest}
      >
        <ChakraCheckbox.HiddenInput ref={ref} {...inputProps} />
        <ChakraCheckbox.Control
          cursor={cursor}
          _disabled={{ cursor: "not-allowed" }}
        >
          {icon || <ChakraCheckbox.Indicator />}
        </ChakraCheckbox.Control>
        {children != null && (
          <ChakraCheckbox.Label
            cursor={cursor}
            _disabled={{ cursor: "not-allowed" }}
          >
            {children}
          </ChakraCheckbox.Label>
        )}
      </ChakraCheckbox.Root>
    );
  }
);
