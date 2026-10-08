import { Box, Text } from "@chakra-ui/react";

interface OverviewFieldProps {
  label: string;
  value: React.ReactNode;
  /** Render the value in the monospace face used for references and case numbers. */
  mono?: boolean;
}

/**
 * Compact uppercase label + value pair shared by the Overview tabs.
 *
 * Values may be plain strings, counts or existing badge components, so callers
 * keep full control of what is displayed.
 */
export const OverviewField = ({
  label,
  value,
  mono = false,
}: OverviewFieldProps) => {
  return (
    <Box minW={0}>
      <Text
        fontSize="xs"
        fontWeight="600"
        color="gray.500"
        textTransform="uppercase"
        letterSpacing="0.04em"
      >
        {label}
      </Text>
      <Text
        fontSize="sm"
        fontWeight="600"
        color="gray.900"
        mt={1}
        lineHeight="1.5"
        wordBreak="break-word"
        fontFamily={mono ? "monospace" : undefined}
      >
        {value}
      </Text>
    </Box>
  );
};
