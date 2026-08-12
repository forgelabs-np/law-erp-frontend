import { HStack, Text } from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";

interface QuickInfoItemProps {
  icon?: LucideIcon;
  label: string;
  value: string | number | undefined | null;
}

export const QuickInfoItem = ({
  icon: Icon,
  label,
  value,
}: QuickInfoItemProps) => {
  return (
    <HStack gap={2} align="center">
      {Icon && <Icon size={16} color="#6b7280" />}
      <Text fontSize="sm" color="gray.500">
        {label}:
      </Text>
      <Text fontSize="sm" fontWeight="600" color="gray.900">
        {value || "-"}
      </Text>
    </HStack>
  );
};
