import { useQuery } from "@tanstack/react-query";
import {
  calendarApi,
  GetCalendarEventsParams,
  GetUpcomingHearingsParams,
} from "@/services/calendar.api";
import { CalendarEvent } from "@/types/calendar.types";

export const calendarKeys = {
  all: ["calendar"] as const,
  events: (params: GetCalendarEventsParams) =>
    ["calendar", "events", params] as const,
  today: () => ["calendar", "today"] as const,
  upcoming: (params?: GetUpcomingHearingsParams) =>
    ["calendar", "upcoming", params] as const,
};

export const useCalendarEvents = (params: GetCalendarEventsParams) => {
  return useQuery({
    queryKey: calendarKeys.events(params),
    queryFn: () => calendarApi.getCalendarEvents(params),
    select: (response) => response?.data?.data || [],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTodayHearings = () => {
  return useQuery({
    queryKey: calendarKeys.today(),
    queryFn: calendarApi.getTodayHearings,
    select: (response) => response?.data?.data || [],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUpcomingHearings = (params?: GetUpcomingHearingsParams) => {
  return useQuery({
    queryKey: calendarKeys.upcoming(params),
    queryFn: () => calendarApi.getUpcomingHearings(params),
    select: (response) => response?.data?.data || [],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
