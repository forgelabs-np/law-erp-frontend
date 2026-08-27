import { useState, useRef, useEffect, useCallback } from "react";
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

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  size?: "sm" | "md" | "lg";
}

const MONTHS = [
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

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const formatDate = (year: number, month: number, day: number) => {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

type ViewMode = "date" | "month" | "year";

export const DatePicker = ({
  value,
  onChange,
  placeholder = "Select date",
  minDate,
  maxDate,
  size = "sm",
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || "");
  const [viewMode, setViewMode] = useState<ViewMode>("date");
  const [yearRangeStart, setYearRangeStart] = useState(() => {
    const currentYear = new Date().getFullYear();
    return Math.floor(currentYear / 12) * 12;
  });
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const [year, month] = value.split("-").map(Number);
      return { year, month: month - 1 };
    }
    return { year: new Date().getFullYear(), month: new Date().getMonth() };
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      const [year, month] = value.split("-").map(Number);
      setViewDate({ year, month: month - 1 });
    }
  }, [value]);

  const handleDateSelect = useCallback(
    (day: number) => {
      const dateString = formatDate(viewDate.year, viewDate.month, day);
      setSelectedDate(dateString);
      onChange?.(dateString);
      setIsOpen(false);
    },
    [viewDate, onChange]
  );

  const handlePrevMonth = useCallback(() => {
    setViewDate((prev) => ({
      year: prev.month === 0 ? prev.year - 1 : prev.year,
      month: prev.month === 0 ? 11 : prev.month - 1,
    }));
  }, []);

  const handleNextMonth = useCallback(() => {
    setViewDate((prev) => ({
      year: prev.month === 11 ? prev.year + 1 : prev.year,
      month: prev.month === 11 ? 0 : prev.month + 1,
    }));
  }, []);

  const handlePrevYear = useCallback(() => {
    setViewDate((prev) => ({
      ...prev,
      year: prev.year - 1,
    }));
  }, []);

  const handleNextYear = useCallback(() => {
    setViewDate((prev) => ({
      ...prev,
      year: prev.year + 1,
    }));
  }, []);

  const handleYearClick = useCallback(() => {
    setViewMode("year");
    setYearRangeStart(Math.floor(viewDate.year / 12) * 12);
  }, [viewDate.year]);

  const handleMonthClick = useCallback(() => {
    setViewMode("month");
  }, []);

  const handleYearSelect = useCallback((year: number) => {
    setViewDate((prev) => ({ ...prev, year }));
    setViewMode("month");
  }, []);

  const handleMonthSelect = useCallback((month: number) => {
    setViewDate((prev) => ({ ...prev, month }));
    setViewMode("date");
  }, []);

  const handlePrevYearRange = useCallback(() => {
    setYearRangeStart((prev) => prev - 12);
  }, []);

  const handleNextYearRange = useCallback(() => {
    setYearRangeStart((prev) => prev + 12);
  }, []);

  const isDateDisabled = useCallback(
    (year: number, month: number, day: number) => {
      const date = new Date(year, month, day);
      if (minDate) {
        const min = new Date(minDate);
        if (date < min) return true;
      }
      if (maxDate) {
        const max = new Date(maxDate);
        if (date > max) return true;
      }
      return false;
    },
    [minDate, maxDate]
  );

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);
    const firstDay = getFirstDayOfMonth(viewDate.year, viewDate.month);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<Box key={`empty-${i}`} w="8" h="8" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(viewDate.year, viewDate.month, day);
      const isSelected = selectedDate === dateStr;
      const isDisabled = isDateDisabled(viewDate.year, viewDate.month, day);
      const isToday =
        day === new Date().getDate() &&
        viewDate.month === new Date().getMonth() &&
        viewDate.year === new Date().getFullYear();

      days.push(
        <Button
          key={day}
          size="sm"
          variant="ghost"
          w="8"
          h="8"
          p={0}
          borderRadius="full"
          bg={isSelected ? "blue.500" : isToday ? "blue.50" : "transparent"}
          color={isSelected ? "white" : "gray.700"}
          _hover={{ bg: isSelected ? "blue.600" : "gray.100" }}
          onClick={() => handleDateSelect(day)}
          disabled={isDisabled}
          fontSize="xs"
          aria-label={`Select day ${day}`}
        >
          {day}
        </Button>
      );
    }

    return days;
  };

  const renderYearGrid = () => {
    const years = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < 12; i++) {
      const year = yearRangeStart + i;
      const isSelected = year === viewDate.year;
      const isCurrentYear = year === currentYear;

      years.push(
        <Button
          key={year}
          size="sm"
          variant="ghost"
          w="16"
          h="10"
          borderRadius="md"
          bg={
            isSelected ? "blue.500" : isCurrentYear ? "blue.50" : "transparent"
          }
          color={isSelected ? "white" : "gray.700"}
          _hover={{ bg: isSelected ? "blue.600" : "gray.100" }}
          onClick={() => handleYearSelect(year)}
          fontSize="sm"
          fontWeight={isCurrentYear ? "bold" : "normal"}
          aria-label={`Select year ${year}`}
          aria-current={isCurrentYear ? "date" : undefined}
        >
          {year}
        </Button>
      );
    }

    return years;
  };

  const renderMonthGrid = () => {
    const months = MONTHS.map((month, index) => {
      const isSelected = index === viewDate.month;

      return (
        <Button
          key={month}
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
          aria-label={`Select month ${month}`}
        >
          {month}
        </Button>
      );
    });

    return months;
  };

  return (
    <PopoverRoot
      open={isOpen}
      onOpenChange={(e) => setIsOpen(e.open)}
      positioning={{ placement: "bottom-start" }}
    >
      <PopoverTrigger asChild>
        <Box position="relative" w="full">
          <Input
            ref={inputRef}
            value={selectedDate}
            readOnly
            placeholder={placeholder}
            size={size}
            cursor="pointer"
            onClick={() => setIsOpen(true)}
            pr="10"
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
          {viewMode === "date" && (
            <>
              {/* Year Navigation */}
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
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={handleYearClick}
                  p={1}
                  fontWeight="bold"
                  aria-label={`Select year, currently ${viewDate.year}`}
                >
                  {viewDate.year}
                </Button>
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

              {/* Month Navigation */}
              <HStack w="full" justify="space-between">
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={handlePrevMonth}
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
                  aria-label={`Select month, currently ${MONTHS[viewDate.month]}`}
                >
                  {MONTHS[viewDate.month]}
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={handleNextMonth}
                  p={1}
                  aria-label="Next month"
                >
                  <ChevronRight size={14} />
                </Button>
              </HStack>

              {/* Day Headers */}
              <Flex gap={1}>
                {DAYS.map((day) => (
                  <Box
                    key={day}
                    w="8"
                    h="6"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                      {day}
                    </Text>
                  </Box>
                ))}
              </Flex>

              {/* Calendar Grid */}
              <Flex flexWrap="wrap" gap={1}>
                {renderCalendar()}
              </Flex>
            </>
          )}

          {viewMode === "month" && (
            <>
              {/* Year Navigation for Month View */}
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
                <Text fontSize="sm" fontWeight="bold">
                  {viewDate.year}
                </Text>
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

              {/* Month Grid */}
              <Flex flexWrap="wrap" gap={1} justify="center">
                {renderMonthGrid()}
              </Flex>
            </>
          )}

          {viewMode === "year" && (
            <>
              {/* Year Range Navigation */}
              <HStack w="full" justify="space-between">
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={handlePrevYearRange}
                  p={1}
                  aria-label="Previous 12 years"
                >
                  <ChevronLeft size={14} />
                </Button>
                <Text fontSize="sm" fontWeight="bold">
                  {yearRangeStart}–{yearRangeStart + 11}
                </Text>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={handleNextYearRange}
                  p={1}
                  aria-label="Next 12 years"
                >
                  <ChevronRight size={14} />
                </Button>
              </HStack>

              {/* Year Grid */}
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
