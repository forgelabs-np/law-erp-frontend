import { useState, useRef, ChangeEvent, useMemo, useCallback } from "react";
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
import { CalendarHearingFormModal } from "./CalendarHearingFormModal";
import { Hearing } from "@/pages/User/CaseManagement/types/hearing.types";
import {
  useCreateHearingMutation,
  useUpdateHearingMutation,
  useDeleteHearingMutation,
  useGetHearingQuery,
} from "@/pages/User/CaseManagement/api/hearing.api";

const TaskCalendarPage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentDateStr, setCurrentDateStr] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [currentView, setCurrentView] = useState("dayGridMonth");

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Hearing modal state
  const [isHearingModalOpen, setIsHearingModalOpen] = useState(false);
  const [editingHearing, setEditingHearing] = useState<Hearing | null>(null);
  const [prefilledDate, setPrefilledDate] = useState<string | undefined>();

  const calendarRef = useRef<any>(null);

  // Hearing mutations
  const createHearingMutation = useCreateHearingMutation();
  const updateHearingMutation = useUpdateHearingMutation();
  const deleteHearingMutation = useDeleteHearingMutation();

  // Fetch hearing details for editing
  const { data: hearingDetails, isLoading: hearingLoading } = useGetHearingQuery(
    editingHearing?.id || ""
  );
  
  // Memoized dateRange object for API call - uses string state for stability
  const dateRange = useMemo(() => {
    const start = new Date(currentDateStr);
    let end: Date;
    
    if (currentView === "dayGridMonth") {
      end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    } else if (currentView === "timeGridWeek") {
      end = new Date(start);
      end.setDate(end.getDate() + 7);
    } else {
      // timeGridDay
      end = new Date(start);
    }
    
    return {
      from: format(start, "yyyy-MM-dd"),
      to: format(end, "yyyy-MM-dd"),
    };
  }, [currentDateStr, currentView]);
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
    const newDate = new Date(currentDate);
    if (currentView === "dayGridMonth") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (currentView === "timeGridWeek") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDateStr(format(newDate, "yyyy-MM-dd"));
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === "dayGridMonth") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (currentView === "timeGridWeek") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDateStr(format(newDate, "yyyy-MM-dd"));
  };

  const handleToday = () => {
    setCurrentDateStr(format(new Date(), "yyyy-MM-dd"));
  };

  // Memoized Date object from string for calendar component
  const currentDate = useMemo(() => new Date(currentDateStr), [currentDateStr]);

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
    // Open hearing modal with prefilled date
    setEditingHearing(null);
    setPrefilledDate(format(date, "yyyy-MM-dd"));
    setIsHearingModalOpen(true);
  };

  const handleCreateHearing = () => {
    // Open hearing modal with today's date
    setEditingHearing(null);
    setPrefilledDate(format(new Date(), "yyyy-MM-dd"));
    setIsHearingModalOpen(true);
  };

  const handleEditHearing = (task: Task) => {
    // Fetch hearing details and open modal in edit mode
    setEditingHearing({ id: task.id } as Hearing);
    setPrefilledDate(undefined);
    setIsHearingModalOpen(true);
  };

  const handleHearingSubmit = (data: any) => {
    if (editingHearing) {
      updateHearingMutation.mutate({
        hearingId: editingHearing.id,
        data,
      });
    } else {
      createHearingMutation.mutate({
        caseNumber: data.caseNumber,
        data,
      });
    }
    setIsHearingModalOpen(false);
    setEditingHearing(null);
    setPrefilledDate(undefined);
  };

  const handleDeleteHearing = (hearingId: string) => {
    if (
      confirm(
        "Are you sure you want to cancel this hearing? This action cannot be undone."
      )
    ) {
      deleteHearingMutation.mutate(hearingId);
      setIsHearingModalOpen(false);
      setEditingHearing(null);
    }
  };

  const handleCreateOrUpdateTask = (data: Omit<Task, "id">) => {
    // Not used - calendar events are read-only
    toast("Creating new calendar events is not supported");
  };

  const handleEditClick = (task: Task) => {
    // Close drawer and open hearing modal in edit mode
    setIsDrawerOpen(false);
    handleEditHearing(task);
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
  console.log(hearingDetails, editingHearing,"hearingsss")

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
        onCreateClick={handleCreateHearing}
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

        <Flex h={{ base: "600px", lg: "700px" }} direction="column">
          <TaskCalendar
            tasks={filteredTasks}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            onDateClick={handleDateClick}
            calendarRef={calendarRef}
            currentView={currentView}
            currentDate={currentDate}
          />
        </Flex>
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

      <CalendarHearingFormModal
        isOpen={isHearingModalOpen}
        onClose={() => {
          setIsHearingModalOpen(false);
          setEditingHearing(null);
          setPrefilledDate(undefined);
        }}
        onSubmit={handleHearingSubmit}
        initialData={hearingDetails || editingHearing}
        prefilledDate={prefilledDate}
        onDelete={editingHearing ? handleDeleteHearing : undefined}
      />
    </Box>
  );
};

export default TaskCalendarPage;
