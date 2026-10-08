import { Box, Field, HStack, Input, Text } from "@chakra-ui/react";

interface BrandColorFieldProps {
  label: string;
  description?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  placeholder: string;
}

export const BrandColorField = ({
  label,
  description,
  value,
  onChange,
  error,
  placeholder,
}: BrandColorFieldProps) => {
  const displayColor = value && /^#?[0-9a-fA-F]{6}$/.test(value.trim())
    ? value.startsWith("#") ? value : `#${value}`
    : "#000000";

  return (
    <Field.Root invalid={!!error}>
      <Field.Label fontWeight="500" fontSize="sm" color="gray.700" mb={0.5}>
        {label}
      </Field.Label>
      {description && (
        <Text fontSize="xs" color="gray.500" mb={2}>
          {description}
        </Text>
      )}
      <HStack gap={3}>
        <Box
          position="relative"
          width="44px"
          height="40px"
          borderRadius="md"
          border="1px solid"
          borderColor="gray.300"
          overflow="hidden"
          boxShadow="xs"
          backgroundColor={displayColor}
          cursor="pointer"
          flexShrink={0}
        >
          <input
            type="color"
            value={displayColor}
            onChange={(e) => onChange(e.target.value)}
            style={{
              position: "absolute",
              top: "-10px",
              left: "-10px",
              width: "64px",
              height: "64px",
              opacity: 0,
              cursor: "pointer",
            }}
          />
        </Box>
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          fontFamily="mono"
          fontSize="sm"
          borderRadius="md"
          size="md"
          maxW="220px"
        />
      </HStack>
      {error && (
        <Text color="red.500" fontSize="xs" mt={1}>
          {error}
        </Text>
      )}
    </Field.Root>
  );
};
