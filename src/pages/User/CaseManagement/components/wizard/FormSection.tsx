import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";

interface FormSectionProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export const FormSection = ({
  title,
  icon: Icon,
  children,
}: FormSectionProps) => {
  return (
    <Stack gap={5} mb={6}>
      <HStack gap={3}>
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
        <Text fontSize="20px" fontWeight="600" color="gray.900">
          {title}
        </Text>
      </HStack>
      {children}
    </Stack>
  );
};
