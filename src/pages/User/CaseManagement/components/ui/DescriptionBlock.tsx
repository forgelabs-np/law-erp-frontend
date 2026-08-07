import { Box, Text } from "@chakra-ui/react";

interface DescriptionBlockProps {
  label?: string;
  content: string | undefined | null;
}

export const DescriptionBlock = ({
  label = "Description",
  content,
}: DescriptionBlockProps) => {
  if (!content) return null;

  return (
    <Box
      bg="gray.50"
      borderRadius="lg"
      p={5}
      border="1px solid"
      borderColor="gray.100"
    >
      <Text
        fontSize="sm"
        fontWeight="600"
        color="gray.500"
        mb={3}
        textTransform="uppercase"
        letterSpacing="0.05em"
      >
        {label}
      </Text>
      <Text fontSize="base" color="gray.700" lineHeight="1.7">
        {content}
      </Text>
    </Box>
  );
};
