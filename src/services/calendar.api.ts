import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiResponse } from "@/shared/types/response";
import { CalendarEvent } from "@/types/calendar.types";

export interface GetCalendarEventsParams {
  from: string;
  to: string;
  advocateId?: string;
}

export interface GetUpcomingHearingsParams {
  days?: number;
  advocateId?: string;
}

const getCalendarEvents = async (params: GetCalendarEventsParams) => {
  return LawFirmCRMClient.get<ApiResponse<CalendarEvent[]>>(
    api.CALENDAR.GET_EVENTS,
    { params }
  );
};

const getTodayHearings = async () => {
  return LawFirmCRMClient.get<ApiResponse<CalendarEvent[]>>(
    api.CALENDAR.GET_TODAY
  );
};

const getUpcomingHearings = async (params?: GetUpcomingHearingsParams) => {
  return LawFirmCRMClient.get<ApiResponse<CalendarEvent[]>>(
    api.CALENDAR.GET_UPCOMING,
    { params }
  );
};

export const calendarApi = {
  getCalendarEvents,
  getTodayHearings,
  getUpcomingHearings,
};
