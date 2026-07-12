import { Box, Text, Flex } from "@chakra-ui/react";
import { Task } from "../../types/Task";
import { format } from "date-fns";

interface TaskEventCardProps {
  event: any; // FullCalendar event object
}

export const TaskEventCard = ({ event }: TaskEventCardProps) => {
  const task: Task = event.extendedProps;

  // Format time like "10am" or "2.30pm"
  const timeString = format(new Date(event.start), "h:mm a")
    .toLowerCase()
    .replace(":00", "");

  return (
    <Box
      w="100%"
      h="100%"
      px={2}
      py={1}
      bg={event.backgroundColor}
      borderRadius="md"
      color="white"
      fontSize="xs"
      lineHeight="1.2"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      display="flex"
      alignItems="center"
      gap={1}
    >
      <Text fontWeight="600" opacity={0.9}>
        {timeString}
      </Text>
      <Text as="span" opacity={0.6}>
        ·
      </Text>
      <Text fontWeight="500" truncate>
        {event.title}
      </Text>
    </Box>
  );
};
