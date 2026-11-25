import { Box, HStack, Skeleton, Stack, Text } from "@chakra-ui/react";

import { Checkbox } from "@/shared/components/ui";
import { ActiveModule } from "@/shared/types/plan";

/**
 * Checkbox tree for a plan's included modules.
 *
 * Only top-level modules are selectable: the backend adds every child module of
 * a selected parent automatically, so sending child ids separately would
 * duplicate that logic in the frontend.
 */
export const PlanModuleSelector = ({
  modules,
  selectedIds,
  onToggle,
  isLoading,
  disabled,
  errorMessage,
}: {
  modules: ActiveModule[];
  selectedIds: string[];
  onToggle: (moduleId: string, selected: boolean) => void;
  isLoading?: boolean;
  disabled?: boolean;
  errorMessage?: string | null;
}) => {
  if (errorMessage) {
    return (
      <Box
        borderWidth="1px"
        borderColor="red.200"
        bg="red.50"
        borderRadius="xl"
        p={4}
      >
        <Text fontSize="sm" color="gray.700">
          {errorMessage}
        </Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Stack
        gap={3}
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="xl"
        p={4}
      >
        {[0, 1, 2].map((index) => (
          <HStack key={index} gap={3}>
            <Skeleton boxSize="16px" borderRadius="sm" />
            <Skeleton height="14px" flex="1" />
          </HStack>
        ))}
      </Stack>
    );
  }

  if (modules.length === 0) {
    return (
      <Box
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="xl"
        p={4}
        bg="gray.50"
      >
        <Text fontSize="sm" color="gray.500">
          No active modules are available. Modules can be added from Menu
          Management.
        </Text>
      </Box>
    );
  }

  return (
    <Stack
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      maxH="280px"
      overflowY="auto"
      gap={0}
    >
      {modules.map((module, index) => {
        const children = module.subModules ?? [];
        const isSelected = selectedIds.includes(module.id);

        return (
          <HStack
            key={module.id}
            align="flex-start"
            gap={3}
            px={4}
            py={3}
            borderBottomWidth={index === modules.length - 1 ? "0" : "1px"}
            borderColor="gray.100"
            bg={isSelected ? "lavender.50" : "white"}
            _hover={{ bg: isSelected ? "lavender.50" : "gray.50" }}
            transition="background 0.15s"
          >
            <Box mt="2px">
              <Checkbox
                checked={isSelected}
                disabled={disabled}
                aria-label={`Include ${module.name} in this plan`}
                onCheckedChange={(event) =>
                  onToggle(module.id, Boolean(event.checked))
                }
              />
            </Box>

            <Stack gap={0.5} flex="1" minW={0}>
              <HStack gap={2} flexWrap="wrap">
                <Text fontSize="sm" fontWeight="500" color="gray.800">
                  {module.name}
                </Text>
                <Text
                  fontSize="2xs"
                  color="gray.400"
                  letterSpacing="0.04em"
                >
                  {module.code}
                </Text>
              </HStack>

              {module.description && (
                <Text fontSize="xs" color="gray.500" lineHeight="1.5">
                  {module.description}
                </Text>
              )}

              {children.length > 0 && (
                <Text fontSize="xs" color="gray.400">
                  {isSelected
                    ? `Includes ${children.map((child) => child.name).join(", ")}`
                    : `Includes ${children.length} sub-module${children.length === 1 ? "" : "s"} automatically`}
                </Text>
              )}
            </Stack>
          </HStack>
        );
      })}
    </Stack>
  );
};
