import { Box, HStack, Input, Text } from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  required?: boolean;
  helperText?: string;
  error?: string;
  type?: "text" | "date" | "number" | "email";
  disabled?: boolean;
}

export const FormInput = ({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
  helperText,
  error,
  type = "text",
  disabled = false,
}: FormInputProps) => {
  return (
    <Box>
      <HStack gap={2} mb={2}>
        {Icon && <Icon size={16} color="#6b7280" />}
        <Text fontSize="14px" fontWeight="500" color="gray.700">
          {label}
          {required && (
            <Text as="span" color="red.500" ml={1}>
              *
            </Text>
          )}
        </Text>
      </HStack>
      <HStack gap={2}>
        {Icon && (
          <Box
            w="10"
            h="10"
            borderRadius="md"
            bg="gray.100"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <Icon size={18} color="#6b7280" />
          </Box>
        )}
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          borderRadius="md"
          height="44px"
          fontSize="15px"
          borderColor={error ? "red.300" : "gray.200"}
          _focus={{
            borderColor: error ? "red.400" : "blue.500",
            boxShadow: error ? "0 0 0 1px red.400" : "0 0 0 1px blue.500",
          }}
          _hover={{
            borderColor: error ? "red.300" : "gray.300",
          }}
          transition="all 0.2s ease"
        />
      </HStack>
      {helperText && !error && (
        <Text fontSize="13px" color="gray.500" mt={2}>
          {helperText}
        </Text>
      )}
      {error && (
        <Text fontSize="13px" color="red.500" mt={2}>
          {error}
        </Text>
      )}
    </Box>
  );
};
