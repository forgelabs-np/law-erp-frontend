import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/components/ui/Popover";

import {
  NepaliDateParts,
  NEPALI_MONTH_NAMES,
  NEPALI_FONT_STACK,
  getNepaliDaysInMonth,
  getNepaliMonthStart,
  gregorianToNepali,
  isSameNepaliDate,
  nepaliToGregorian,
  toNepaliDigits,
} from "@/utils/nepaliDateUtils";

// ==================== Types ====================

type CalendarMode = "BS" | "AD";

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  size?: "sm" | "md" | "lg";
}

type ViewMode = "date" | "month" | "year";

// ==================== Constants ====================

const GREGORIAN_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const GREGORIAN_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const BS_WEEKDAY_SHORT = ["आइत", "सोम", "मंगल", "बुध", "बिहि", "शुक्र", "शनि"];

const TOTAL_CALENDAR_CELLS = 42;

// ==================== Utility Functions ====================

/** Parse yyyy-MM-dd string to JS Date (local) */
const parseDateString = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/** Format JS Date to yyyy-MM-dd string */
const formatDateToString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/** Convert Gregorian view date to NepaliDateParts */
const gregorianToNepaliParts = (year: number, month: number, day: number): NepaliDateParts => {
  return gregorianToNepali(new Date(year, month, day));
};

/** Convert NepaliDateParts to Gregorian { year, month, day } */
const nepaliToGregorianParts = (parts: NepaliDateParts): { year: number; month: number; day: number } => {
  const date = nepaliToGregorian(parts);
  return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
};

/** Build 6-week grid for Nepali month */
const buildBsCalendarCells = (year: number, month: number): NepaliDateParts[] => {
  const cells: NepaliDateParts[] = [];
  const daysInMonth = getNepaliDaysInMonth(year, month);
  const leadingBlanks = getNepaliMonthStart(year, month).getDay();
  const prevYear = month === 0 ? year - 1 : year;
  const prevMonth = month === 0 ? 11 : month - 1;
  const daysInPrevMonth = getNepaliDaysInMonth(prevYear, prevMonth);

  for (let i = 0; i < leadingBlanks; i++) {
    cells.push({ year: prevYear, month: prevMonth, day: daysInPrevMonth - leadingBlanks + 1 + i });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ year, month, day });
  }
  const nextYear = month === 11 ? year + 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  for (let day = 1; cells.length < TOTAL_CALENDAR_CELLS; day++) {
    cells.push({ year: nextYear, month: nextMonth, day });
  }
  return cells;
};

// ==================== Main Component ====================

export const DatePicker = ({
  value,
  onChange,
  placeholder = "Select date",
  minDate,
  maxDate,
  size = "sm",
}: DatePickerProps) => {
  // ---- Core state ----
  const [isOpen, setIsOpen] = useState(false);
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("BS");
  const [viewMode, setViewMode] = useState<ViewMode>("date");

  // AD calendar state
  const [adViewDate, setAdViewDate] = useState<{ year: number; month: number }>(() => {
    if (value) {
      const [year, month] = value.split("-").map(Number);
      return { year, month: month - 1 };
    }
    return { year: new Date().getFullYear(), month: new Date().getMonth() };
  });

  // BS calendar state
  const [bsViewDate, setBsViewDate] = useState<NepaliDateParts>(() => {
    if (value) {
      const date = parseDateString(value);
      return gregorianToNepali(date);
    }
    return gregorianToNepali(new Date());
  });

  // Year range for year-selection view
  const [yearRangeStart, setYearRangeStart] = useState(() => {
    if (value) {
      const [year] = value.split("-").map(Number);
      return Math.floor(year / 12) * 12;
    }
    const currentYear = new Date().getFullYear();
    return Math.floor(currentYear / 12) * 12;
  });

  // ---- Sync from value prop ----
  useEffect(() => {
    if (value) {
      const date = parseDateString(value);
      setAdViewDate({ year: date.getFullYear(), month: date.getMonth() });
      setBsViewDate(gregorianToNepali(date));
    }
  }, [value]);

  // ---- Today references ----
  const todayAd = useMemo(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
  }, []);

  const todayBs = useMemo(() => gregorianToNepali(new Date()), []);

  // ---- BS calendar cells (memoized) ----
  const bsCells = useMemo(() => {
    return buildBsCalendarCells(bsViewDate.year, bsViewDate.month);
  }, [bsViewDate.year, bsViewDate.month]);

  // ---- Get current selected date parts based on mode ----
  const getSelectedDateParts = useCallback((): { year: number; month: number; day: number } | null => {
    if (!value) return null;
    const date = parseDateString(value);
    return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
  }, [value]);

  const getSelectedBsParts = useCallback((): NepaliDateParts | null => {
    if (!value) return null;
    return gregorianToNepali(parseDateString(value));
  }, [value]);

  // ---- Calendar mode switch ----
  const handleModeChange = useCallback((newMode: CalendarMode) => {
    if (newMode === calendarMode) return;

    // Convert current view date to the new calendar mode
    if (calendarMode === "AD" && newMode === "BS") {
      // AD view -> BS view
      const bsParts = gregorianToNepaliParts(adViewDate.year, adViewDate.month, 1);
      setBsViewDate({ year: bsParts.year, month: bsParts.month, day: 1 });
    } else if (calendarMode === "BS" && newMode === "AD") {
      // BS view -> AD view
      const gregorian = nepaliToGregorianParts({ year: bsViewDate.year, month: bsViewDate.month, day: 1 });
      setAdViewDate({ year: gregorian.year, month: gregorian.month });
    }

    setCalendarMode(newMode);
    setViewMode("date");
  }, [calendarMode, adViewDate, bsViewDate]);

  // ---- Date selection (AD mode) ----
  const handleAdDateSelect = useCallback(
    (day: number) => {
      const dateStr = formatDateToString(new Date(adViewDate.year, adViewDate.month, day));
      onChange?.(dateStr);
      setIsOpen(false);
    },
    [adViewDate, onChange]
  );

  // ---- Date selection (BS mode) ----
  const handleBsDateSelect = useCallback(
    (date: NepaliDateParts) => {
      const gregorianDate = nepaliToGregorian(date);
      onChange?.(formatDateToString(gregorianDate));
      setIsOpen(false);
    },
    [onChange]
  );

  // ---- Today button ----
  const handleTodayClick = useCallback(() => {
    if (calendarMode === "AD") {
      setAdViewDate({ year: todayAd.year, month: todayAd.month });
      onChange?.(formatDateToString(new Date(todayAd.year, todayAd.month, todayAd.day)));
    } else {
      setBsViewDate({ year: todayBs.year, month: todayBs.month, day: todayBs.day });
      onChange?.(formatDateToString(nepaliToGregorian(todayBs)));
    }
    setIsOpen(false);
  }, [calendarMode, todayAd, todayBs, onChange]);

  // ---- Month navigation (AD) ----
  const handleAdPrevMonth = useCallback(() => {
    setAdViewDate((prev) => ({
      year: prev.month === 0 ? prev.year - 1 : prev.year,
      month: prev.month === 0 ? 11 : prev.month - 1,
    }));
  }, []);

  const handleAdNextMonth = useCallback(() => {
    setAdViewDate((prev) => ({
      year: prev.month === 11 ? prev.year + 1 : prev.year,
      month: prev.month === 11 ? 0 : prev.month + 1,
    }));
  }, []);

  // ---- Month navigation (BS) ----
  const handleBsPrevMonth = useCallback(() => {
    setBsViewDate((prev) => ({
      year: prev.month === 0 ? prev.year - 1 : prev.year,
      month: prev.month === 0 ? 11 : prev.month - 1,
      day: 1,
    }));
  }, []);

  const handleBsNextMonth = useCallback(() => {
    setBsViewDate((prev) => ({
      year: prev.month === 11 ? prev.year + 1 : prev.year,
      month: prev.month === 11 ? 0 : prev.month + 1,
      day: 1,
    }));
  }, []);

  // ---- Year navigation ----
  const handlePrevYear = useCallback(() => {
    if (calendarMode === "AD") {
      setAdViewDate((prev) => ({ ...prev, year: prev.year - 1 }));
    } else {
      setBsViewDate((prev) => ({ ...prev, year: prev.year - 1 }));
    }
  }, [calendarMode]);

  const handleNextYear = useCallback(() => {
    if (calendarMode === "AD") {
      setAdViewDate((prev) => ({ ...prev, year: prev.year + 1 }));
    } else {
      setBsViewDate((prev) => ({ ...prev, year: prev.year + 1 }));
    }
  }, [calendarMode]);

  // ---- Year selection view ----
  const handleYearClick = useCallback(() => {
    setViewMode("year");
    const currentYear = calendarMode === "AD" ? adViewDate.year : bsViewDate.year;
    setYearRangeStart(Math.floor(currentYear / 12) * 12);
  }, [calendarMode, adViewDate.year, bsViewDate.year]);

  const handleYearSelect = useCallback(
    (year: number) => {
      if (calendarMode === "AD") {
        setAdViewDate((prev) => ({ ...prev, year }));
      } else {
        setBsViewDate((prev) => ({ ...prev, year }));
      }
      setViewMode("month");
    },
    [calendarMode]
  );

  const handlePrevYearRange = useCallback(() => setYearRangeStart((prev) => prev - 12), []);
  const handleNextYearRange = useCallback(() => setYearRangeStart((prev) => prev + 12), []);

  // ---- Month selection view ----
  const handleMonthClick = useCallback(() => setViewMode("month"), []);

  const handleMonthSelect = useCallback(
    (month: number) => {
      if (calendarMode === "AD") {
        setAdViewDate((prev) => ({ ...prev, month }));
      } else {
        setBsViewDate((prev) => ({ ...prev, month, day: 1 }));
      }
      setViewMode("date");
    },
    [calendarMode]
  );

  // ---- Date disabled check (AD only for now) ----
  const isAdDateDisabled = useCallback(
    (year: number, month: number, day: number) => {
      const date = new Date(year, month, day);
      if (minDate && date < new Date(minDate)) return true;
      if (maxDate && date > new Date(maxDate)) return true;
      return false;
    },
    [minDate, maxDate]
  );

  // ---- Display value ----
  const displayValue = useMemo(() => {
    if (!value) return "";
    if (calendarMode === "AD") {
      return value; // Already in yyyy-MM-dd
    }
    // BS mode: show in BS format
    const bsParts = gregorianToNepali(parseDateString(value));
    return `${toNepaliDigits(bsParts.year)}-${String(bsParts.month + 1).padStart(2, "0")}-${String(bsParts.day).padStart(2, "0")}`;
  }, [value, calendarMode]);

  // ---- Current view month/year text ----
  const currentMonthText = useMemo(() => {
    if (calendarMode === "AD") {
      return `${GREGORIAN_MONTHS[adViewDate.month]} ${adViewDate.year}`;
    }
    return `${NEPALI_MONTH_NAMES[bsViewDate.month]} ${toNepaliDigits(bsViewDate.year)}`;
  }, [calendarMode, adViewDate, bsViewDate]);

  const currentYearDisplay = useMemo(() => {
    return calendarMode === "AD" ? adViewDate.year : toNepaliDigits(bsViewDate.year);
  }, [calendarMode, adViewDate.year, bsViewDate.year]);

  // ---- Year grid ----
  const renderYearGrid = () => {
    const years = [];
    const currentYear = calendarMode === "AD" ? todayAd.year : todayBs.year;
    const viewYear = calendarMode === "AD" ? adViewDate.year : bsViewDate.year;

    for (let i = 0; i < 12; i++) {
      const year = yearRangeStart + i;
      const isSelected = year === viewYear;
      const isCurrentYear = year === currentYear;
      const displayYear = calendarMode === "BS" ? toNepaliDigits(year) : String(year);

      years.push(
        <Button
          key={year}
          size="sm"
          variant="ghost"
          w="16"
          h="10"
          borderRadius="md"
          bg={isSelected ? "blue.500" : isCurrentYear ? "blue.50" : "transparent"}
          color={isSelected ? "white" : "gray.700"}
          _hover={{ bg: isSelected ? "blue.600" : "gray.100" }}
          onClick={() => handleYearSelect(year)}
          fontSize="sm"
          fontWeight={isCurrentYear ? "bold" : "normal"}
          fontFamily={calendarMode === "BS" ? NEPALI_FONT_STACK : "inherit"}
          aria-label={`Select year ${year}`}
          aria-current={isCurrentYear ? "date" : undefined}
        >
          {displayYear}
        </Button>
      );
    }
    return years;
  };

  // ---- Month grid ----
  const renderMonthGrid = () => {
    const months = calendarMode === "AD" ? GREGORIAN_MONTHS : NEPALI_MONTH_NAMES;
    const viewMonth = calendarMode === "AD" ? adViewDate.month : bsViewDate.month;

    return months.map((monthName, index) => {
      const isSelected = index === viewMonth;
      return (
        <Button
          key={monthName}
          size="sm"
          variant="ghost"
          w="20"
          h="10"
          borderRadius="md"
          bg={isSelected ? "blue.500" : "transparent"}
          color={isSelected ? "white" : "gray.700"}
          _hover={{ bg: isSelected ? "blue.600" : "gray.100" }}
          onClick={() => handleMonthSelect(index)}
          fontSize="sm"
          fontFamily={calendarMode === "BS" ? NEPALI_FONT_STACK : "inherit"}
          aria-label={`Select month ${monthName}`}
        >
          {monthName}
        </Button>
      );
    });
  };

  // ---- Year range text ----
  const yearRangeText = useMemo(() => {
    if (calendarMode === "BS") {
      return `${toNepaliDigits(yearRangeStart)}–${toNepaliDigits(yearRangeStart + 11)}`;
    }
    return `${yearRangeStart}–${yearRangeStart + 11}`;
  }, [calendarMode, yearRangeStart]);

  return (
    <PopoverRoot
      open={isOpen}
      onOpenChange={(e) => setIsOpen(e.open)}
      positioning={{ placement: "bottom-start" }}
    >
      <PopoverTrigger asChild>
        <Box position="relative" w="full">
          <Input
            value={displayValue}
            readOnly
            placeholder={placeholder}
            size={size}
            cursor="pointer"
            onClick={() => setIsOpen(true)}
            pr="10"
            fontFamily={calendarMode === "BS" ? NEPALI_FONT_STACK : "inherit"}
            aria-label={placeholder || "Select date"}
            aria-haspopup="dialog"
          />
          <Box
            position="absolute"
            right="3"
            top="50%"
            transform="translateY(-50%)"
            pointerEvents="none"
          >
            <Calendar size={16} color="gray" />
          </Box>
        </Box>
      </PopoverTrigger>
      <PopoverContent p={3} w="280px">
        <VStack gap={2}>
          {/* AD/BS Select + Year Navigation */}
          <HStack w="full" justify="space-between">
            <Button
              size="xs"
              variant="ghost"
              onClick={handlePrevYear}
              p={1}
              aria-label="Previous year"
            >
              <ChevronLeft size={14} />
            </Button>

            <HStack gap={1} align="center">
              <Button
                size="xs"
                variant="ghost"
                onClick={handleYearClick}
                p={1}
                fontWeight="bold"
                fontFamily={calendarMode === "BS" ? NEPALI_FONT_STACK : "inherit"}
                aria-label={`Select year, currently ${currentYearDisplay}`}
              >
                {currentYearDisplay}
              </Button>

              {/* AD/BS Select */}
              <select
                value={calendarMode}
                onChange={(e) => handleModeChange(e.target.value as CalendarMode)}
                style={{
                  fontSize: "11px",
                  padding: "2px 4px",
                  borderRadius: "4px",
                  border: "1px solid #E5E7EB",
                  backgroundColor: "#F9FAFB",
                  cursor: "pointer",
                  outline: "none",
                  fontWeight: 500,
                  color: "#374151",
                }}
                aria-label="Select calendar mode"
              >
                <option value="BS">BS</option>
                <option value="AD">AD</option>
              </select>
            </HStack>

            <Button
              size="xs"
              variant="ghost"
              onClick={handleNextYear}
              p={1}
              aria-label="Next year"
            >
              <ChevronRight size={14} />
            </Button>
          </HStack>

          {viewMode === "date" && (
            <>
              {/* Month Navigation */}
              <HStack w="full" justify="space-between">
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={calendarMode === "AD" ? handleAdPrevMonth : handleBsPrevMonth}
                  p={1}
                  aria-label="Previous month"
                >
                  <ChevronLeft size={14} />
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={handleMonthClick}
                  p={1}
                  fontWeight="medium"
                  w="32"
                  fontFamily={calendarMode === "BS" ? NEPALI_FONT_STACK : "inherit"}
                  aria-label={`Select month, currently ${currentMonthText}`}
                >
                  {currentMonthText}
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={calendarMode === "AD" ? handleAdNextMonth : handleBsNextMonth}
                  p={1}
                  aria-label="Next month"
                >
                  <ChevronRight size={14} />
                </Button>
              </HStack>

              {/* Day Headers */}
              <Flex gap={1}>
                {(calendarMode === "AD" ? GREGORIAN_DAYS : BS_WEEKDAY_SHORT).map((day) => (
                  <Box
                    key={day}
                    w="8"
                    h="6"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      fontWeight="medium"
                      fontFamily={calendarMode === "BS" ? NEPALI_FONT_STACK : "inherit"}
                    >
                      {day}
                    </Text>
                  </Box>
                ))}
              </Flex>

              {/* Calendar Grid */}
              <Flex flexWrap="wrap" gap={1}>
                {calendarMode === "AD" ? (
                  // AD Calendar
                  (() => {
                    const daysInMonth = new Date(adViewDate.year, adViewDate.month + 1, 0).getDate();
                    const firstDay = new Date(adViewDate.year, adViewDate.month, 1).getDay();
                    const days = [];
                    const selectedParts = getSelectedDateParts();

                    for (let i = 0; i < firstDay; i++) {
                      days.push(<Box key={`empty-${i}`} w="8" h="8" />);
                    }

                    for (let day = 1; day <= daysInMonth; day++) {
                      const isSelected = selectedParts?.year === adViewDate.year && selectedParts?.month === adViewDate.month && selectedParts?.day === day;
                      const isDisabled = isAdDateDisabled(adViewDate.year, adViewDate.month, day);
                      const isToday = todayAd.day === day && todayAd.month === adViewDate.month && todayAd.year === adViewDate.year;

                      days.push(
                        <Box key={day} position="relative" w="8" h="8">
                          {isToday && !isSelected && (
                            <Box
                              position="absolute"
                              inset="1px"
                              borderRadius="full"
                              border="1.5px dashed"
                              borderColor="blue.400"
                              pointerEvents="none"
                            />
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            w="8"
                            h="8"
                            p={0}
                            borderRadius="full"
                            bg={isSelected ? "blue.500" : "transparent"}
                            color={isSelected ? "white" : "gray.700"}
                            _hover={{ bg: isSelected ? "blue.600" : "gray.100" }}
                            onClick={() => handleAdDateSelect(day)}
                            disabled={isDisabled}
                            fontSize="xs"
                            position="relative"
                            zIndex={1}
                            aria-label={`Select day ${day}${isToday ? " (today)" : ""}`}
                          >
                            {day}
                          </Button>
                        </Box>
                      );
                    }
                    return days;
                  })()
                ) : (
                  // BS Calendar
                  bsCells.map((date) => {
                    const isCurrentMonth = date.month === bsViewDate.month;
                    const selectedBs = getSelectedBsParts();
                    const isSelected = isSameNepaliDate(date, selectedBs);
                    const isToday = isSameNepaliDate(date, todayBs);

                    return (
                      <Box key={`${date.year}-${date.month}-${date.day}`} position="relative" w="8" h="8">
                        {isToday && !isSelected && (
                          <Box
                            position="absolute"
                            inset="1px"
                            borderRadius="full"
                            border="1.5px dashed"
                            borderColor="blue.400"
                            pointerEvents="none"
                          />
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          w="8"
                          h="8"
                          p={0}
                          borderRadius="full"
                          bg={isSelected ? "blue.500" : "transparent"}
                          color={isSelected ? "white" : isCurrentMonth ? "gray.700" : "gray.400"}
                          _hover={{ bg: isSelected ? "blue.600" : "gray.100" }}
                          onClick={() => handleBsDateSelect(date)}
                          fontSize="xs"
                          position="relative"
                          zIndex={1}
                          fontFamily={NEPALI_FONT_STACK}
                          aria-label={`${toNepaliDigits(date.day)}${isToday ? " (today)" : ""}`}
                        >
                          {toNepaliDigits(date.day)}
                        </Button>
                      </Box>
                    );
                  })
                )}
              </Flex>

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
                  aria-label="Select today's date"
                >
                  Today
                </Button>
              </Box>
            </>
          )}

          {viewMode === "month" && (
            <>
              <HStack w="full" justify="space-between">
                <Button size="xs" variant="ghost" onClick={handlePrevYear} p={1} aria-label="Previous year">
                  <ChevronLeft size={14} />
                </Button>
                <Text fontSize="sm" fontWeight="bold" fontFamily={calendarMode === "BS" ? NEPALI_FONT_STACK : "inherit"}>
                  {currentYearDisplay}
                </Text>
                <Button size="xs" variant="ghost" onClick={handleNextYear} p={1} aria-label="Next year">
                  <ChevronRight size={14} />
                </Button>
              </HStack>
              <Flex flexWrap="wrap" gap={1} justify="center">
                {renderMonthGrid()}
              </Flex>
            </>
          )}

          {viewMode === "year" && (
            <>
              <HStack w="full" justify="space-between">
                <Button size="xs" variant="ghost" onClick={handlePrevYearRange} p={1} aria-label="Previous 12 years">
                  <ChevronLeft size={14} />
                </Button>
                <Text fontSize="sm" fontWeight="bold">{yearRangeText}</Text>
                <Button size="xs" variant="ghost" onClick={handleNextYearRange} p={1} aria-label="Next 12 years">
                  <ChevronRight size={14} />
                </Button>
              </HStack>
              <Flex flexWrap="wrap" gap={1} justify="center">
                {renderYearGrid()}
              </Flex>
            </>
          )}
        </VStack>
      </PopoverContent>
    </PopoverRoot>
  );
};
