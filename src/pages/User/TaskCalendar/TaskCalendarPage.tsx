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
import { useNavigate } from "react-router-dom";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarToolbar } from "@/components/calendar/CalendarToolbar";
import { TaskCalendar } from "@/components/calendar/TaskCalendar";
import { TaskDrawer } from "@/components/calendar/TaskDrawer";
import { CreateTaskModal } from "@/components/calendar/CreateTaskModal";
import { CalendarLegend } from "@/components/calendar/CalendarLegend";
import { useCalendarEvents } from "@/hooks/useCalendarApi";
import { Task } from "@/types/Task";
import { mapCalendarEventToTask } from "@/utils/calendarHelpers";
import {
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  format,
} from "date-fns";
import toast from "react-hot-toast";

const TaskCalendarPage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("dayGridMonth");

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const calendarRef = useRef<any>(null);

  // Calculate date range based on current view
  const getVisibleDateRange = () => {
    const start = currentDate; // July 2026
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // July 2026
    return {
      from: format(start, "yyyy-MM-dd"),
      to: format(end, "yyyy-MM-dd"),
    };
  };

  const dateRange = getVisibleDateRange();
  const {
    data: calendarEvents,
    isLoading,
    isError,
  } = useCalendarEvents(dateRange);

  // Map CalendarEvent to Task for existing UI
  const tasks = calendarEvents?.map(mapCalendarEventToTask) || [];

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
    // Calendar events are read-only from the API
    // Drag and drop is not supported for calendar events
    toast("Event rescheduling is not supported for calendar events");
  };

  const handleEventResize = (taskId: string, start: Date, end: Date) => {
    // Calendar events are read-only from the API
    // Resizing is not supported for calendar events
    toast("Event duration update is not supported for calendar events");
  };

  const handleDateClick = (date: Date) => {
    // Navigate to create case page instead of opening modal
    navigate("/cases/create");
  };

  const handleCreateOrUpdateTask = (data: Omit<Task, "id">) => {
    // Not used - calendar events are read-only
    toast("Creating new calendar events is not supported");
  };

  const handleEditClick = (task: Task) => {
    // Navigate to case detail page
    if (task.caseNumber) {
      navigate(`/cases/${task.caseNumber}`);
    }
  };

  const handleDeleteTask = (id: string) => {
    // Calendar events cannot be deleted from the calendar
    toast("Deleting calendar events is not supported");
  };

  const handleCompleteTask = (task: Task) => {
    // Status updates will be handled via the Case Update API in the drawer
    // This is a placeholder - actual implementation will be in the drawer
    toast("Status update will be handled via case update");
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
        onCreateClick={() => navigate("/cases/create")}
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
            <Button
              colorScheme="blue"
              onClick={() => navigate("/cases/create")}
            >
              Create First Case
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
    </Box>
  );
};

export default TaskCalendarPage;
