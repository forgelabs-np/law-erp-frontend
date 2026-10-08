import { HStack, Text } from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface MetaItemProps {
  icon: LucideIcon;
  value: ReactNode;
  /** Render the value in the monospace face used for identifiers. */
  mono?: boolean;
}

/**
 * Compact icon + value pair used by the detail-page header metadata rows
 * (matter and court case). Values wrap instead of truncating so long court,
 * judge and identifier values stay readable.
 */
export const MetaItem = ({
  icon: Icon,
  value,
  mono = false,
}: MetaItemProps) => {
  return (
    <HStack gap={1.5} align="center" minW={0} color="gray.400">
      <Icon size={14} style={{ flexShrink: 0 }} />
      <Text
        fontSize="sm"
        fontWeight="500"
        color="gray.600"
        fontFamily={mono ? "monospace" : undefined}
        wordBreak="break-word"
      >
        {value}
      </Text>
    </HStack>
  );
};
