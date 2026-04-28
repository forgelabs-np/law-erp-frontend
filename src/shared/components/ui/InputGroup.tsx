import type { InputElementProps } from "@chakra-ui/react";
import { Group, InputElement } from "@chakra-ui/react";
import React from "react";

import { InputGroupProps } from "@/shared/types";

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroup(props, ref) {
    const {
      startElement,
      startElementProps,
      endElement,
      endElementProps,
      children,
      startOffset = "6px",
      endOffset = "6px",
      ...rest
    } = props;

    const child =
      React.Children.only<React.ReactElement<InputElementProps>>(children);

    return (
      <Group ref={ref} width="full" {...rest}>
        {startElement && (
          <InputElement pointerEvents="none" {...startElementProps} padding="0">
            {startElement}
          </InputElement>
        )}

        {React.cloneElement(child, {
          ...(startElement && {
            ps: `calc(var(--input-height) - ${startOffset})`,
          }),
          ...(endElement && { pe: `calc(var(--input-height) - ${endOffset})` }),
          ...children.props,
        })}

        {endElement && (
          <InputElement placement="end" {...endElementProps} padding="0">
            {endElement}
          </InputElement>
        )}
      </Group>
    );
  }
);
