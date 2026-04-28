import type { ButtonProps } from "@chakra-ui/react";
import { IconButton as ChakraIconButton } from "@chakra-ui/react";
import React from "react";

import { CloseIcon } from "@/shared/assets";

export const CloseButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function CloseButton(props, ref) {
    return (
      <ChakraIconButton variant="ghost" aria-label="Close" ref={ref} {...props}>
        {props.children ?? <CloseIcon />}
      </ChakraIconButton>
    );
  }
);
