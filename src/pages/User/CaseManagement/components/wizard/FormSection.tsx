import { Box, Center, HStack, Text } from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";

interface FormSectionProps {
  title: string;
  /** Optional supporting line rendered under the section title. */
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export const FormSection = ({
  title,
  description,
  icon: Icon,
  children,
}: FormSectionProps) => {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="2xl"
      boxShadow="0 1px 2px rgba(16, 24, 40, 0.04)"
      overflow="hidden"
    >
      {/* Section header */}
      <HStack
        gap={3.5}
        align="center"
        px={{ base: 5, md: 7 }}
        py={{ base: 4, md: 5 }}
        borderBottom="1px solid"
        borderColor="gray.100"
        bg="gray.50"
      >
        {Icon && (
          <Center
            w="10"
            h="10"
            borderRadius="xl"
            bg="primary.50"
            color="primary.500"
            flexShrink={0}
          >
            <Icon size={19} />
          </Center>
        )}
        <Box minW={0}>
          <Text
            fontSize={{ base: "16px", md: "17px" }}
            fontWeight="700"
            color="gray.900"
            letterSpacing="-0.01em"
            lineHeight="1.3"
          >
            {title}
          </Text>
          {description && (
            <Text fontSize="13px" color="gray.500" mt={0.5} lineHeight="1.5">
              {description}
            </Text>
          )}
        </Box>
      </HStack>

      {/* Section body */}
      <Box px={{ base: 5, md: 7 }} py={{ base: 5, md: 7 }}>
        {children}
      </Box>
    </Box>
  );
};
