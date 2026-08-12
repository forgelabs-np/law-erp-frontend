import { useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box } from "@chakra-ui/react";
import { Task } from "../../types/Task";
import { mapTaskToEvent } from "../../utils/calendarHelpers";
import { TaskEventCard } from "./TaskEventCard";
import "./calendarStyles.css";

interface TaskCalendarProps {
  tasks: Task[];
  onEventClick: (task: Task) => void;
  onEventDrop: (taskId: string, start: Date, end: Date) => void;
  onEventResize: (taskId: string, start: Date, end: Date) => void;
  onDateClick: (date: Date) => void;
  calendarRef: React.RefObject<any>; // FullCalendar ref
  currentView: string;
  currentDate: Date;
}

export const TaskCalendar = ({
  tasks,
  onEventClick,
  onEventDrop,
  onEventResize,
  onDateClick,
  calendarRef,
  currentView,
  currentDate,
}: TaskCalendarProps) => {
  const events = tasks.map(mapTaskToEvent);

  useEffect(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.changeView(currentView);
    }
  }, [currentView]);

  // Sync calendar date when parent's currentDate changes
  useEffect(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.gotoDate(currentDate);
    }
  }, [currentDate]);

  return (
    <Box
      bg="white"
      _dark={{ bg: "gray.900" }}
      borderRadius="xl"
      p={4}
      boxShadow="sm"
      flex="1"
      overflow="hidden"
    >
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={currentView}
        initialDate={currentDate}
        headerToolbar={false}
        events={events}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={3}
        eventContent={(eventInfo) => <TaskEventCard event={eventInfo.event} />}
        eventClick={(clickInfo) =>
          onEventClick(clickInfo.event.extendedProps as Task)
        }
        eventDrop={(dropInfo) => {
          if (dropInfo.event.start && dropInfo.event.end) {
            onEventDrop(
              dropInfo.event.id,
              dropInfo.event.start,
              dropInfo.event.end
            );
          }
        }}
        eventResize={(resizeInfo) => {
          if (resizeInfo.event.start && resizeInfo.event.end) {
            onEventResize(
              resizeInfo.event.id,
              resizeInfo.event.start,
              resizeInfo.event.end
            );
          }
        }}
        dateClick={(info) => onDateClick(info.date)}
        height="100%"
      />
    </Box>
  );
};
