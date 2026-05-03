import { Stack, Tabs as ChakraTabs } from "@chakra-ui/react";

interface ModuleTabsProps {
  value: string;
  onValueChange?: (value: string) => void;
  options: { label: string; value: string }[];
  renderContent?: (moduleValue: string) => React.ReactNode;
}

export function Tabs({
  value,
  onValueChange,
  options,
  renderContent,
}: ModuleTabsProps) {
  return (
    <ChakraTabs.Root
      value={value}
      onValueChange={(details: { value: string }) => {
        onValueChange?.(details.value);
      }}
      variant="enclosed"
    >
      <ChakraTabs.List>
        {options.map((module) => (
          <ChakraTabs.Trigger
            key={module.value}
            value={module.value}
            _selected={{ borderColor: "primary.500", color: "primary.500" }}
          >
            {module.label}
          </ChakraTabs.Trigger>
        ))}
        <ChakraTabs.Indicator />
      </ChakraTabs.List>

      {renderContent && (
        <Stack gap={5} mt={4}>
          {options.map((module) => (
            <ChakraTabs.Content key={module.value} value={module.value}>
              {renderContent(module.value)}
            </ChakraTabs.Content>
          ))}
        </Stack>
      )}
    </ChakraTabs.Root>
  );
}
