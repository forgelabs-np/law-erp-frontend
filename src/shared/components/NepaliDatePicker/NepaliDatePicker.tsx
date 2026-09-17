import { useState, useCallback, useMemo } from "react";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/components/ui/Popover";

import {
  NepaliDateParts,
  NEPALI_FONT_STACK,
  NEPALI_MONTH_NAMES,
  NEPALI_WEEKDAY_SHORT,
  getNepaliDaysInMonth,
  getNepaliMonthStart,
  gregorianToNepali,
  isSameNepaliDate,
  nepaliDateKey,
  nepaliToGregorian,
  toNepaliDigits,
} from "@/utils/nepaliDateUtils";

// ==================== Types ====================

type CalendarMode = "BS" | "AD";

interface NepaliDatePickerProps {
  value: NepaliDateParts | null;
  onChange: (date: NepaliDateParts) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface GregorianDateParts {
  year: number;
  month: number; // 0-based
  day: number;
}

// ==================== Constants ====================

const TOTAL_CELLS = 42;

const GREGORIAN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const GREGORIAN_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ==================== Utility Functions ====================

/** Convert NepaliDateParts to GregorianDateParts */
const nepaliToGregorianParts = (parts: NepaliDateParts): GregorianDateParts => {
  const date = nepaliToGregorian(parts);
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
};

/** Convert GregorianDateParts to NepaliDateParts */
const gregorianPartsToNepali = (parts: GregorianDateParts): NepaliDateParts => {
  const date = new Date(parts.year, parts.month, parts.day);
  return gregorianToNepali(date);
};

/** Build a 6-week grid of Nepali dates for a month */
const buildNepaliMonthCells = (year: number, month: number): NepaliDateParts[] => {
  const cells: NepaliDateParts[] = [];
  const daysInMonth = getNepaliDaysInMonth(year, month);
  const leading = getNepaliMonthStart(year, month).getDay();
  const prevYear = month === 0 ? year - 1 : year;
  const prevMonth = month === 0 ? 11 : month - 1;
  const daysInPrev = getNepaliDaysInMonth(prevYear, prevMonth);

  for (let i = 0; i < leading; i++) {
    cells.push({
      year: prevYear,
      month: prevMonth,
      day: daysInPrev - leading + 1 + i,
    });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ year, month, day });
  }
  const nextYear = month === 11 ? year + 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  for (let day = 1; cells.length < TOTAL_CELLS; day++) {
    cells.push({ year: nextYear, month: nextMonth, day });
  }
  return cells;
};

/** Build a 6-week grid of Gregorian dates for a month */
const buildGregorianMonthCells = (year: number, month: number): GregorianDateParts[] => {
  const cells: GregorianDateParts[] = [];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    cells.push({
      year: prevYear,
      month: prevMonth,
      day: daysInPrevMonth - firstDay + 1 + i,
    });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ year, month, day });
  }
  const nextYear = month === 11 ? year + 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  for (let day = 1; cells.length < TOTAL_CELLS; day++) {
    cells.push({ year: nextYear, month: nextMonth, day });
  }
  return cells;
};

/** Format Gregorian date parts for display */
const formatDateForDisplay = (date: NepaliDateParts, mode: CalendarMode): string => {
  if (mode === "BS") {
    return `${toNepaliDigits(date.year)} ${NEPALI_MONTH_NAMES[date.month]} ${toNepaliDigits(date.day)}`;
  }
  const gregorian = nepaliToGregorianParts(date);
  return `${GREGORIAN_MONTHS[gregorian.month]} ${gregorian.day}, ${gregorian.year}`;
};

/** Format Gregorian date as yyyy-MM-dd string */
const formatGregorianDate = (year: number, month: number, day: number): string => {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

// ==================== Main Component ====================

export const NepaliDatePicker = ({
  value,
  onChange,
  placeholder = "Select BS date",
  disabled,
}: NepaliDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("BS");

  // Get today's date in both formats
  const todayNepali = useMemo(() => gregorianToNepali(new Date()), []);
  const todayGregorian = useMemo(() => ({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: new Date().getDate(),
  }), []);

  // BS calendar state
  const [bsViewMonth, setBsViewMonth] = useState<NepaliDateParts>(() => {
    return value || { year: todayNepali.year, month: todayNepali.month, day: 1 };
  });

  // AD calendar state
  const [adViewDate, setAdViewDate] = useState<GregorianDateParts>(() => {
    if (value) {
      return nepaliToGregorianParts(value);
    }
    return { year: todayGregorian.year, month: todayGregorian.month, day: 1 };
  });

  // Build cells based on current mode
  const bsCells = useMemo(() => {
    if (calendarMode === "BS") {
      return buildNepaliMonthCells(bsViewMonth.year, bsViewMonth.month);
    }
    return [];
  }, [calendarMode, bsViewMonth.year, bsViewMonth.month]);

  const adCells = useMemo(() => {
    if (calendarMode === "AD") {
      return buildGregorianMonthCells(adViewDate.year, adViewDate.month);
    }
    return [];
  }, [calendarMode, adViewDate.year, adViewDate.month]);

  // Handle calendar mode switch
  const handleModeChange = useCallback((newMode: CalendarMode) => {
    if (newMode === calendarMode) return;
    
    // Convert the currently viewed month to the new mode
    if (calendarMode === "BS" && newMode === "AD") {
      // Convert current BS view month to AD
      const gregorian = nepaliToGregorianParts({ 
        year: bsViewMonth.year, 
        month: bsViewMonth.month, 
        day: 1 
      });
      setAdViewDate({ year: gregorian.year, month: gregorian.month, day: 1 });
    } else if (calendarMode === "AD" && newMode === "BS") {
      // Convert current AD view date to BS
      const nepali = gregorianPartsToNepali({ 
        year: adViewDate.year, 
        month: adViewDate.month, 
        day: 1 
      });
      setBsViewMonth({ year: nepali.year, month: nepali.month, day: 1 });
    }
    
    setCalendarMode(newMode);
  }, [calendarMode, bsViewMonth, adViewDate]);

  // Handle today click
  const handleTodayClick = useCallback(() => {
    if (calendarMode === "BS") {
      setBsViewMonth({ year: todayNepali.year, month: todayNepali.month, day: 1 });
      onChange(todayNepali);
    } else {
      setAdViewDate({ year: todayGregorian.year, month: todayGregorian.month, day: 1 });
      onChange(todayNepali); // Still return NepaliDateParts for consistency
    }
    setIsOpen(false);
  }, [calendarMode, todayNepali, todayGregorian, onChange]);

  // Handle previous/next month navigation
  const handlePreviousMonth = useCallback(() => {
    if (calendarMode === "BS") {
      setBsViewMonth((prev) => {
        const newMonth = prev.month === 0 ? 11 : prev.month - 1;
        const newYear = prev.month === 0 ? prev.year - 1 : prev.year;
        return { year: newYear, month: newMonth, day: 1 };
      });
    } else {
      setAdViewDate((prev) => ({
        year: prev.month === 0 ? prev.year - 1 : prev.year,
        month: prev.month === 0 ? 11 : prev.month - 1,
        day: 1,
      }));
    }
  }, [calendarMode]);

  const handleNextMonth = useCallback(() => {
    if (calendarMode === "BS") {
      setBsViewMonth((prev) => {
        const newMonth = prev.month === 11 ? 0 : prev.month + 1;
        const newYear = prev.month === 11 ? prev.year + 1 : prev.year;
        return { year: newYear, month: newMonth, day: 1 };
      });
    } else {
      setAdViewDate((prev) => ({
        year: prev.month === 11 ? prev.year + 1 : prev.year,
        month: prev.month === 11 ? 0 : prev.month + 1,
        day: 1,
      }));
    }
  }, [calendarMode]);

  // Handle day selection
  const handleBsDayClick = useCallback((date: NepaliDateParts) => {
    onChange(date);
    setIsOpen(false);
  }, [onChange]);

  const handleAdDayClick = useCallback((date: GregorianDateParts) => {
    // Convert to NepaliDateParts for the callback
    const nepali = gregorianPartsToNepali(date);
    onChange(nepali);
    setIsOpen(false);
  }, [onChange]);

  // Display value
  const displayValue = value ? formatDateForDisplay(value, calendarMode) : "";

  // Current view month/year display
  const currentViewDisplay = useMemo(() => {
    if (calendarMode === "BS") {
      return `${NEPALI_MONTH_NAMES[bsViewMonth.month]} ${toNepaliDigits(bsViewMonth.year)}`;
    }
    return `${GREGORIAN_MONTHS[adViewDate.month]} ${adViewDate.year}`;
  }, [calendarMode, bsViewMonth, adViewDate]);

  return (
    <PopoverRoot
      open={isOpen}
      onOpenChange={(e) => setIsOpen(e.open)}
      positioning={{ placement: "bottom-start" }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          px={3}
          py={2}
          bg="white"
          borderColor="#E5E7EB"
          borderRadius="md"
          cursor={disabled ? "not-allowed" : "pointer"}
          disabled={disabled}
          _hover={{ borderColor: "#0056FF" }}
          _focus={{ borderColor: "#0056FF", boxShadow: "0 0 0 1px #0056FF" }}
          _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
          minW="200px"
          justifyContent="space-between"
        >
          <Text
            fontSize="sm"
            color={displayValue ? "#1F2937" : "#9CA3AF"}
            fontFamily={calendarMode === "BS" ? NEPALI_FONT_STACK : "inherit"}
          >
            {displayValue || placeholder}
          </Text>
          <Calendar size={16} color="#6B7280" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        width="320px"
        maxH="420px"
        p={3}
        bg="white"
        border="1px solid"
        borderColor="#E5E7EB"
        borderRadius="12px"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      >
        <VStack gap={3} align="stretch">
          {/* AD/BS Switcher + Month/Year Header */}
          <HStack justify="space-between" align="center">
            <Button
              variant="ghost"
              size="xs"
              p={1}
              onClick={handlePreviousMonth}
              disabled={disabled}
              aria-label={calendarMode === "BS" ? "Previous BS month" : "Previous month"}
            >
              <ChevronLeft size={14} />
            </Button>
            
            <HStack gap={2} align="center">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="#1F2937"
                fontFamily={calendarMode === "BS" ? NEPALI_FONT_STACK : "inherit"}
              >
                {currentViewDisplay}
              </Text>
              
              {/* AD/BS Toggle */}
              <Box
                display="inline-flex"
                bg="gray.100"
                borderRadius="md"
                p="2px"
              >
                <Button
                  size="xs"
                  variant={calendarMode === "BS" ? "solid" : "ghost"}
                  colorScheme={calendarMode === "BS" ? "blue" : "gray"}
                  onClick={() => handleModeChange("BS")}
                  disabled={disabled}
                  px={2}
                  py={1}
                  minW="32px"
                  height="24px"
                  fontSize="xs"
                  fontWeight="medium"
                  borderRadius="sm"
                >
                  BS
                </Button>
                <Button
                  size="xs"
                  variant={calendarMode === "AD" ? "solid" : "ghost"}
                  colorScheme={calendarMode === "AD" ? "blue" : "gray"}
                  onClick={() => handleModeChange("AD")}
                  disabled={disabled}
                  px={2}
                  py={1}
                  minW="32px"
                  height="24px"
                  fontSize="xs"
                  fontWeight="medium"
                  borderRadius="sm"
                >
                  AD
                </Button>
              </Box>
            </HStack>
            
            <Button
              variant="ghost"
              size="xs"
              p={1}
              onClick={handleNextMonth}
              disabled={disabled}
              aria-label={calendarMode === "BS" ? "Next BS month" : "Next month"}
            >
              <ChevronRight size={14} />
            </Button>
          </HStack>

          {/* Weekday Headers */}
          <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={0}>
            {calendarMode === "BS"
              ? NEPALI_WEEKDAY_SHORT.map((day) => (
                  <Text
                    key={day}
                    fontSize="9px"
                    fontWeight="600"
                    color="#6B7280"
                    textAlign="center"
                    fontFamily={NEPALI_FONT_STACK}
                    py={0.5}
                  >
                    {day}
                  </Text>
                ))
              : GREGORIAN_WEEKDAYS.map((day) => (
                  <Text
                    key={day}
                    fontSize="9px"
                    fontWeight="600"
                    color="#6B7280"
                    textAlign="center"
                    py={0.5}
                  >
                    {day}
                  </Text>
                ))}
          </Box>

          {/* Calendar Grid */}
          <Box
            display="grid"
            gridTemplateColumns="repeat(7, 1fr)"
            gridTemplateRows="repeat(6, 1fr)"
            gap={0}
          >
            {calendarMode === "BS"
              ? bsCells.map((date) => {
                  const isCurrentMonth = date.month === bsViewMonth.month;
                  const isSelected = value && isSameNepaliDate(date, value);
                  const isToday = isSameNepaliDate(date, todayNepali);

                  return (
                    <Box
                      key={nepaliDateKey(date)}
                      position="relative"
                      w="100%"
                      minH="30px"
                    >
                      {isToday && !isSelected && (
                        <Box
                          position="absolute"
                          inset="1px"
                          borderRadius="full"
                          border="1.5px dashed"
                          borderColor="#3B82F6"
                          pointerEvents="none"
                          zIndex={0}
                        />
                      )}
                      <Button
                        size="xs"
                        variant="ghost"
                        w="100%"
                        h="30px"
                        p={0}
                        minW={0}
                        position="relative"
                        zIndex={1}
                        onClick={() => handleBsDayClick(date)}
                        disabled={disabled}
                        bg={isSelected ? "#0056FF" : "transparent"}
                        color={
                          isSelected
                            ? "white"
                            : isCurrentMonth
                              ? "#1F2937"
                              : "#9CA3AF"
                        }
                        _hover={
                          !isSelected && isCurrentMonth
                            ? { bg: "#F3F4F6" }
                            : undefined
                        }
                        fontFamily={NEPALI_FONT_STACK}
                        fontSize="13px"
                        fontWeight={isToday ? 700 : 500}
                        borderRadius="md"
                        aria-label={`${toNepaliDigits(date.day)}${isToday ? " (today)" : ""}`}
                      >
                        {toNepaliDigits(date.day)}
                      </Button>
                    </Box>
                  );
                })
              : adCells.map((date) => {
                  const dateKey = formatGregorianDate(date.year, date.month, date.day);
                  const isCurrentMonth = date.month === adViewDate.month;
                  const isSelected = value && (() => {
                    const gregorian = nepaliToGregorianParts(value);
                    return gregorian.year === date.year && 
                           gregorian.month === date.month && 
                           gregorian.day === date.day;
                  })();
                  const isToday =
                    date.day === todayGregorian.day &&
                    date.month === todayGregorian.month &&
                    date.year === todayGregorian.year;

                  return (
                    <Box
                      key={dateKey}
                      position="relative"
                      w="100%"
                      minH="30px"
                    >
                      {isToday && !isSelected && (
                        <Box
                          position="absolute"
                          inset="1px"
                          borderRadius="full"
                          border="1.5px dashed"
                          borderColor="#3B82F6"
                          pointerEvents="none"
                          zIndex={0}
                        />
                      )}
                      <Button
                        size="xs"
                        variant="ghost"
                        w="100%"
                        h="30px"
                        p={0}
                        minW={0}
                        position="relative"
                        zIndex={1}
                        onClick={() => handleAdDayClick(date)}
                        disabled={disabled}
                        bg={isSelected ? "#0056FF" : "transparent"}
                        color={
                          isSelected
                            ? "white"
                            : isCurrentMonth
                              ? "#1F2937"
                              : "#9CA3AF"
                        }
                        _hover={
                          !isSelected && isCurrentMonth
                            ? { bg: "#F3F4F6" }
                            : undefined
                        }
                        fontSize="13px"
                        fontWeight={isToday ? 700 : 500}
                        borderRadius="md"
                        aria-label={`${date.day}${isToday ? " (today)" : ""}`}
                      >
                        {date.day}
                      </Button>
                    </Box>
                  );
                })}
          </Box>

          {/* Today Button */}
          <Box w="full" pt={1} borderTop="1px solid" borderColor="gray.100">
            <Button
              size="xs"
              variant="ghost"
              w="full"
              fontSize="xs"
              color="gray.500"
              fontWeight="medium"
              h="7"
              _hover={{ bg: "gray.50", color: "gray.700" }}
              _focusVisible={{ boxShadow: "outline" }}
              onClick={handleTodayClick}
              disabled={disabled}
              aria-label="Go to today's date"
            >
              Today
            </Button>
          </Box>
        </VStack>
      </PopoverContent>
    </PopoverRoot>
  );
};

/** Format a NepaliDateParts to the BS date string format expected by the API (year-month-day with month 1-based) */
export const formatForApi = (date: NepaliDateParts): string => {
  return `${date.year}-${date.month + 1}-${date.day}`;
};
