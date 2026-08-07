import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiErrorResponse, ApiResponse } from "@/shared/types/response";
import { toastFail, toastSuccess } from "@/shared/toast";

import {
  Hearing,
  CreateHearingRequest,
  UpdateHearingRequest,
  HearingFilters,
} from "../types/hearing.types";

export type { Hearing };

const getHearing = async (hearingId: string) => {
  return LawFirmCRMClient.get<ApiResponse<Hearing>>(
    api.HEARINGS.GET_HEARING.replace("{hearingId}", hearingId)
  );
};

export const useGetHearingQuery = (hearingId: string) => {
  return useQuery({
    queryKey: ["hearing", hearingId],
    enabled: !!hearingId,
    queryFn: () => getHearing(hearingId),
    select: (response) => response?.data?.data,
  });
};

const getHearingsByCase = async (
  caseNumber: string,
  filters?: HearingFilters
) => {
  return LawFirmCRMClient.get<ApiResponse<Hearing[]>>(
    api.CASE_MANAGEMENT.GET_HEARINGS.replace("{caseNumber}", caseNumber),
    { params: filters }
  );
};

export const useGetCaseHearingsQuery = (
  caseNumber: string,
  filters?: HearingFilters
) => {
  return useQuery({
    queryKey: ["case-hearings", caseNumber, filters],
    enabled: !!caseNumber,
    queryFn: () => getHearingsByCase(caseNumber, filters),
    select: (response) => response?.data?.data,
  });
};

const createHearing = (caseNumber: string, data: CreateHearingRequest) => {
  return LawFirmCRMClient.post<ApiResponse<Hearing>>(
    api.CASE_MANAGEMENT.GET_HEARINGS.replace("{caseNumber}", caseNumber),
    { data }
  );
};

export const useCreateHearingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      caseNumber,
      data,
    }: {
      caseNumber: string;
      data: CreateHearingRequest;
    }) => createHearing(caseNumber, data),
    onSuccess: (_, variables) => {
      toastSuccess("Hearing scheduled successfully");
      queryClient.invalidateQueries({
        queryKey: ["case-hearings", variables.caseNumber],
      });
      queryClient.invalidateQueries({
        queryKey: ["calendar"],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Failed to schedule hearing";
      toastFail(errorMessage);
    },
  });
};

const updateHearing = (hearingId: string, data: UpdateHearingRequest) => {
  return LawFirmCRMClient.put<ApiResponse<Hearing>>(
    api.HEARINGS.UPDATE_HEARING.replace("{hearingId}", hearingId),
    { data }
  );
};

export const useUpdateHearingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      hearingId,
      data,
    }: {
      hearingId: string;
      data: UpdateHearingRequest;
    }) => updateHearing(hearingId, data),
    onSuccess: (_, variables) => {
      toastSuccess("Hearing updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["hearing", variables.hearingId],
      });
      queryClient.invalidateQueries({
        queryKey: ["case-hearings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["calendar"],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Failed to update hearing";
      toastFail(errorMessage);
    },
  });
};

const deleteHearing = (hearingId: string) => {
  return LawFirmCRMClient.delete<ApiResponse<void>>(
    api.HEARINGS.DELETE_HEARING.replace("{hearingId}", hearingId)
  );
};

export const useDeleteHearingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (hearingId: string) => deleteHearing(hearingId),
    onSuccess: () => {
      toastSuccess("Hearing cancelled successfully");
      queryClient.invalidateQueries({
        queryKey: ["case-hearings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["calendar"],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Failed to cancel hearing";
      toastFail(errorMessage);
    },
  });
};
