import { Box, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  parseISO,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { useState } from "react";

import { CalendarEvent } from "@/types/calendar.types";

const HOUR_HEIGHT = 64;
const START_HOUR = 8;
const END_HOUR = 17;
const HOURS = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, i) => START_HOUR + i
);

const COLOR_MAP: Record<
  CalendarEvent["color"],
  { bg: string; border: string; text: string }
> = {
  blue: { bg: "#dbeafe", border: "#93c5fd", text: "#1e40af" },
  green: { bg: "#dcfce7", border: "#86efac", text: "#166534" },
  purple: { bg: "#ede9fe", border: "#c4b5fd", text: "#5b21b6" },
  orange: { bg: "#ffedd5", border: "#fdba74", text: "#9a3412" },
};

const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const minutesToPx = (minutes: number) =>
  ((minutes - START_HOUR * 60) / 60) * HOUR_HEIGHT;

const EventBlock = ({ event }: { event: CalendarEvent }) => {
  const startMins = timeToMinutes(event.startTime);
  const endMins = timeToMinutes(event.endTime);
  const top = minutesToPx(startMins);
  const height = ((endMins - startMins) / 60) * HOUR_HEIGHT;
  const colors = COLOR_MAP[event.color];

  return (
    <Box
      position="absolute"
      top={`${top}px`}
      left="4px"
      right="4px"
      height={`${height - 4}px`}
      bg={colors.bg}
      border="1px solid"
      borderColor={colors.border}
      borderRadius="8px"
      p="6px 8px"
      overflow="hidden"
      zIndex={1}
      cursor="pointer"
      _hover={{ filter: "brightness(0.97)" }}
    >
      <Text
        fontSize="11px"
        fontWeight={700}
        color={colors.text}
        lineHeight="1.3"
      >
        {event.title}
      </Text>
      {event.subtitle && (
        <Text
          fontSize="10px"
          color={colors.text}
          opacity={0.8}
          lineHeight="1.3"
        >
          {event.subtitle}
        </Text>
      )}
      <Text fontSize="10px" color={colors.text} opacity={0.7} mt="2px">
        {event.startTime} – {event.endTime}
      </Text>
    </Box>
  );
};

type CalendarView = "week" | "month" | "day";

interface WeeklyCalendarProps {
  events: CalendarEvent[];
  initialDate?: Date;
}

export const WeeklyCalendar = ({
  events,
  initialDate = new Date(),
}: WeeklyCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [view, setView] = useState<CalendarView>("week");

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Mon
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const rangeLabel = `${format(weekStart, "MMM d")} – ${format(
    weekEnd,
    "MMM d, yyyy"
  )}`;

  const getEventsForDay = (day: Date) =>
    events.filter((e) => {
      try {
        return isSameDay(parseISO(e.date), day);
      } catch {
        return false;
      }
    });

  const totalHeight = HOURS.length * HOUR_HEIGHT;

  return (
    <Box
      bg="white"
      borderRadius="16px"
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden"
      h="100%"
    >
      <HStack
        px={5}
        py={3}
        borderBottom="1px solid"
        borderColor="gray.100"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={3}
      >
        <HStack gap={2}>
          <Box
            as="button"
            px={2}
            py={1}
            borderRadius="6px"
            fontSize="sm"
            color="gray.500"
            _hover={{ bg: "gray.100" }}
            onClick={() => setCurrentDate((d) => subWeeks(d, 1))}
          >
            ‹
          </Box>
          <Box
            as="button"
            px={3}
            py={1}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="8px"
            fontSize="sm"
            color="gray.700"
            _hover={{ bg: "gray.50" }}
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Box>
          <Box
            as="button"
            px={2}
            py={1}
            borderRadius="6px"
            fontSize="sm"
            color="gray.500"
            _hover={{ bg: "gray.100" }}
            onClick={() => setCurrentDate((d) => addWeeks(d, 1))}
          >
            ›
          </Box>
        </HStack>

        <Text fontWeight={700} fontSize="md" color="gray.800">
          {rangeLabel}
        </Text>

        <HStack gap={1}>
          {(["Week", "Month", "Day"] as const).map((v) => {
            const key = v.toLowerCase() as CalendarView;
            const active = view === key;
            return (
              <Box
                key={key}
                as="button"
                px={3}
                py={1}
                borderRadius="8px"
                fontSize="sm"
                fontWeight={active ? 700 : 400}
                bg={active ? "blue.600" : "transparent"}
                color={active ? "white" : "gray.600"}
                border={active ? "none" : "1px solid"}
                borderColor="gray.200"
                _hover={{ bg: active ? "blue.700" : "gray.100" }}
                onClick={() => setView(key)}
              >
                {v}
              </Box>
            );
          })}
        </HStack>
      </HStack>

      <Grid
        templateColumns={`56px repeat(7, 1fr)`}
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        <Box />
        {weekDays.map((day) => {
          const today = isToday(day);
          return (
            <VStack
              key={day.toISOString()}
              gap={1}
              py={3}
              alignItems="center"
              borderLeft="1px solid"
              borderColor="gray.100"
            >
              <Text fontSize="11px" color="gray.400" fontWeight={500}>
                {format(day, "EEE")}
              </Text>
              <Box
                w="28px"
                h="28px"
                borderRadius="50%"
                bg={today ? "blue.600" : "transparent"}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text
                  fontSize="sm"
                  fontWeight={today ? 700 : 500}
                  color={today ? "white" : "gray.700"}
                >
                  {format(day, "d")}
                </Text>
              </Box>
            </VStack>
          );
        })}
      </Grid>

      <Box overflow="auto" maxH="520px">
        <Grid templateColumns={`56px repeat(7, 1fr)`}>
          <Box position="relative" height={`${totalHeight}px`}>
            {HOURS.map((hour) => (
              <Box
                key={hour}
                position="absolute"
                top={`${(hour - START_HOUR) * HOUR_HEIGHT}px`}
                right={2}
                transform="translateY(-50%)"
              >
                <Text fontSize="10px" color="gray.400">
                  {hour === 12
                    ? "12 PM"
                    : hour > 12
                      ? `${hour - 12} PM`
                      : `${hour} AM`}
                </Text>
              </Box>
            ))}
          </Box>

          {weekDays.map((day) => {
            const dayEvents = getEventsForDay(day);
            return (
              <Box
                key={day.toISOString()}
                position="relative"
                height={`${totalHeight}px`}
                borderLeft="1px solid"
                borderColor="gray.100"
              >
                {HOURS.map((hour) => (
                  <Box
                    key={hour}
                    position="absolute"
                    top={`${(hour - START_HOUR) * HOUR_HEIGHT}px`}
                    left={0}
                    right={0}
                    borderTop="1px solid"
                    borderColor="gray.100"
                  />
                ))}
                {dayEvents.map((event) => (
                  <EventBlock key={event.id} event={event} />
                ))}
              </Box>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};
