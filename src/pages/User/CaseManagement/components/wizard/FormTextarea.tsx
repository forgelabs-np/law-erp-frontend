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
      <Box position="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          borderRadius="md"
          rows={rows}
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
