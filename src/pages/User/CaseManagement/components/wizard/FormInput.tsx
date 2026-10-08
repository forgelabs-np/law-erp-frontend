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
  /** Slightly taller / stronger input used for the primary field of a step. */
  emphasis?: boolean;
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
  emphasis = false,
}: FormInputProps) => {
  return (
    <Box>
      <HStack gap={2} mb={2}>
        {Icon && <Icon size={15} color="#6B7280" />}
        <Text
          fontSize="13px"
          fontWeight="600"
          color="gray.700"
          letterSpacing="0.01em"
        >
          {label}
          {required && (
            <Text as="span" color="red.500" ml={1}>
              *
            </Text>
          )}
        </Text>
      </HStack>

      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        borderRadius="lg"
        height={emphasis ? "52px" : "46px"}
        px={4}
        fontSize={emphasis ? "16px" : "15px"}
        fontWeight={emphasis ? "500" : "normal"}
        bg={disabled ? "gray.50" : "white"}
        borderColor={error ? "red.300" : "gray.200"}
        _placeholder={{ color: "gray.400" }}
        _hover={{
          borderColor: error ? "red.300" : "gray.300",
        }}
        _focus={{
          borderColor: error ? "red.400" : "primary.500",
          boxShadow: error
            ? "0 0 0 3px rgba(229, 62, 62, 0.12)"
            : "0 0 0 3px #E3E7FC",
        }}
        _disabled={{ bg: "gray.50", color: "gray.400", cursor: "not-allowed" }}
        transition="all 0.18s ease"
      />

      {helperText && !error && (
        <Text fontSize="12px" color="gray.500" mt={2} lineHeight="1.5">
          {helperText}
        </Text>
      )}
      {error && (
        <Text fontSize="12px" color="red.500" mt={2} lineHeight="1.5">
          {error}
        </Text>
      )}
    </Box>
  );
};
