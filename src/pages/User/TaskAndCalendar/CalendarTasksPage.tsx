import { Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { addDays, format, startOfWeek } from "date-fns";
import { useState } from "react";

import { Task, TaskStatus, CalendarEvent } from "@/types/calendar.types";

import { TaskList } from "./Tasklist";
import { WeeklyCalendar } from "./WeeklyCalendar";

const DEFAULT_TASKS: Task[] = [
  {
    id: "1",
    title: "Review medical records",
    dueDate: "2025-05-16",
    status: "todo",
  },
  {
    id: "2",
    title: "Draft discovery requests",
    dueDate: "2025-05-22",
    status: "todo",
  },
  {
    id: "3",
    title: "Prepare for hearing – Johnson matter",
    dueDate: "2025-05-18",
    status: "todo",
  },
  {
    id: "4",
    title: "File response to complaint",
    dueDate: "2025-05-18",
    status: "todo",
  },
  {
    id: "5",
    title: "Update client – Davis Estate",
    dueDate: "2025-05-20",
    status: "todo",
  },
  {
    id: "6",
    title: "Deposition – John Smith",
    dueDate: "2025-05-30",
    status: "in_progress",
  },
  {
    id: "7",
    title: "Draft motion for summary judgment",
    dueDate: "2025-06-20",
    status: "in_progress",
  },
  {
    id: "8",
    title: "Initial client meeting – Robert Lee",
    dueDate: "2025-04-30",
    status: "completed",
  },
  {
    id: "9",
    title: "Review contract – ABC Corp",
    dueDate: "2025-04-28",
    status: "completed",
  },
];

const getDefaultEvents = (): CalendarEvent[] => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // this Monday
  const d = (offset: number) =>
    format(addDays(weekStart, offset), "yyyy-MM-dd");

  return [
    {
      id: "e1",
      title: "Client call",
      subtitle: "Smith v. ABC",
      date: d(1),
      startTime: "09:00",
      endTime: "10:00",
      color: "blue",
    },
    {
      id: "e2",
      title: "Review discovery",
      date: d(1),
      startTime: "10:30",
      endTime: "11:30",
      color: "blue",
    },
    {
      id: "e3",
      title: "Court hearing",
      subtitle: "Johnson",
      date: d(0),
      startTime: "13:00",
      endTime: "14:30",
      color: "purple",
    },
    {
      id: "e4",
      title: "Deposition",
      subtitle: "John Smith",
      date: d(2),
      startTime: "11:00",
      endTime: "13:00",
      color: "green",
    },
    {
      id: "e5",
      title: "Draft motion",
      date: d(3),
      startTime: "09:00",
      endTime: "11:00",
      color: "blue",
    },
    {
      id: "e6",
      title: "Client update",
      subtitle: "Davis Estate",
      date: d(4),
      startTime: "15:00",
      endTime: "16:00",
      color: "blue",
    },
  ];
};

// ── Page component ─────────────────────────────────────────────────────────────

export const CalendarTasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);

  // When you integrate the API, replace useState above with:
  // const { data: tasks = [] } = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });
  // const { data: events = [] } = useQuery({ queryKey: ["events"], queryFn: fetchEvents });

  const handleToggleTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleNewTask = () => {
    // open modal / navigate to new task form
  };

  const [events] = useState<CalendarEvent[]>(getDefaultEvents);

  return (
    <VStack gap={6} alignItems="stretch" h="100%">
      <HStack justifyContent="space-between" alignItems="center">
        <Text textStyle="heading_5" fontWeight={700}>
          Calendar & Tasks
        </Text>
      </HStack>

      <Grid
        templateColumns={{ base: "1fr", lg: "360px 1fr" }}
        gap={6}
        alignItems="start"
        flex={1}
      >
        <TaskList
          tasks={tasks}
          onNewTask={handleNewTask}
          onToggleTask={handleToggleTask}
          onViewAll={() => {}}
        />
        <WeeklyCalendar events={events} />
      </Grid>
    </VStack>
  );
};
