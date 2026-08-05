import { Box, HStack, Text } from "@chakra-ui/react";
import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <HStack gap={0} align="stretch" mb={8}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <HStack key={step.id} flex={1} align="center">
            {/* Step Circle */}
            <Box
              w="10"
              h="10"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={
                isCompleted ? "green.500" : isActive ? "blue.500" : "gray.200"
              }
              color={isCompleted || isActive ? "white" : "gray.500"}
              fontWeight="600"
              fontSize="sm"
              transition="all 0.2s ease"
              position="relative"
              zIndex={isActive ? 2 : 1}
            >
              {isCompleted ? <Check size={18} /> : step.id}
            </Box>

            {/* Step Title */}
            <Text
              ml={3}
              fontSize="sm"
              fontWeight={isActive ? "600" : "500"}
              color={
                isActive ? "gray.900" : isCompleted ? "gray.600" : "gray.400"
              }
              transition="all 0.2s ease"
            >
              {step.title}
            </Text>

            {/* Progress Line */}
            {!isLast && (
              <Box
                flex={1}
                h="2"
                bg={isCompleted ? "green.500" : "gray.200"}
                mx={4}
                borderRadius="full"
                transition="all 0.3s ease"
              />
            )}
          </HStack>
        );
      })}
    </HStack>
  );
};
