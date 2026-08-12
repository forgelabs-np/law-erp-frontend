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
      caseId: "c1",
      caseNumber: "CASE-001",
      caseTitle: "Smith v. ABC",
      title: "Client call",
      date: d(1),
      time: "09:00",
      endTime: "10:00",
      courtRoom: "Room 101",
      hearingType: "OTHER",
      status: "SCHEDULED",
      advocateId: "adv1",
      color: "blue",
      subtitle: "Smith v. ABC",
    },
    {
      id: "e2",
      caseId: "c2",
      caseNumber: "CASE-002",
      caseTitle: "Smith v. ABC",
      title: "Review discovery",
      date: d(1),
      time: "10:30",
      endTime: "11:30",
      courtRoom: "Room 102",
      hearingType: "OTHER",
      status: "SCHEDULED",
      advocateId: "adv1",
      color: "blue",
    },
    {
      id: "e3",
      caseId: "c3",
      caseNumber: "CASE-003",
      caseTitle: "Johnson",
      title: "Court hearing",
      date: d(0),
      time: "13:00",
      endTime: "14:30",
      courtRoom: "Room 103",
      hearingType: "FIRST_HEARING",
      status: "SCHEDULED",
      advocateId: "adv1",
      color: "purple",
      subtitle: "Johnson",
    },
    {
      id: "e4",
      caseId: "c4",
      caseNumber: "CASE-004",
      caseTitle: "John Smith",
      title: "Deposition",
      date: d(2),
      time: "11:00",
      endTime: "13:00",
      courtRoom: "Room 104",
      hearingType: "EVIDENCE",
      status: "SCHEDULED",
      advocateId: "adv1",
      color: "green",
      subtitle: "John Smith",
    },
    {
      id: "e5",
      caseId: "c5",
      caseNumber: "CASE-005",
      caseTitle: "Motion",
      title: "Draft motion",
      date: d(3),
      time: "09:00",
      endTime: "11:00",
      courtRoom: "Room 105",
      hearingType: "ARGUMENT",
      status: "SCHEDULED",
      advocateId: "adv1",
      color: "blue",
    },
    {
      id: "e6",
      caseId: "c6",
      caseNumber: "CASE-006",
      caseTitle: "Davis Estate",
      title: "Client update",
      date: d(4),
      time: "15:00",
      endTime: "16:00",
      courtRoom: "Room 106",
      hearingType: "OTHER",
      status: "SCHEDULED",
      advocateId: "adv1",
      color: "blue",
      subtitle: "Davis Estate",
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
