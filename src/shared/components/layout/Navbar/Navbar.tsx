import { HStack, Text } from "@chakra-ui/react";

export const Navbar = () => {
  return (
    <HStack
      flexShrink="0"
      borderBottom="sm"
      borderBottomColor="gray.200"
      height="12"
      px="6"
    >
      <Text>Navbar</Text>
    </HStack>
  );
};
