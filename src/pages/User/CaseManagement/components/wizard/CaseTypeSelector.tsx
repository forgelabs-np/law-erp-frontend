import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { Scale, Gavel } from "lucide-react";

type CaseType = "CIVIL" | "CRIMINAL";

interface CaseTypeOption {
  value: CaseType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface CaseTypeSelectorProps {
  value: CaseType | undefined;
  onChange: (value: CaseType) => void;
}

export const CaseTypeSelector = ({
  value,
  onChange,
}: CaseTypeSelectorProps) => {
  const options: CaseTypeOption[] = [
    {
      value: "CIVIL",
      label: "Civil Case",
      icon: <Scale size={24} />,
      description: "Disputes between individuals or organizations",
    },
    {
      value: "CRIMINAL",
      label: "Criminal Case",
      icon: <Gavel size={24} />,
      description: "Cases involving violations of criminal law",
    },
  ];

  return (
    <HStack gap={4} flexWrap="wrap">
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <Box
            key={option.value}
            flex={1}
            minW="280px"
            p={5}
            borderRadius="xl"
            border="2px solid"
            borderColor={isSelected ? "blue.500" : "gray.200"}
            bg={isSelected ? "blue.50" : "white"}
            cursor="pointer"
            transition="all 0.2s ease"
            _hover={{
              borderColor: isSelected ? "blue.500" : "gray.300",
              boxShadow: isSelected ? "md" : "sm",
              transform: "translateY(-2px)",
            }}
            onClick={() => onChange(option.value)}
          >
            <HStack gap={3} mb={3}>
              <Box
                w="12"
                h="12"
                borderRadius="lg"
                bg={isSelected ? "blue.100" : "gray.100"}
                color={isSelected ? "blue.600" : "gray.600"}
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition="all 0.2s ease"
              >
                {option.icon}
              </Box>
              <Text fontSize="16px" fontWeight="600" color="gray.900">
                {option.label}
              </Text>
            </HStack>
            <Text fontSize="14px" color="gray.600">
              {option.description}
            </Text>
          </Box>
        );
      })}
    </HStack>
  );
};
