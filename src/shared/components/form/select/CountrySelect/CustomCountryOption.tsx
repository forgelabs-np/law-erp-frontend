import { Box, HStack, Image, Text } from "@chakra-ui/react";

import { CountrySelectOption, CustomCountryOptionProps } from "@/shared/types";

export const CustomCountryOption = (props: CustomCountryOptionProps) => {
  const { innerProps, innerRef, data, getStyles } = props;

  const { onClick, onMouseMove, onMouseOver } = innerProps;

  const { label, flag } = data as CountrySelectOption;

  return (
    <Box
      ref={innerRef}
      role="option"
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseOver={onMouseOver}
      css={getStyles("option", props)}
    >
      <HStack cursor="default">
        <Image src={flag} boxSize="14px" />
        <Text transform="translateY(1px)">{label}</Text>
      </HStack>
    </Box>
  );
};
