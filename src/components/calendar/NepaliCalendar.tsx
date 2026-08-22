import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { Task } from "../../types/Task";
import { mapTaskToEvent } from "../../utils/calendarHelpers";
import {
  NepaliDateParts,
  NEPALI_FONT_STACK,
  NEPALI_WEEKDAY_SHORT,
  addNepaliDays,
  formatNepaliDate,
  getNepaliDaysInMonth,
  getNepaliMonthStart,
  getNepaliWeekStart,
  isSameNepaliDate,
  nepaliDateKey,
  nepaliToGregorian,
  toNepaliDigits,
} from "../../utils/nepaliDateUtils";
import { TaskEventCard } from "./TaskEventCard";
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverCloseTrigger,
} from "@/shared/components/ui/Popover";

export type CalendarView = "dayGridMonth" | "timeGridWeek" | "timeGridDay";

interface NepaliCalendarProps {
  view: CalendarView;
  /** Anchor Nepali date. Month view renders its year/month; week/day views render around it. */
  displayNepali: NepaliDateParts;
  /** Tasks keyed by Nepali date (`nepaliDateKey`). */
  tasksByNepaliDate: Map<string, Task[]>;
  selectedNepali: NepaliDateParts | null;
  todayNepali: NepaliDateParts;
  onDayClick: (nepali: NepaliDateParts) => void;
  onEventClick: (task: Task) => void;
  variant?: "page" | "widget";
}

interface DayCell {
  nepali: NepaliDateParts;
  isCurrentMonth: boolean;
}

const TOTAL_CELLS = 42; // 6 rows x 7 columns

const buildMonthCells = (year: number, month: number): DayCell[] => {
  const cells: DayCell[] = [];
  const daysInMonth = getNepaliDaysInMonth(year, month);
  const leading = getNepaliMonthStart(year, month).getDay(); // 0 = Sunday
  const prevYear = month === 0 ? year - 1 : year;
  const prevMonth = month === 0 ? 11 : month - 1;
  const daysInPrev = getNepaliDaysInMonth(prevYear, prevMonth);

  for (let i = 0; i < leading; i++) {
    cells.push({
      nepali: { year: prevYear, month: prevMonth, day: daysInPrev - leading + 1 + i },
      isCurrentMonth: false,
    });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ nepali: { year, month, day }, isCurrentMonth: true });
  }
  const nextYear = month === 11 ? year + 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  for (let day = 1; cells.length < TOTAL_CELLS; day++) {
    cells.push({ nepali: { year: nextYear, month: nextMonth, day }, isCurrentMonth: false });
  }
  return cells;
};

const buildWeekCells = (anchor: NepaliDateParts): DayCell[] => {
  const weekStart = getNepaliWeekStart(anchor);
  return Array.from({ length: 7 }, (_, i) => ({
    nepali: addNepaliDays(weekStart, i),
    isCurrentMonth: true,
  }));
};

const DEFAULT_ROW_COUNT = 3;
const ROW_GAP = 2;

/**
 * Renders the event chips for one day cell.
 *
 * The chip list lives in a flex-1, overflow-hidden container whose height is measured with
 * a ResizeObserver, so the number of visible chips adapts to the cell's available space.
 * The "+N more" popover trigger is rendered BELOW that clipped list in its own
 * flex-shrink-0 row, so it always stays visible no matter how many hearings overflow.
 */
const DayEvents = ({
  tasks,
  onEventClick,
}: {
  tasks: Task[];
  onEventClick: (task: Task) => void;
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [listHeight, setListHeight] = useState<number | null>(null);
  const [pillHeight, setPillHeight] = useState(18);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const update = () => {
      const firstPill = el.firstElementChild as HTMLElement | null;
      if (firstPill) setPillHeight(firstPill.offsetHeight);
      setListHeight(el.clientHeight);
    };
    const observer = new ResizeObserver(update);
    observer.observe(el);
    update();
    return () => observer.disconnect();
  }, []);

  // Each chip row is pill height + gap; the trailing gap is accounted for via "+ ROW_GAP".
  const rowsThatFit =
    listHeight === null
      ? DEFAULT_ROW_COUNT
      : Math.max(1, Math.floor((listHeight + ROW_GAP) / (pillHeight + ROW_GAP)));
  const visible = tasks.slice(0, Math.min(tasks.length, rowsThatFit));
  const overflow = tasks.slice(visible.length);

  const handleEventClick = (task: Task) => {
    setIsPopoverOpen(false);
    onEventClick(task);
  };  return (
    <>
      <Box
        ref={listRef}
        display="flex"
        flexDirection="column"
        gap="2px"
        minH={0}
        overflow="hidden"
        flex="1"
      >
        {visible.map((task) => {
          const event = mapTaskToEvent(task);
          const timeString = event.start
            ? new Date(event.start)
                .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                .toLowerCase()
                .replace(":00", "")
            : "";
          return (
            <Button
              key={task.id}
              w="100%"
              minH="18px"
              px={1}
              py={0}
              h="auto"
              justifyContent="flex-start"
              bg={event.backgroundColor}
              color="white"
              borderRadius="md"
              fontSize="10px"
              lineHeight="1.2"
              fontWeight="500"
              display="flex"
              alignItems="center"
              gap={1}
              overflow="hidden"
              onClick={(e) => {
                e.stopPropagation();
                handleEventClick(task);
              }}
              _hover={{ opacity: 0.85 }}
            >
              <Text as="span" fontWeight="600" opacity={0.9} flexShrink={0}>
                {timeString}
              </Text>
              <Text as="span" opacity={0.6} flexShrink={0}>
                ·
              </Text>
              <Text as="span" truncate>
                {task.title}
              </Text>
            </Button>
          );
        })}
      </Box>
      {overflow.length > 0 && (
        <PopoverRoot
          open={isPopoverOpen}
          onOpenChange={(e) => setIsPopoverOpen(e.open)}
          positioning={{ placement: "bottom-start" }}
        >
          <PopoverTrigger asChild>
            <Button
              size="xs"
              variant="ghost"
              color="gray.500"
              _dark={{ color: "gray.400" }}
              fontSize="10px"
              px={1}
              h="auto"
              minH="18px"
              flexShrink={0}
              mt="2px"
              onClick={(e) => e.stopPropagation()}
            >
              +{overflow.length} more
            </Button>
          </PopoverTrigger>
          <PopoverContent width="280px" maxH="320px" overflowY="auto" boxShadow="lg">
            <PopoverCloseTrigger />
            <PopoverBody p={2}>
              {overflow.map((task) => (
                <Button
                  key={task.id}
                  w="100%"
                  justifyContent="flex-start"
                  variant="ghost"
                  borderRadius="md"
                  px={2}
                  py={1.5}
                  h="auto"
                  display="flex"
                  alignItems="center"
                  gap={2}
                  onClick={(e) => {
                    // Popover content is portalled; React events still bubble through the
                    // cell's fiber tree, so stop propagation to avoid opening the hearing modal.
                    e.stopPropagation();
                    handleEventClick(task);
                  }}
                >
                  <Box
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    bg={mapTaskToEvent(task).backgroundColor}
                    flexShrink={0}
                  />
                  <Text fontSize="sm" fontWeight="500" truncate>
                    {task.title}
                  </Text>
                </Button>
              ))}
            </PopoverBody>
          </PopoverContent>
        </PopoverRoot>
      )}
    </>
  );
};

export const NepaliCalendar = ({
  view,
  displayNepali,
  tasksByNepaliDate,
  selectedNepali,
  todayNepali,
  onDayClick,
  onEventClick,
  variant = "page",
}: NepaliCalendarProps) => {
  const cells = useMemo(() => {
    if (view === "timeGridWeek") return buildWeekCells(displayNepali);
    if (view === "timeGridDay")
      return [{ nepali: displayNepali, isCurrentMonth: true }];
    return buildMonthCells(displayNepali.year, displayNepali.month);
  }, [view, displayNepali]);

  const showWeekdayHeader = view !== "timeGridDay";

  if (variant === "widget") {
    return (
      <Box>
        <Box
          display="grid"
          gridTemplateColumns="repeat(7, 1fr)"
          textAlign="center"
          mb={1}
        >
          {NEPALI_WEEKDAY_SHORT.map((weekday) => (
            <Text
              key={weekday}
              fontSize="11px"
              fontWeight="600"
              color="gray.400"
              py={1}
              fontFamily={NEPALI_FONT_STACK}
            >
              {weekday}
            </Text>
          ))}
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" rowGap={1}>
          {cells.map((cell) => {
            const isToday = isSameNepaliDate(cell.nepali, todayNepali);
            const isSelected = isSameNepaliDate(cell.nepali, selectedNepali);
            const gregorianDay = nepaliToGregorian(cell.nepali).getDate();
            return (
              <Box key={nepaliDateKey(cell.nepali)} textAlign="center" py="2px">
                <Button
                  w="100%"
                  minH="40px"
                  p={1}
                  borderRadius="md"
                  bg={isSelected ? "blue.500" : "transparent"}
                  _hover={!isSelected ? { bg: "gray.100" } : undefined}
                  onClick={() => onDayClick(cell.nepali)}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  gap={0}
                >
                  <Text
                    fontSize="sm"
                    lineHeight="1.25"
                    fontWeight={isToday ? 700 : 600}
                    fontFamily={NEPALI_FONT_STACK}
                    color={
                      isSelected
                        ? "white"
                        : cell.isCurrentMonth
                          ? isToday
                            ? "blue.600"
                            : "gray.700"
                          : "gray.300"
                    }
                    _dark={
                      isSelected
                        ? { color: "white" }
                        : { color: cell.isCurrentMonth ? "gray.300" : "gray.600" }
                    }
                  >
                    {toNepaliDigits(cell.nepali.day)}
                  </Text>
                  <Text
                    fontSize="9px"
                    lineHeight="1.25"
                    color={
                      isSelected
                        ? "whiteAlpha.800"
                        : cell.isCurrentMonth
                          ? "gray.400"
                          : "gray.300"
                    }
                    _dark={{
                      color: isSelected ? "whiteAlpha.800" : cell.isCurrentMonth ? "gray.500" : "gray.600",
                    }}
                  >
                    • {gregorianDay}
                  </Text>
                </Button>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  }

  if (view === "timeGridDay") {
    const tasks = tasksByNepaliDate.get(nepaliDateKey(displayNepali)) ?? [];
    return (
      <Box
        display="flex"
        flexDirection="column"
        h="100%"
        minH={0}
        border="1px solid"
        borderColor="gray.200"
        _dark={{ borderColor: "gray.700" }}
        borderRadius="12px"
        overflow="hidden"
      >
        <Box
          px={4}
          py={3}
          borderBottom="1px solid"
          borderColor="gray.200"
          bg="gray.50"
          _dark={{ borderColor: "gray.700", bg: "gray.800" }}
          flexShrink={0}
        >
          <Text
            fontSize="md"
            fontWeight="600"
            color="gray.700"
            _dark={{ color: "gray.200" }}
            fontFamily={NEPALI_FONT_STACK}
          >
            {formatNepaliDate(displayNepali)}
          </Text>
          <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
            {format(nepaliToGregorian(displayNepali), "MMMM d, yyyy")}
          </Text>
        </Box>
        <Box flex="1" minH={0} overflowY="auto" p={4} display="flex" flexDirection="column" gap={2}>
          {tasks.length === 0 ? (
            <Text fontSize="sm" color="gray.500">
              No hearings or events on this day.
            </Text>
          ) : (
            tasks.map((task) => (
              <Box
                key={task.id}
                h="44px"
                w="100%"
                cursor="pointer"
                onClick={() => onEventClick(task)}
              >
                <TaskEventCard event={mapTaskToEvent(task)} />
              </Box>
            ))
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" h="100%" minH={0}>
      {showWeekdayHeader && (
        <Box
          display="grid"
          gridTemplateColumns="repeat(7, 1fr)"
          borderBottom="1px solid"
          borderColor="gray.200"
          _dark={{ borderColor: "gray.700" }}
          flexShrink={0}
        >
          {NEPALI_WEEKDAY_SHORT.map((weekday) => (
            <Text
              key={weekday}
              textAlign="center"
              py={2}
              fontSize="xs"
              fontWeight="600"
              color="gray.500"
              _dark={{ color: "gray.400" }}
              fontFamily={NEPALI_FONT_STACK}
            >
              {weekday}
            </Text>
          ))}
        </Box>
      )}

      <Box
        display="grid"
        gridTemplateColumns="repeat(7, minmax(0, 1fr))"
        gridTemplateRows={view === "dayGridMonth" ? "repeat(6, minmax(0, 1fr))" : "minmax(0, 1fr)"}
        flex="1"
        minH={0}
      >
        {cells.map((cell, index) => {
          const key = nepaliDateKey(cell.nepali);
          const tasks = tasksByNepaliDate.get(key) ?? [];
          const isToday = isSameNepaliDate(cell.nepali, todayNepali);
          const isSelected = isSameNepaliDate(cell.nepali, selectedNepali);
          const row = Math.floor(index / 7);
          const col = index % 7;
          const gregorianDay = nepaliToGregorian(cell.nepali).getDate();

          return (
            <Box
              key={key}
              minH={0}
              overflow="hidden"
              cursor="pointer"
              display="flex"
              flexDirection="column"
              gap={1}
              p={1}
              bg={isToday || isSelected ? "blue.50" : "transparent"}
              _dark={{
                bg: isToday || isSelected ? "rgba(59, 130, 246, 0.12)" : "transparent",
                borderColor: "gray.700",
              }}
              borderLeftWidth={col === 0 ? 0 : "1px"}
              borderTopWidth={row === 0 ? 0 : "1px"}
              borderColor="gray.100"
              onClick={() => onDayClick(cell.nepali)}
              _hover={{ bg: "gray.50", _dark: { bg: "gray.800" } }}
            >
              <Box display="flex" flexDirection="column" alignItems="flex-start" gap="2px" flexShrink={0}>
                <Box
                  w={isSelected ? "34px" : undefined}
                  h={isSelected ? "34px" : undefined}
                  minW={isSelected ? "34px" : undefined}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="full"
                  bg={isSelected ? "blue.500" : "transparent"}
                >
                  <Text
                    fontSize="lg"
                    lineHeight="1"
                    fontWeight={isToday ? 700 : 600}
                    fontFamily={NEPALI_FONT_STACK}
                    color={
                      isSelected
                        ? "white"
                        : cell.isCurrentMonth
                          ? isToday
                            ? "blue.600"
                            : "gray.800"
                          : "gray.300"
                    }
                    _dark={
                      isSelected
                        ? { color: "white" }
                        : { color: cell.isCurrentMonth ? "gray.200" : "gray.600" }
                    }
                  >
                    {toNepaliDigits(cell.nepali.day)}
                  </Text>
                </Box>
                <Text
                  fontSize="xs"
                  lineHeight="1"
                  color={cell.isCurrentMonth ? "gray.400" : "gray.300"}
                  _dark={{ color: cell.isCurrentMonth ? "gray.500" : "gray.600" }}
                >
                  • {gregorianDay}
                </Text>
              </Box>

              {tasks.length > 0 && (
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="2px"
                  minH={0}
                  overflow="hidden"
                  flex="1"
                >
                  <DayEvents tasks={tasks} onEventClick={onEventClick} />
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
