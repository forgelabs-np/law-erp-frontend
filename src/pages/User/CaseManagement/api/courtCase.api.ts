import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiErrorResponse, ApiResponse } from "@/shared/types/response";
import { toastFail, toastSuccess } from "@/shared/toast";

import {
  AddCourtCaseRequest,
  CourtCase,
  CourtEvent,
  RecordJudgmentRequest,
  UpdateCourtCaseRequest,
  UpdateCourtCaseStageRequest,
} from "../types/matter.types";
import { getApiErrorMessage } from "../utils/matterHelpers";

export type { CourtCase };

// ============================================================
// Query keys
// ============================================================

export const courtCaseKeys = {
  detail: (courtCaseRef: string) => ["courtCase", courtCaseRef] as const,
  events: (courtCaseRef: string) => ["courtCaseEvents", courtCaseRef] as const,
};

// ============================================================
// Court case detail / update
// ============================================================

const getCourtCase = async (courtCaseRef: string) => {
  return LawFirmCRMClient.get<ApiResponse<CourtCase>>(
    api.COURT_CASES.GET_BY_REF.replace("{ourCourtCaseRef}", courtCaseRef)
  );
};

export const useGetCourtCaseQuery = (courtCaseRef: string) => {
  return useQuery({
    queryKey: courtCaseKeys.detail(courtCaseRef),
    enabled: !!courtCaseRef,
    queryFn: () => getCourtCase(courtCaseRef),
    select: (response) => response?.data?.data,
  });
};

const updateCourtCase = (
  courtCaseRef: string,
  data: UpdateCourtCaseRequest
) => {
  return LawFirmCRMClient.put<ApiResponse<CourtCase>>(
    api.COURT_CASES.PUT.replace("{ourCourtCaseRef}", courtCaseRef),
    { data }
  );
};

export const useUpdateCourtCaseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courtCaseRef,
      data,
    }: {
      courtCaseRef: string;
      data: UpdateCourtCaseRequest;
    }) => updateCourtCase(courtCaseRef, data),
    onSuccess: (_, variables) => {
      toastSuccess("Court case updated successfully");
      queryClient.invalidateQueries({
        queryKey: courtCaseKeys.detail(variables.courtCaseRef),
      });
      queryClient.invalidateQueries({ queryKey: ["matter"] });
      queryClient.invalidateQueries({ queryKey: ["matters"] });
    },
    onError: (error: ApiErrorResponse) => {
      toastFail(getApiErrorMessage(error, "Failed to update court case"));
    },
  });
};

// ============================================================
// Add court case to a matter
// ============================================================

const addCourtCase = (matterNumber: string, data: AddCourtCaseRequest) => {
  return LawFirmCRMClient.post<ApiResponse<CourtCase>>(
    api.MATTER_MANAGEMENT.ADD_COURT_CASE.replace(
      "{matterNumber}",
      matterNumber
    ),
    { data }
  );
};

export const useAddCourtCaseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      matterNumber,
      data,
    }: {
      matterNumber: string;
      data: AddCourtCaseRequest;
    }) => addCourtCase(matterNumber, data),
    onSuccess: (_, variables) => {
      toastSuccess("Court case added successfully");
      queryClient.invalidateQueries({
        queryKey: ["matter", variables.matterNumber],
      });
      queryClient.invalidateQueries({ queryKey: ["courtCase"] });
      queryClient.invalidateQueries({ queryKey: ["matters"] });
      queryClient.invalidateQueries({ queryKey: ["matterTimeline"] });
    },
    onError: (error: ApiErrorResponse) => {
      toastFail(getApiErrorMessage(error, "Failed to add court case"));
    },
  });
};

// ============================================================
// Stage management
// ============================================================

const updateStage = (
  courtCaseRef: string,
  data: UpdateCourtCaseStageRequest
) => {
  return LawFirmCRMClient.put<ApiResponse<CourtCase>>(
    api.COURT_CASES.UPDATE_STAGE.replace("{ourCourtCaseRef}", courtCaseRef),
    { data }
  );
};

export const useUpdateCourtCaseStageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courtCaseRef,
      data,
    }: {
      courtCaseRef: string;
      data: UpdateCourtCaseStageRequest;
    }) => updateStage(courtCaseRef, data),
    onSuccess: (_, variables) => {
      toastSuccess(
        `Stage updated to ${variables.data.stage.replace(/_/g, " ")}`
      );
      queryClient.invalidateQueries({
        queryKey: courtCaseKeys.detail(variables.courtCaseRef),
      });
      queryClient.invalidateQueries({ queryKey: ["matter"] });
      queryClient.invalidateQueries({ queryKey: ["matters"] });
      queryClient.invalidateQueries({ queryKey: ["matterTimeline"] });
      queryClient.invalidateQueries({ queryKey: ["matterActivityTimeline"] });
    },
    onError: (error: ApiErrorResponse) => {
      toastFail(getApiErrorMessage(error, "Failed to update stage"));
    },
  });
};

// ============================================================
// Judgment
// ============================================================

const recordJudgment = (courtCaseRef: string, data: RecordJudgmentRequest) => {
  return LawFirmCRMClient.put<ApiResponse<CourtCase>>(
    api.COURT_CASES.JUDGMENT.replace("{ourCourtCaseRef}", courtCaseRef),
    { data }
  );
};

export const useRecordJudgmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courtCaseRef,
      data,
    }: {
      courtCaseRef: string;
      data: RecordJudgmentRequest;
    }) => recordJudgment(courtCaseRef, data),
    onSuccess: (_, variables) => {
      toastSuccess("Judgment recorded successfully");
      queryClient.invalidateQueries({
        queryKey: courtCaseKeys.detail(variables.courtCaseRef),
      });
      queryClient.invalidateQueries({ queryKey: ["matter"] });
      queryClient.invalidateQueries({ queryKey: ["matters"] });
      queryClient.invalidateQueries({ queryKey: ["matterTimeline"] });
      queryClient.invalidateQueries({ queryKey: ["matterActivityTimeline"] });
    },
    onError: (error: ApiErrorResponse) => {
      toastFail(getApiErrorMessage(error, "Failed to record judgment"));
    },
  });
};

// ============================================================
// Court events on a court case
// ============================================================

const getCourtCaseEvents = (courtCaseRef: string) => {
  return LawFirmCRMClient.get<ApiResponse<CourtEvent[]>>(
    api.COURT_CASES.GET_EVENTS.replace("{ourCourtCaseRef}", courtCaseRef)
  );
};

export const useGetCourtCaseEventsQuery = (courtCaseRef: string) => {
  return useQuery({
    queryKey: courtCaseKeys.events(courtCaseRef),
    enabled: !!courtCaseRef,
    queryFn: () => getCourtCaseEvents(courtCaseRef),
    select: (response) => response?.data?.data ?? [],
  });
};
