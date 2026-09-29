import {
  Box,
  Button,
  Flex,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { UserPlus, Users } from "lucide-react";

import type { ProjectClientType } from "../types/project.types";

interface ClientTypeOption {
  value: ProjectClientType;
  title: string;
  description: string;
  icon: typeof Users;
}

const CLIENT_TYPE_OPTIONS: ClientTypeOption[] = [
  {
    value: "existing",
    title: "Existing Client",
    description:
      "Create a project for a client already registered in your firm.",
    icon: Users,
  },
  {
    value: "new",
    title: "New Client",
    description: "Create a project for a new client.",
    icon: UserPlus,
  },
];

interface ClientTypeSelectionProps {
  value: ProjectClientType | null;
  onChange: (value: ProjectClientType) => void;
  onContinue: () => void;
  /** Disables the options/continue button while a submission is in flight. */
  disabled?: boolean;
}

/**
 * First step of the create-project flow: "Who is this project for?"
 * Rendered by both the Projects page modal and the dedicated Create Project
 * page so the two flows behave identically.
 */
export const ClientTypeSelection = ({
  value,
  onChange,
  onContinue,
  disabled = false,
}: ClientTypeSelectionProps) => {
  return (
    <Stack gap={5}>
      <Stack gap={1}>
        <Text fontSize="sm" fontWeight="600" color="gray.800">
          Who is this project for?
        </Text>
        <Text fontSize="xs" color="gray.500">
          Select a client type, then continue to the project details.
        </Text>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        {CLIENT_TYPE_OPTIONS.map((option) => {
          const selected = value === option.value;
          const Icon = option.icon;

          return (
            <Button
              key={option.value}
              type="button"
              variant="outline"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              disabled={disabled}
              w="full"
              h="auto"
              p={4}
              justifyContent="flex-start"
              alignItems="flex-start"
              borderRadius="lg"
              borderWidth="1px"
              borderColor={selected ? "primary.500" : "gray.200"}
              bg={selected ? "primary.50" : "white"}
              cursor="pointer"
              transition="all 0.15s"
              _hover={
                disabled
                  ? undefined
                  : {
                      borderColor: selected ? "primary.500" : "primary.400",
                      bg: selected ? "primary.50" : "gray.50",
                    }
              }
              _focusVisible={{
                borderColor: "primary.500",
                boxShadow: "0 0 0 3px #E3E7FC",
              }}
              opacity={disabled ? 0.6 : 1}
            >
              <HStack gap={3} align="flex-start">
                <Box
                  flexShrink={0}
                  boxSize="9"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg={selected ? "primary.100" : "gray.100"}
                  color={selected ? "primary.600" : "gray.600"}
                >
                  <Icon size={18} />
                </Box>
                <Stack gap={1}>
                  <Text fontSize="sm" fontWeight="600" color="gray.800">
                    {option.title}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {option.description}
                  </Text>
                </Stack>
              </HStack>
            </Button>
          );
        })}
      </SimpleGrid>

      <Flex justify="flex-end">
        <Button
          variant="primary"
          size="sm"
          type="button"
          onClick={onContinue}
          disabled={disabled || !value}
        >
          Continue
        </Button>
      </Flex>
    </Stack>
  );
};
