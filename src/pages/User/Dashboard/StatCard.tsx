import { Box, Text } from "@chakra-ui/react";

export interface StatCardData {
  id: string;
  label: string;
  value: number | string;
  linkText: string;
  onClick?: () => void;
}

interface StatCardProps {
  data: StatCardData;
}

export const StatCard = ({ data }: StatCardProps) => {
  return (
    <Box
      bg="white"
      borderRadius="16px"
      border="1px solid"
      borderColor="gray.200"
      p={5}
      flex="1"
      minW="0"
    >
      <Text fontSize="sm" color="gray.500" mb={2}>
        {data.label}
      </Text>
      <Text fontSize="3xl" fontWeight={700} color="blue.600" mb={3}>
        {data.value}
      </Text>
      <Text
        fontSize="sm"
        color="blue.600"
        cursor="pointer"
        _hover={{ textDecoration: "underline" }}
        onClick={data.onClick}
      >
        {data.linkText} →
      </Text>
    </Box>
  );
};
