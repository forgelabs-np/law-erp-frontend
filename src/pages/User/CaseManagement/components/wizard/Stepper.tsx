import { Box, Center, HStack, Stack, Text } from "@chakra-ui/react";
import { Check } from "lucide-react";
import { Fragment } from "react";

interface Step {
  id: number;
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export const Stepper = ({ steps, currentStep }: StepperProps) => {
  const total = steps.length;
  const progressPercent = total > 1 ? (currentStep / (total - 1)) * 100 : 0;
  const activeStep = steps[currentStep];

  return (
    <Box mb={7}>
      {/* ── Compact progress (mobile / tablet) ───────────────────────────── */}
      <Stack gap={2.5} display={{ base: "flex", md: "none" }}>
        <HStack justify="space-between" align="baseline" gap={3}>
          <Text
            fontSize="11px"
            fontWeight="700"
            color="primary.500"
            letterSpacing="0.08em"
            textTransform="uppercase"
            flexShrink={0}
          >
            Step {currentStep + 1} of {total}
          </Text>
          <Text
            fontSize="14px"
            fontWeight="600"
            color="gray.900"
            textAlign="right"
            // noOfLines={1}
          >
            {activeStep?.title}
          </Text>
        </HStack>

        <Box
          h="4px"
          w="100%"
          bg="gray.100"
          borderRadius="full"
          overflow="hidden"
        >
          <Box
            h="100%"
            w={`${progressPercent}%`}
            bg="primary.500"
            borderRadius="full"
            transition="width 0.35s ease"
          />
        </Box>
      </Stack>

      {/* ── Full stepper (desktop) ───────────────────────────────────────── */}
      <HStack
        gap={0}
        align="flex-start"
        w="100%"
        display={{ base: "none", md: "flex" }}
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === total - 1;
          const isFilled = isCompleted || isActive;

          return (
            <Fragment key={step.id}>
              <Stack
                gap={2}
                align="center"
                flexShrink={0}
                w={{ md: "118px", lg: "134px" }}
              >
                <Center
                  w="9"
                  h="9"
                  borderRadius="full"
                  fontSize="13px"
                  fontWeight="700"
                  bg={isFilled ? "primary.500" : "white"}
                  color={isFilled ? "white" : "gray.400"}
                  border="1px solid"
                  borderColor={isFilled ? "primary.500" : "gray.200"}
                  boxShadow={isActive ? "0 0 0 4px #E3E7FC" : "none"}
                  transition="all 0.25s ease"
                >
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : step.id}
                </Center>

                <Text
                  fontSize="12px"
                  lineHeight="1.35"
                  textAlign="center"
                  fontWeight={isActive ? "700" : "500"}
                  color={
                    isActive
                      ? "primary.600"
                      : isCompleted
                        ? "gray.700"
                        : "gray.400"
                  }
                  transition="all 0.25s ease"
                >
                  {step.title}
                </Text>
              </Stack>

              {!isLast && (
                <Box
                  flex={1}
                  h="2px"
                  mt="17px"
                  mx={{ md: 2, lg: 3 }}
                  bg={isCompleted ? "primary.300" : "gray.200"}
                  borderRadius="full"
                  transition="all 0.3s ease"
                />
              )}
            </Fragment>
          );
        })}
      </HStack>
    </Box>
  );
};
