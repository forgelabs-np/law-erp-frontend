import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarSection.css"; // custom overrides below

export interface CalendarTask {
  time: string;
  label: string;
}

export interface CalendarSectionData {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  todayLabel: string;
  tasks: CalendarTask[];
  onViewFullCalendar?: () => void;
}

export const CalendarSection = ({
  selectedDate,
  onDateChange,
  todayLabel,
  tasks,
  onViewFullCalendar,
}: CalendarSectionData) => {
  return (
    <Box
      bg="white"
      borderRadius="16px"
      border="1px solid"
      borderColor="gray.200"
      p={5}
    >
      <Text fontWeight={700} fontSize="md" mb={4}>
        Calendar & Tasks
      </Text>

      <Box mb={5}>
        <Calendar
          value={selectedDate}
          onChange={(val) => onDateChange(val as Date)}
          locale="en-US"
        />
      </Box>

      <Box>
        <Text fontSize="sm" fontWeight={600} mb={3}>
          Today • {todayLabel}
        </Text>
        <Stack gap={2}>
          {tasks.map((task, i) => (
            <HStack key={i} gap={3} alignItems="flex-start">
              <Box
                mt="3px"
                w="14px"
                h="14px"
                borderRadius="3px"
                border="1.5px solid"
                borderColor="gray.300"
                flexShrink={0}
              />
              <Text fontSize="xs" color="gray.500" minW="52px" flexShrink={0}>
                {task.time}
              </Text>
              <Text fontSize="xs" color="gray.700">
                {task.label}
              </Text>
            </HStack>
          ))}
        </Stack>

        <Text
          mt={4}
          fontSize="sm"
          color="blue.500"
          cursor="pointer"
          _hover={{ textDecoration: "underline" }}
          onClick={onViewFullCalendar}
        >
          View full calendar →
        </Text>
      </Box>
    </Box>
  );
};
