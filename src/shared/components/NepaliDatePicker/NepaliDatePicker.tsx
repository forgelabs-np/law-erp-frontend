import { useState } from "react";
import { Box, Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/components/ui/Popover";

import {
  NepaliDateParts,
  NEPALI_DIGITS,
  NEPALI_FONT_STACK,
  NEPALI_MONTH_NAMES,
  NEPALI_WEEKDAY_NAMES,
  NEPALI_WEEKDAY_SHORT,
  getNepaliDaysInMonth,
  getNepaliMonthStart,
  getNepaliWeekday,
  isSameNepaliDate,
  nepaliDateKey,
  toNepaliDigits,
} from "@/utils/nepaliDateUtils";

interface NepaliDatePickerProps {
  value: NepaliDateParts | null;
  onChange: (date: NepaliDateParts) => void;
  placeholder?: string;
  disabled?: boolean;
}

const TOTAL_CELLS = 42;

const buildMonthCells = (year: number, month: number): NepaliDateParts[] => {
  const cells: NepaliDateParts[] = [];
  const daysInMonth = getNepaliDaysInMonth(year, month);
  const leading = getNepaliMonthStart(year, month).getDay();
  const prevYear = month === 0 ? year - 1 : year;
  const prevMonth = month === 0 ? 11 : month - 1;
  const daysInPrev = getNepaliDaysInMonth(prevYear, prevMonth);

  for (let i = 0; i < leading; i++) {
    cells.push({ year: prevYear, month: prevMonth, day: daysInPrev - leading + 1 + i });
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

const formatDateForDisplay = (date: NepaliDateParts): string => {
  return `${toNepaliDigits(date.year)} ${NEPALI_MONTH_NAMES[date.month]} ${toNepaliDigits(date.day)}`;
};

const formatForApi = (date: NepaliDateParts): string => {
  return `${date.year}-${date.month + 1}-${date.day}`;
};

export const NepaliDatePicker = ({ value, onChange, placeholder = "Select BS date", disabled }: NepaliDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<NepaliDateParts>(
    value || { year: 2083, month: 4, day: 1 }
  );

  const cells = buildMonthCells(currentMonth.year, currentMonth.month);

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = prev.month === 0 ? 11 : prev.month - 1;
      const newYear = prev.month === 0 ? prev.year - 1 : prev.year;
      return { year: newYear, month: newMonth, day: 1 };
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = prev.month === 11 ? 0 : prev.month + 1;
      const newYear = prev.month === 11 ? prev.year + 1 : prev.year;
      return { year: newYear, month: newMonth, day: 1 };
    });
  };

  const handleDayClick = (date: NepaliDateParts) => {
    onChange(date);
    setIsOpen(false);
  };

  const displayValue = value ? formatDateForDisplay(value) : "";

  return (
    <PopoverRoot open={isOpen} onOpenChange={(e) => setIsOpen(e.open)} positioning={{ placement: "bottom-start" }}>
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
          _hover={{ borderColor: "#0D6944" }}
          _focus={{ borderColor: "#0D6944", boxShadow: "0 0 0 1px #0D6944" }}
          _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
          minW="200px"
          justifyContent="space-between"
        >
          <Text
            fontSize="sm"
            color={displayValue ? "#1F2937" : "#9CA3AF"}
            fontFamily={NEPALI_FONT_STACK}
          >
            {displayValue || placeholder}
          </Text>
          <Calendar size={16} color="#6B7280" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        width="320px"
        p={4}
        bg="white"
        border="1px solid"
        borderColor="#E5E7EB"
        borderRadius="12px"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      >
        <VStack gap={4} align="stretch">
          {/* Month/Year Header */}
          <HStack justify="space-between" align="center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousMonth}
              disabled={disabled}
            >
              <ChevronLeft size={16} />
            </Button>
            <Text
              fontSize="sm"
              fontWeight="600"
              color="#1F2937"
              fontFamily={NEPALI_FONT_STACK}
            >
              {NEPALI_MONTH_NAMES[currentMonth.month]} {toNepaliDigits(currentMonth.year)}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              disabled={disabled}
            >
              <ChevronRight size={16} />
            </Button>
          </HStack>

          {/* Weekday Headers */}
          <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
            {NEPALI_WEEKDAY_SHORT.map((day) => (
              <Text
                key={day}
                fontSize="10px"
                fontWeight="600"
                color="#6B7280"
                textAlign="center"
                fontFamily={NEPALI_FONT_STACK}
              >
                {day}
              </Text>
            ))}
          </Box>

          {/* Calendar Grid */}
          <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
            {cells.map((date, index) => {
              const isCurrentMonth = date.month === currentMonth.month;
              const isSelected = value && isSameNepaliDate(date, value);
              const isToday = false; // Could add today check if needed

              return (
                <Button
                  key={nepaliDateKey(date)}
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDayClick(date)}
                  disabled={disabled}
                  bg={isSelected ? "#0D6944" : "transparent"}
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
                  fontSize="sm"
                  fontWeight={isToday ? 700 : 500}
                  minH="32px"
                  borderRadius="md"
                >
                  {toNepaliDigits(date.day)}
                </Button>
              );
            })}
          </Box>
        </VStack>
      </PopoverContent>
    </PopoverRoot>
  );
};

export { formatForApi };
