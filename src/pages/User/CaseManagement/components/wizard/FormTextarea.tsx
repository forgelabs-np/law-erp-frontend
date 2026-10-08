import { Box, HStack, Text, Textarea } from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  required?: boolean;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  rows?: number;
  showCharCount?: boolean;
  maxLength?: number;
}

export const FormTextarea = ({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
  helperText,
  error,
  disabled = false,
  rows = 4,
  showCharCount = false,
  maxLength,
}: FormTextareaProps) => {
  const charCount = value.length;
  const remainingChars = maxLength ? maxLength - charCount : undefined;

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

      <Box position="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          borderRadius="lg"
          rows={rows}
          py={3}
          px={4}
          fontSize="15px"
          lineHeight="1.6"
          minH="112px"
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
          _disabled={{
            bg: "gray.50",
            color: "gray.400",
            cursor: "not-allowed",
          }}
          transition="all 0.18s ease"
          resize="vertical"
        />
        {showCharCount && maxLength && (
          <Text
            position="absolute"
            bottom="8px"
            right="12px"
            fontSize="12px"
            color={
              remainingChars && remainingChars < 0 ? "red.500" : "gray.400"
            }
            bg="white"
            px={1}
          >
            {charCount}/{maxLength}
          </Text>
        )}
      </Box>

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
