import { useState, useMemo, ChangeEvent } from "react";
import {
  Box,
  Flex,
  Spinner,
  Text,
  Button,
} from "@chakra-ui/react";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarToolbar } from "@/components/calendar/CalendarToolbar";
import { NepaliCalendar, CalendarView } from "@/components/calendar/NepaliCalendar";
import { TaskDrawer } from "@/components/calendar/TaskDrawer";
import { CalendarLegend } from "@/components/calendar/CalendarLegend";
import { useCalendarEvents } from "@/hooks/useCalendarApi";
import { Task } from "@/types/Task";
import { mapCalendarEventToTask } from "@/utils/calendarHelpers";
import {
  NepaliDateParts,
  addNepaliDays,
  formatApiDate,
  formatGregorianMonthRange,
  formatNepaliDate,
  formatNepaliDateRange,
  formatNepaliMonthYear,
  getNepaliMonthEnd,
  getNepaliMonthStart,
  getNepaliWeekStart,
  gregorianToNepali,
  nepaliDateKey,
  nepaliToGregorian,
  parseApiDate,
  shiftNepaliMonth,
} from "@/utils/nepaliDateUtils";
import { format } from "date-fns";
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
  const [searchQuery, setSearchQuery] = useState("");
  // Single source of truth for what the Nepali calendar displays (BS).
  // The backend continues to receive Gregorian (AD) dates derived from this.
  const [displayNepali, setDisplayNepali] = useState<NepaliDateParts>(() =>
    gregorianToNepali(new Date())
  );
  const [selectedNepali, setSelectedNepali] = useState<NepaliDateParts | null>(null);
  const [currentView, setCurrentView] = useState<CalendarView>("dayGridMonth");

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Hearing modal state
  const [isHearingModalOpen, setIsHearingModalOpen] = useState(false);
  const [editingHearing, setEditingHearing] = useState<Hearing | null>(null);
  const [prefilledDate, setPrefilledDate] = useState<string | undefined>();

  // Hearing mutations
  const createHearingMutation = useCreateHearingMutation();
  const updateHearingMutation = useUpdateHearingMutation();
  const deleteHearingMutation = useDeleteHearingMutation();

  // Fetch hearing details for editing
  const { data: hearingDetails, isLoading: hearingLoading } = useGetHearingQuery(
    editingHearing?.id || ""
  );

  // Today in BS (stable for the session).
  const todayNepali = useMemo(() => gregorianToNepali(new Date()), []);

  // Gregorian (AD) date range for the API, derived from the displayed Nepali period.
  // Changing the Nepali month/view changes this range -> exactly one new API request.
  const dateRange = useMemo(() => {
    if (currentView === "timeGridWeek") {
      const weekStart = getNepaliWeekStart(displayNepali);
      const weekEnd = addNepaliDays(weekStart, 6);
      return {
        from: formatApiDate(nepaliToGregorian(weekStart)),
        to: formatApiDate(nepaliToGregorian(weekEnd)),
      };
    }
    if (currentView === "timeGridDay") {
      const day = formatApiDate(nepaliToGregorian(displayNepali));
      return { from: day, to: day };
    }
    return {
      from: formatApiDate(
        getNepaliMonthStart(displayNepali.year, displayNepali.month)
      ),
      to: formatApiDate(
        getNepaliMonthEnd(displayNepali.year, displayNepali.month)
      ),
    };
  }, [displayNepali, currentView]);

  const {
    data: calendarEvents,
    isFetching,
    isError,
    refetch,
  } = useCalendarEvents(dateRange);

  // Map CalendarEvent to Task for existing UI
  const tasks = useMemo(
    () => calendarEvents?.map(mapCalendarEventToTask) || [],
    [calendarEvents]
  );

  // Nepali title (primary) + Gregorian range (secondary) for the toolbar.
  const { toolbarTitle, toolbarSubtitle } = useMemo(() => {
    if (currentView === "timeGridWeek") {
      const weekStart = getNepaliWeekStart(displayNepali);
      const weekEnd = addNepaliDays(weekStart, 6);
      return {
        toolbarTitle: formatNepaliDateRange(weekStart, weekEnd),
        toolbarSubtitle: `${format(nepaliToGregorian(weekStart), "MMM d")} – ${format(
          nepaliToGregorian(weekEnd),
          "MMM d, yyyy"
        )}`,
      };
    }
    if (currentView === "timeGridDay") {
      return {
        toolbarTitle: formatNepaliDate(displayNepali),
        toolbarSubtitle: format(nepaliToGregorian(displayNepali), "MMMM d, yyyy"),
      };
    }
    return {
      toolbarTitle: formatNepaliMonthYear(displayNepali.year, displayNepali.month),
      toolbarSubtitle: formatGregorianMonthRange(
        getNepaliMonthStart(displayNepali.year, displayNepali.month),
        getNepaliMonthEnd(displayNepali.year, displayNepali.month)
      ),
    };
  }, [displayNepali, currentView]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Events within the visible Nepali month/week/day (same filtering as tasks).
  const visibleTasks = useMemo(() => {
    if (searchQuery.trim() === "") return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter(
      (task: Task) =>
        task.title.toLowerCase().includes(query) ||
        task.client.toLowerCase().includes(query) ||
        task.assignedLawyer.toLowerCase().includes(query) ||
        task.caseNumber?.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  const visibleTasksByNepaliDate = useMemo(() => {
    const byNepaliDate = new Map<string, Task[]>();
    visibleTasks.forEach((task: Task) => {
      const adDate = parseApiDate(task.startDate.slice(0, 10));
      const nepali = gregorianToNepali(adDate);
      const key = nepaliDateKey(nepali);
      const existing = byNepaliDate.get(key);
      if (existing) {
        existing.push(task);
      } else {
        byNepaliDate.set(key, [task]);
      }
    });
    return byNepaliDate;
  }, [visibleTasks]);

  const handlePrev = () => {
    setDisplayNepali((prev) => {
      if (currentView === "dayGridMonth") return shiftNepaliMonth(prev, -1);
      if (currentView === "timeGridWeek") return addNepaliDays(prev, -7);
      return addNepaliDays(prev, -1);
    });
  };

  const handleNext = () => {
    setDisplayNepali((prev) => {
      if (currentView === "dayGridMonth") return shiftNepaliMonth(prev, 1);
      if (currentView === "timeGridWeek") return addNepaliDays(prev, 7);
      return addNepaliDays(prev, 1);
    });
  };

  const handleToday = () => {
    const today = gregorianToNepali(new Date());
    setDisplayNepali(today);
    setSelectedNepali(today);
  };

  const handleEventClick = (task: Task) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  const handleDateClick = (nepali: NepaliDateParts) => {
    // Highlight the selected Nepali day and open the hearing modal prefilled
    // with the equivalent Gregorian date (what the API expects).
    setSelectedNepali(nepali);
    setEditingHearing(null);
    setPrefilledDate(formatApiDate(nepaliToGregorian(nepali)));
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
    // Clear the temporary day highlight once the interaction is finished.
    setSelectedNepali(null);
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
      setSelectedNepali(null);
    }
  };

  const handleEditClick = (task: Task) => {
    // Close drawer and open hearing modal in edit mode
    setIsDrawerOpen(false);
    handleEditHearing(task);
  };

  const handleDeleteTask = () => {
    // Calendar events cannot be deleted from the calendar
    toast("Deleting calendar events is not supported");
  };

  const handleCompleteTask = () => {
    // Status updates will be handled via the Case Update API in the drawer
    // This is a placeholder - actual implementation will be in the drawer
    toast("Status update will be handled via case update");
  };

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
          title={toolbarTitle}
          subtitle={toolbarSubtitle}
          currentView={currentView}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          onViewChange={setCurrentView}
        />

        {isError && (
          <Flex
            alignItems="center"
            justifyContent="space-between"
            gap={3}
            mb={3}
            bg="red.50"
            _dark={{ bg: "rgba(254, 226, 226, 0.1)", borderColor: "red.800" }}
            border="1px solid"
            borderColor="red.200"
            px={4}
            py={2}
            borderRadius="md"
          >
            <Text fontSize="sm" color="red.600" _dark={{ color: "red.300" }}>
              Failed to load events.
            </Text>
            <Button
              size="xs"
              variant="outline"
              colorScheme="red"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </Flex>
        )}

        <Flex h={{ base: "600px", lg: "700px" }} direction="column">
          <Box position="relative" flex="1" minH={0}>
            <NepaliCalendar
              view={currentView}
              displayNepali={displayNepali}
              tasksByNepaliDate={visibleTasksByNepaliDate}
              selectedNepali={selectedNepali}
              todayNepali={todayNepali}
              onDayClick={handleDateClick}
              onEventClick={handleEventClick}
            />
            {isFetching && (
              <Flex
                position="absolute"
                top={3}
                right={3}
                alignItems="center"
                gap={2}
                bg="white"
                _dark={{ bg: "gray.800" }}
                px={3}
                py={1.5}
                borderRadius="full"
                boxShadow="sm"
                zIndex={2}
              >
                <Spinner size="sm" color="blue.500" />
                <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.300" }}>
                  Loading events…
                </Text>
              </Flex>
            )}
          </Box>
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
          // Clear the temporary day highlight once the modal closes.
          setSelectedNepali(null);
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
