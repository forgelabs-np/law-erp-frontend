import { Button, HStack, Text } from "@chakra-ui/react";

import { BillingCycle } from "@/shared/types/plan";

const OPTIONS: Array<{ value: BillingCycle; label: string }> = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
];

export const BillingCycleToggle = ({
  value,
  onChange,
}: {
  value: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}) => {
  return (
    <HStack
      gap={1}
      p={1}
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="full"
      role="group"
      aria-label="Billing cycle"
      alignSelf={{ base: "flex-start", md: "center" }}
    >
      {OPTIONS.map((option) => {
        const isActive = value === option.value;
        return (
          <Button
            key={option.value}
            size="sm"
            borderRadius="full"
            px={5}
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            variant={isActive ? "primary" : "ghost"}
            color={isActive ? "white" : "gray.600"}
            _hover={isActive ? undefined : { bg: "gray.100" }}
          >
            <Text fontSize="sm" fontWeight={isActive ? "600" : "500"}>
              {option.label}
            </Text>
          </Button>
        );
      })}
    </HStack>
  );
};
