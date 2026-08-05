import { Box, HStack, Text } from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon?: LucideIcon;
  label: string;
  value: string | number | undefined | null;
}

export const InfoCard = ({ icon: Icon, label, value }: InfoCardProps) => {
  return (
    <Box
      bg="gray.50"
      borderRadius="lg"
      p={4}
      border="1px solid"
      borderColor="gray.100"
      _hover={{ bg: "gray.100", transition: "all 0.2s ease" }}
    >
      <HStack gap={2} mb={2}>
        {Icon && <Icon size={16} color="#6b7280" />}
        <Text
          fontSize="xs"
          fontWeight="600"
          color="gray.500"
          textTransform="uppercase"
          letterSpacing="0.05em"
        >
          {label}
        </Text>
      </HStack>
      <Text fontSize="base" fontWeight="600" color="gray.900">
        {value || "-"}
      </Text>
    </Box>
  );
};
