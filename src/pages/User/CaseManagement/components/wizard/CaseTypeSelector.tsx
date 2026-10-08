import { Box, Center, HStack, Text } from "@chakra-ui/react";
import { Check, Gavel, Scale } from "lucide-react";

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
      icon: <Scale size={22} />,
      description: "Disputes between individuals or organizations",
    },
    {
      value: "CRIMINAL",
      label: "Criminal Case",
      icon: <Gavel size={22} />,
      description: "Cases involving violations of criminal law",
    },
  ];

  return (
    <HStack gap={4} align="stretch" flexWrap={{ base: "wrap", md: "nowrap" }}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <Box
            key={option.value}
            flex={1}
            minW={{ base: "100%", sm: "260px" }}
            position="relative"
            p={5}
            borderRadius="xl"
            border="1.5px solid"
            borderColor={isSelected ? "primary.500" : "gray.200"}
            bg={isSelected ? "primary.50" : "white"}
            cursor="pointer"
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            transition="all 0.18s ease"
            _hover={{
              borderColor: isSelected ? "primary.500" : "gray.300",
              boxShadow: "0 2px 8px rgba(16, 24, 40, 0.06)",
            }}
            _focusVisible={{
              outline: "2px solid",
              outlineColor: "primary.500",
              outlineOffset: "2px",
            }}
            onClick={() => onChange(option.value)}
          >
            {/* Selected check */}
            {isSelected && (
              <Center
                position="absolute"
                top={3}
                right={3}
                w="5"
                h="5"
                borderRadius="full"
                bg="primary.500"
                color="white"
              >
                <Check size={12} strokeWidth={3} />
              </Center>
            )}

            <HStack gap={3} mb={2.5} pr={6}>
              <Center
                w="11"
                h="11"
                borderRadius="lg"
                bg={isSelected ? "primary.100" : "gray.100"}
                color={isSelected ? "primary.600" : "gray.500"}
                flexShrink={0}
                transition="all 0.18s ease"
              >
                {option.icon}
              </Center>
              <Text fontSize="15px" fontWeight="600" color="gray.900">
                {option.label}
              </Text>
            </HStack>

            <Text fontSize="13px" color="gray.500" lineHeight="1.55">
              {option.description}
            </Text>
          </Box>
        );
      })}
    </HStack>
  );
};
