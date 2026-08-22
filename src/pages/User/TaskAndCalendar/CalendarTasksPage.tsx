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
      courtCaseId: "c1",
      ourCourtCaseRef: "DEMO-DC1",
      matterNumber: "CASE-001",
      matterTitle: "Smith v. ABC",
      eventType: "PESHI",
      scheduledDate: d(1),
      scheduledTime: "09:00",
      endTime: "10:00",
      courtRoom: "Room 101",
      status: "SCHEDULED",
      attendingAdvocateId: "adv1",
    },
    {
      id: "e2",
      courtCaseId: "c2",
      ourCourtCaseRef: "DEMO-DC2",
      matterNumber: "CASE-002",
      matterTitle: "Smith v. ABC",
      eventType: "TARIK",
      scheduledDate: d(1),
      scheduledTime: "10:30",
      endTime: "11:30",
      courtRoom: "Room 102",
      status: "SCHEDULED",
      attendingAdvocateId: "adv1",
    },
    {
      id: "e3",
      courtCaseId: "c3",
      ourCourtCaseRef: "DEMO-DC3",
      matterNumber: "CASE-003",
      matterTitle: "Johnson",
      eventType: "PESHI",
      scheduledDate: d(0),
      scheduledTime: "13:00",
      endTime: "14:30",
      courtRoom: "Room 103",
      status: "SCHEDULED",
      attendingAdvocateId: "adv1",
    },
    {
      id: "e4",
      courtCaseId: "c4",
      ourCourtCaseRef: "DEMO-DC4",
      matterNumber: "CASE-004",
      matterTitle: "John Smith",
      eventType: "PESHI",
      scheduledDate: d(2),
      scheduledTime: "11:00",
      endTime: "13:00",
      courtRoom: "Room 104",
      status: "SCHEDULED",
      attendingAdvocateId: "adv1",
    },
    {
      id: "e5",
      courtCaseId: "c5",
      ourCourtCaseRef: "DEMO-DC5",
      matterNumber: "CASE-005",
      matterTitle: "Motion",
      eventType: "TARIK",
      scheduledDate: d(3),
      scheduledTime: "09:00",
      endTime: "11:00",
      courtRoom: "Room 105",
      status: "SCHEDULED",
      attendingAdvocateId: "adv1",
    },
    {
      id: "e6",
      courtCaseId: "c6",
      ourCourtCaseRef: "DEMO-DC6",
      matterNumber: "CASE-006",
      matterTitle: "Davis Estate",
      eventType: "PESHI",
      scheduledDate: d(4),
      scheduledTime: "15:00",
      endTime: "16:00",
      courtRoom: "Room 106",
      status: "SCHEDULED",
      attendingAdvocateId: "adv1",
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
