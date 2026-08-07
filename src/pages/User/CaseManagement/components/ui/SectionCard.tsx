import { Box, HStack, Text } from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";

interface SectionCardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export const SectionCard = ({
  title,
  icon: Icon,
  children,
}: SectionCardProps) => {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      p={6}
      _hover={{ boxShadow: "md", transition: "all 0.2s ease" }}
    >
      <HStack gap={3} mb={5}>
        {Icon && (
          <Box
            w="8"
            h="8"
            borderRadius="lg"
            bg="blue.50"
            color="blue.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon size={18} />
          </Box>
        )}
        <Text fontSize="lg" fontWeight="600" color="gray.900">
          {title}
        </Text>
      </HStack>
      {children}
    </Box>
  );
};
