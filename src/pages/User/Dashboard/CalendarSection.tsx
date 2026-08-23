import { useState, useEffect, useMemo } from "react";
import { Box, Flex, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NepaliCalendar } from "@/components/calendar/NepaliCalendar";
import {
  NepaliDateParts,
  NEPALI_FONT_STACK,
  formatGregorianMonthRange,
  formatNepaliDate,
  formatNepaliMonthYear,
  getNepaliMonthEnd,
  getNepaliMonthStart,
  gregorianToNepali,
  nepaliToGregorian,
  shiftNepaliMonth,
} from "@/utils/nepaliDateUtils";

export interface CalendarTask {
  time: string;
  label: string;
}

export interface CalendarSectionData {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  tasks: CalendarTask[];
  onViewFullCalendar?: () => void;
}

export const CalendarSection = ({
  selectedDate,
  onDateChange,
  tasks,
  onViewFullCalendar,
}: CalendarSectionData) => {
  const selectedNepali = gregorianToNepali(selectedDate);
  const [displayNepali, setDisplayNepali] = useState<NepaliDateParts>(() =>
    gregorianToNepali(selectedDate)
  );

  // Follow external selection changes (e.g. clicking a day or a neighbor month day).
  useEffect(() => {
    setDisplayNepali(gregorianToNepali(selectedDate));
  }, [selectedDate]);

  const emptyTasksByNepaliDate = useMemo(() => new Map(), []);
  const todayNepali = useMemo(() => gregorianToNepali(new Date()), []);

  const handlePrevMonth = () =>
    setDisplayNepali((prev) => shiftNepaliMonth(prev, -1));
  const handleNextMonth = () =>
    setDisplayNepali((prev) => shiftNepaliMonth(prev, 1));

  return (
    <Box
      bg="white"
      borderRadius="16px"
      border="1px solid"
      borderColor="gray.200"
      p={5}
    >
      <Text fontWeight={700} fontSize="md" mb={4}>
        Calendar & Tasks
      </Text>

      <Box mb={4}>
        <Flex alignItems="center" justifyContent="space-between" mb={2}>
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="Previous Nepali month"
            onClick={handlePrevMonth}
          >
            <ChevronLeft size={16} />
          </IconButton>
          <Box textAlign="center">
            <Text
              fontWeight={700}
              fontSize="sm"
              color="gray.800"
              fontFamily={NEPALI_FONT_STACK}
            >
              {formatNepaliMonthYear(displayNepali.year, displayNepali.month)}
            </Text>
            <Text fontSize="10px" color="gray.400" fontWeight="500">
              {formatGregorianMonthRange(
                getNepaliMonthStart(displayNepali.year, displayNepali.month),
                getNepaliMonthEnd(displayNepali.year, displayNepali.month)
              )}
            </Text>
          </Box>
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="Next Nepali month"
            onClick={handleNextMonth}
          >
            <ChevronRight size={16} />
          </IconButton>
        </Flex>

        <NepaliCalendar
          view="dayGridMonth"
          displayNepali={displayNepali}
          tasksByNepaliDate={emptyTasksByNepaliDate}
          selectedNepali={selectedNepali}
          todayNepali={todayNepali}
          onDayClick={(nepali) => onDateChange(nepaliToGregorian(nepali))}
          onEventClick={() => {}}
          variant="widget"
        />
      </Box>

      <Box>
        <Text
          fontSize="sm"
          fontWeight={600}
          mb={3}
          fontFamily={NEPALI_FONT_STACK}
        >
          Today • {formatNepaliDate(todayNepali)}
        </Text>
        <Stack gap={2}>
          {tasks.map((task, i) => (
            <HStack key={i} gap={3} alignItems="flex-start">
              <Box
                mt="3px"
                w="14px"
                h="14px"
                borderRadius="3px"
                border="1.5px solid"
                borderColor="gray.300"
                flexShrink={0}
              />
              <Text fontSize="xs" color="gray.500" minW="52px" flexShrink={0}>
                {task.time}
              </Text>
              <Text fontSize="xs" color="gray.700">
                {task.label}
              </Text>
            </HStack>
          ))}
        </Stack>

        <Text
          mt={4}
          fontSize="sm"
          color="blue.500"
          cursor="pointer"
          _hover={{ textDecoration: "underline" }}
          onClick={onViewFullCalendar}
        >
          View full calendar →
        </Text>
      </Box>
    </Box>
  );
};
