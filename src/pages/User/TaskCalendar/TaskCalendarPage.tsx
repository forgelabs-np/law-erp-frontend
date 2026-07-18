import { useState, useRef, ChangeEvent } from "react";
import {
  Box,
  Flex,
  Spinner,
  Center,
  Text,
  Image,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarToolbar } from "@/components/calendar/CalendarToolbar";
import { TaskCalendar } from "@/components/calendar/TaskCalendar";
import { TaskDrawer } from "@/components/calendar/TaskDrawer";
import { CreateTaskModal } from "@/components/calendar/CreateTaskModal";
import { CalendarLegend } from "@/components/calendar/CalendarLegend";
import {
  useCalendarTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/useCalendar";
import { Task } from "@/types/Task";
import { addDays, subDays } from "date-fns";
import toast from "react-hot-toast";

const TaskCalendarPage = () => {
  const { data: tasks, isLoading, isError } = useCalendarTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("dayGridMonth");

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const calendarRef = useRef<any>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredTasks =
    tasks?.filter(
      (task: Task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedLawyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.caseNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
      setCurrentDate(calendarRef.current.getApi().getDate());
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
      setCurrentDate(calendarRef.current.getApi().getDate());
    }
  };

  const handleToday = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
      setCurrentDate(calendarRef.current.getApi().getDate());
    }
  };

  const handleEventClick = (task: Task) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  const handleEventDrop = (taskId: string, start: Date, end: Date) => {
    updateTaskMutation.mutate(
      {
        id: taskId,
        updates: { startDate: start.toISOString(), endDate: end.toISOString() },
      },
      {
        onSuccess: () => toast.success("Task rescheduled"),
      }
    );
  };

  const handleEventResize = (taskId: string, start: Date, end: Date) => {
    updateTaskMutation.mutate(
      {
        id: taskId,
        updates: { startDate: start.toISOString(), endDate: end.toISOString() },
      },
      {
        onSuccess: () => toast.success("Task duration updated"),
      }
    );
  };

  const handleDateClick = (date: Date) => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleCreateOrUpdateTask = (data: Omit<Task, "id">) => {
    if (editingTask) {
      updateTaskMutation.mutate(
        { id: editingTask.id, updates: data },
        { onSuccess: () => toast.success("Task updated") }
      );
    } else {
      createTaskMutation.mutate(data, {
        onSuccess: () => toast.success("Task created"),
      });
    }
  };

  const handleEditClick = (task: Task) => {
    setIsDrawerOpen(false);
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Task deleted");
        setIsDrawerOpen(false);
      },
    });
  };

  const handleCompleteTask = (task: Task) => {
    updateTaskMutation.mutate(
      { id: task.id, updates: { status: "Completed" } },
      {
        onSuccess: () => {
          toast.success("Task marked as complete");
          setSelectedTask({ ...task, status: "Completed" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center h="100vh" flexDirection="column" gap={4}>
        <Text fontSize="xl" color="red.500">
          Failed to load tasks
        </Text>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </Center>
    );
  }

  return (
    <Box
      p={{ base: 4, md: 8 }}
      bg="gray.50"
      _dark={{ bg: "gray.900" }}
      minH="100vh"
      w="100%"
    >
      <CalendarHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onFilterClick={() => toast("Filters opening soon!")}
        onCreateClick={() => {
          setEditingTask(null);
          setIsModalOpen(true);
        }}
      />

      <Box
        bg="white"
        _dark={{ bg: "gray.800" }}
        p={6}
        borderRadius="2xl"
        boxShadow="sm"
      >
        <CalendarToolbar
          currentDate={currentDate}
          currentView={currentView}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          onViewChange={setCurrentView}
        />

        {filteredTasks.length === 0 && !isLoading ? (
          <Center py={20} flexDirection="column">
            <Box mb={4} color="gray.300">
              <svg
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </Box>
            <Text fontSize="xl" fontWeight="600" mb={2}>
              No Tasks Scheduled
            </Text>
            <Text color="gray.500" mb={6}>
              You don't have any legal tasks for this period.
            </Text>
            <Button colorScheme="blue" onClick={() => setIsModalOpen(true)}>
              Create First Task
            </Button>
          </Center>
        ) : (
          <Flex h={{ base: "600px", lg: "700px" }} direction="column">
            <TaskCalendar
              tasks={filteredTasks}
              onEventClick={handleEventClick}
              onEventDrop={handleEventDrop}
              onEventResize={handleEventResize}
              onDateClick={handleDateClick}
              calendarRef={calendarRef}
              currentView={currentView}
            />
          </Flex>
        )}
      </Box>

      <CalendarLegend />

      <TaskDrawer
        isOpen={isDrawerOpen}
        task={selectedTask}
        onClose={() => setIsDrawerOpen(false)}
        onEdit={handleEditClick}
        onDelete={handleDeleteTask}
        onComplete={handleCompleteTask}
      />

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdateTask}
        initialData={editingTask}
      />
    </Box>
  );
};

export default TaskCalendarPage;
