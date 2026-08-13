import { HStack, Text } from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";

interface TabOption {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface SegmentedTabsProps {
  options: TabOption[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const SegmentedTabs = ({
  options,
  activeTab,
  onTabChange,
}: SegmentedTabsProps) => {
  return (
    <HStack gap={1} bg="gray.100" p={1} borderRadius="lg">
      {options.map((option) => {
        const isActive = activeTab === option.id;
        return (
          <HStack
            key={option.id}
            gap={2}
            px={4}
            py={2.5}
            borderRadius="md"
            cursor="pointer"
            transition="all 0.2s ease"
            bg={isActive ? "white" : "transparent"}
            boxShadow={isActive ? "sm" : "none"}
            onClick={() => onTabChange(option.id)}
            _hover={{ bg: isActive ? "white" : "gray.200" }}
          >
            {option.icon && (
              <option.icon size={16} color={isActive ? "#2563eb" : "#6b7280"} />
            )}
            <Text
              fontSize="sm"
              fontWeight={isActive ? "600" : "500"}
              color={isActive ? "gray.900" : "gray.600"}
            >
              {option.label}
            </Text>
          </HStack>
        );
      })}
    </HStack>
  );
};
