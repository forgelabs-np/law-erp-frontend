import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiErrorResponse, ApiResponse } from "@/shared/types/response";
import { toastFail, toastSuccess } from "@/shared/toast";

import {
  CourtEvent,
  CreateCourtEventRequest,
  MarkEventHeldRequest,
  UpdateCourtEventRequest,
} from "../types/matter.types";
import { getApiErrorMessage } from "../utils/matterHelpers";

export type { CourtEvent };

// ============================================================
// Query keys
// ============================================================

export const courtEventKeys = {
  detail: (eventId: string) => ["courtEvent", eventId] as const,
};

// ============================================================
// Create event (on a court case)
// ============================================================

const createEvent = (courtCaseRef: string, data: CreateCourtEventRequest) => {
  return LawFirmCRMClient.post<ApiResponse<CourtEvent>>(
    api.COURT_CASES.GET_EVENTS.replace("{ourCourtCaseRef}", courtCaseRef),
    { data }
  );
};

export const useCreateCourtEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courtCaseRef,
      data,
    }: {
      courtCaseRef: string;
      data: CreateCourtEventRequest;
    }) => createEvent(courtCaseRef, data),
    onSuccess: (_, variables) => {
      toastSuccess("Court event scheduled successfully");
      queryClient.invalidateQueries({
        queryKey: ["courtCaseEvents", variables.courtCaseRef],
      });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      queryClient.invalidateQueries({ queryKey: ["matterTimeline"] });
      queryClient.invalidateQueries({ queryKey: ["matterActivityTimeline"] });
    },
    onError: (error: ApiErrorResponse) => {
      toastFail(getApiErrorMessage(error, "Failed to schedule event"));
    },
  });
};

// ============================================================
// Event detail
// ============================================================

const getEvent = (eventId: string) => {
  return LawFirmCRMClient.get<ApiResponse<CourtEvent>>(
    api.COURT_EVENTS.GET.replace("{eventId}", eventId)
  );
};

export const useGetCourtEventQuery = (eventId: string) => {
  return useQuery({
    queryKey: courtEventKeys.detail(eventId),
    enabled: !!eventId,
    queryFn: () => getEvent(eventId),
    select: (response) => response?.data?.data,
  });
};

// ============================================================
// Update event
// ============================================================

const updateEvent = (eventId: string, data: UpdateCourtEventRequest) => {
  return LawFirmCRMClient.put<ApiResponse<CourtEvent>>(
    api.COURT_EVENTS.PUT.replace("{eventId}", eventId),
    { data }
  );
};

export const useUpdateCourtEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: UpdateCourtEventRequest;
    }) => updateEvent(eventId, data),
    onSuccess: (_, variables) => {
      toastSuccess("Court event updated successfully");
      queryClient.invalidateQueries({
        queryKey: courtEventKeys.detail(variables.eventId),
      });
      queryClient.invalidateQueries({ queryKey: ["courtCaseEvents"] });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      queryClient.invalidateQueries({ queryKey: ["matterTimeline"] });
      queryClient.invalidateQueries({ queryKey: ["matterActivityTimeline"] });
    },
    onError: (error: ApiErrorResponse) => {
      toastFail(getApiErrorMessage(error, "Failed to update event"));
    },
  });
};

// ============================================================
// Cancel event
// ============================================================

const cancelEvent = (eventId: string) => {
  return LawFirmCRMClient.delete<ApiResponse<void>>(
    api.COURT_EVENTS.DELETE.replace("{eventId}", eventId)
  );
};

export const useCancelCourtEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => cancelEvent(eventId),
    onSuccess: () => {
      toastSuccess("Court event cancelled");
      queryClient.invalidateQueries({ queryKey: ["courtCaseEvents"] });
      queryClient.invalidateQueries({ queryKey: ["courtEvent"] });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      queryClient.invalidateQueries({ queryKey: ["matterTimeline"] });
      queryClient.invalidateQueries({ queryKey: ["matterActivityTimeline"] });
    },
    onError: (error: ApiErrorResponse) => {
      toastFail(getApiErrorMessage(error, "Failed to cancel event"));
    },
  });
};

// ============================================================
// Mark event as held (backend creates + links the next event)
// ============================================================

const markEventHeld = (eventId: string, data: MarkEventHeldRequest) => {
  return LawFirmCRMClient.post<ApiResponse<CourtEvent>>(
    api.COURT_EVENTS.HELD.replace("{eventId}", eventId),
    { data }
  );
};

export const useMarkEventHeldMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: MarkEventHeldRequest;
    }) => markEventHeld(eventId, data),
    onSuccess: () => {
      toastSuccess("Event marked as held");
      queryClient.invalidateQueries({ queryKey: ["courtCaseEvents"] });
      queryClient.invalidateQueries({ queryKey: ["courtEvent"] });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      queryClient.invalidateQueries({ queryKey: ["matterTimeline"] });
      queryClient.invalidateQueries({ queryKey: ["matterActivityTimeline"] });
      queryClient.invalidateQueries({ queryKey: ["matter"] });
    },
    onError: (error: ApiErrorResponse) => {
      toastFail(getApiErrorMessage(error, "Failed to mark event as held"));
    },
  });
};
