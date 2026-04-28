import { HStack, Image, Text } from "@chakra-ui/react";

import { CountrySelectOption, CustomSingleValueProps } from "@/shared/types";

export const CustomCountrySingleValue = ({ data }: CustomSingleValueProps) => {
  const { label, flag } = data as CountrySelectOption;

  return (
    <HStack position="absolute" px="3" cursor="default">
      <Image src={flag} boxSize="14px" overflow="hidden" />
      <Text transform="translateY(1px)">{label}</Text>
    </HStack>
  );
};
