import { Button, HStack, Icon } from "@chakra-ui/react";
import { type LucideIcon } from "lucide-react";

export interface SegmentOption<TValue extends string> {
  value: TValue;
  label: string;
  icon?: LucideIcon;
}

interface SegmentedControlProps<TValue extends string> {
  options: SegmentOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
  /** Accessible name for the tablist. */
  ariaLabel: string;
}

/**
 * Compact tab switcher used inside panels to move between two views of the
 * SAME data (e.g. chart ⇄ list). Purely presentational — it never changes what
 * is fetched, only which representation of it is shown.
 */
export function SegmentedControl<TValue extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: SegmentedControlProps<TValue>) {
  return (
    <HStack
      gap={0.5}
      p={0.5}
      bg="gray.100"
      borderRadius="full"
      role="tablist"
      aria-label={ariaLabel}
      flexShrink={0}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        const IconComponent = option.icon;

        return (
          <Button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            size="xs"
            variant="ghost"
            gap={1.5}
            h="26px"
            px={2.5}
            minW={0}
            borderRadius="full"
            fontSize="xs"
            fontWeight={600}
            color={isActive ? "primary.700" : "gray.500"}
            bg={isActive ? "white" : "transparent"}
            boxShadow={isActive ? "0 1px 2px rgba(16,24,40,0.08)" : undefined}
            transition="all 0.18s ease"
            whiteSpace="nowrap"
            _hover={{
              bg: isActive ? "white" : "gray.200",
              color: isActive ? "primary.700" : "gray.700",
            }}
          >
            {IconComponent && <Icon as={IconComponent} boxSize={3.5} />}
            {option.label}
          </Button>
        );
      })}
    </HStack>
  );
}
