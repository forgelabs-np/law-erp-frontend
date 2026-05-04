import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { format, isPast, parseISO } from "date-fns";

import { Checkbox } from "@/shared/components/ui";
import { Task, TaskStatus } from "@/types/calendar.types";

interface TaskGroup {
  label: string;
  status: TaskStatus;
  tasks: Task[];
}

interface TaskListProps {
  tasks: Task[];
  onNewTask?: () => void;
  onToggleTask?: (taskId: string, newStatus: TaskStatus) => void;
  onViewAll?: () => void;
}

const formatDueDate = (iso: string) => {
  try {
    return format(parseISO(iso), "MMM d, yyyy");
  } catch {
    return iso;
  }
};

const isDueSoon = (iso: string) => {
  try {
    return isPast(parseISO(iso));
  } catch {
    return false;
  }
};

export const TaskList = ({
  tasks,
  onNewTask,
  onToggleTask,
  onViewAll,
}: TaskListProps) => {
  const groups: TaskGroup[] = [
    {
      label: "To-do",
      status: "todo",
      tasks: tasks.filter((t) => t.status === "todo"),
    },
    {
      label: "In progress",
      status: "in_progress",
      tasks: tasks.filter((t) => t.status === "in_progress"),
    },
    {
      label: "Completed",
      status: "completed",
      tasks: tasks.filter((t) => t.status === "completed"),
    },
  ];

  return (
    <Box
      bg="white"
      borderRadius="16px"
      border="1px solid"
      borderColor="gray.200"
      p={5}
      h="100%"
      overflow="auto"
    >
      {/* Header */}
      <HStack justifyContent="space-between" mb={5}>
        <Text fontWeight={700} fontSize="lg">
          Tasks
        </Text>
        <Button
          size="sm"
          bg="blue.600"
          color="white"
          borderRadius="8px"
          fontSize="xs"
          _hover={{ bg: "blue.700" }}
          onClick={onNewTask}
        >
          + New task
        </Button>
      </HStack>

      <Stack gap={6}>
        {groups.map((group) => (
          <Box key={group.status}>
            <Text fontSize="sm" fontWeight={600} color="gray.700" mb={3}>
              {group.label} ({group.tasks.length})
            </Text>
            <Stack gap={2}>
              {group.tasks.map((task) => {
                const isCompleted = task.status === "completed";
                const overdue = !isCompleted && isDueSoon(task.dueDate);

                return (
                  <HStack
                    key={task.id}
                    justifyContent="space-between"
                    gap={3}
                    opacity={isCompleted ? 0.55 : 1}
                  >
                    <HStack gap={3} flex={1} minW={0}>
                      <Checkbox
                        size="sm"
                        checked={isCompleted}
                        onChange={() =>
                          onToggleTask?.(
                            task.id,
                            isCompleted ? "todo" : "completed"
                          )
                        }
                        flexShrink={0}
                      />
                      <Text
                        fontSize="sm"
                        color="gray.700"
                        textDecoration={isCompleted ? "line-through" : "none"}
                      >
                        {task.title}
                      </Text>
                    </HStack>
                    <Text
                      fontSize="xs"
                      color={overdue ? "red.500" : "gray.400"}
                      flexShrink={0}
                      fontWeight={overdue ? 500 : 400}
                    >
                      {formatDueDate(task.dueDate)}
                    </Text>
                  </HStack>
                );
              })}
            </Stack>
          </Box>
        ))}
      </Stack>

      <Text
        mt={6}
        fontSize="sm"
        color="blue.500"
        cursor="pointer"
        _hover={{ textDecoration: "underline" }}
        onClick={onViewAll}
      >
        View all tasks
      </Text>
    </Box>
  );
};
