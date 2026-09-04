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
  gregorianToNepali,
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

const formatDateForDisplay = (date: NepaliDateParts): string => {
  return `${toNepaliDigits(date.year)} ${NEPALI_MONTH_NAMES[date.month]} ${toNepaliDigits(date.day)}`;
};

const formatForApi = (date: NepaliDateParts): string => {
  return `${date.year}-${date.month + 1}-${date.day}`;
};

export const NepaliDatePicker = ({
  value,
  onChange,
  placeholder = "Select BS date",
  disabled,
}: NepaliDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<NepaliDateParts>(
    value || { year: 2083, month: 4, day: 1 }
  );

  const todayNepali = gregorianToNepali(new Date());

  const cells = buildMonthCells(currentMonth.year, currentMonth.month);

  const handleTodayClick = () => {
    setCurrentMonth({
      year: todayNepali.year,
      month: todayNepali.month,
      day: 1,
    });
    onChange(todayNepali);
  };

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
            fontFamily={NEPALI_FONT_STACK}
          >
            {displayValue || placeholder}
          </Text>
          <Calendar size={16} color="#6B7280" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        width="310px"
        maxH="420px"
        p={3}
        bg="white"
        border="1px solid"
        borderColor="#E5E7EB"
        borderRadius="12px"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      >
        <VStack gap={3} align="stretch">
          {/* Month/Year Header */}
          <HStack justify="space-between" align="center">
            <Button
              variant="ghost"
              size="xs"
              p={1}
              onClick={handlePreviousMonth}
              disabled={disabled}
            >
              <ChevronLeft size={14} />
            </Button>
            <Text
              fontSize="sm"
              fontWeight="600"
              color="#1F2937"
              fontFamily={NEPALI_FONT_STACK}
            >
              {NEPALI_MONTH_NAMES[currentMonth.month]}{" "}
              {toNepaliDigits(currentMonth.year)}
            </Text>
            <Button
              variant="ghost"
              size="xs"
              p={1}
              onClick={handleNextMonth}
              disabled={disabled}
            >
              <ChevronRight size={14} />
            </Button>
          </HStack>

          {/* Weekday Headers */}
          <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={0}>
            {NEPALI_WEEKDAY_SHORT.map((day) => (
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
            ))}
          </Box>

          {/* Calendar Grid */}
          <Box
            display="grid"
            gridTemplateColumns="repeat(7, 1fr)"
            gridTemplateRows="repeat(6, 1fr)"
            gap={0}
          >
            {cells.map((date, index) => {
              const isCurrentMonth = date.month === currentMonth.month;
              const isSelected = value && isSameNepaliDate(date, value);
              const isToday = isSameNepaliDate(date, todayNepali);

              return (
                <Box
                  key={nepaliDateKey(date)}
                  position="relative"
                  w="100%"
                  minH="30px"
                >
                  {/* Dotted circle indicator for today (behind the button) */}
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
                    onClick={() => handleDayClick(date)}
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

export { formatForApi };
