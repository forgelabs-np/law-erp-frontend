import { Box, Flex, Text, Circle } from "@chakra-ui/react";

const legendItems = [
  { label: "Meeting", color: "#3b82f6" },
  { label: "Court Hearing", color: "#8b5cf6" },
  { label: "Completed", color: "#10b981" },
  { label: "Deadline/Filing", color: "#f97316" },
  { label: "Overdue", color: "#ef4444" },
  { label: "Internal", color: "#6b7280" },
];

export const CalendarLegend = () => {
  return (
    <Flex gap={4} flexWrap="wrap" mt={4} justifyContent="center">
      {legendItems.map((item) => (
        <Flex key={item.label} align="center" gap={2}>
          <Circle size="12px" bg={item.color} />
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.300" }}>
            {item.label}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};
