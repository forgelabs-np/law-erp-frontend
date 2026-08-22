import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import {
  ApiErrorResponse,
  ApiResponse,
  PaginatedResponse,
} from "@/shared/types/response";
import { toastFail, toastSuccess } from "@/shared/toast";

import {
  CreateMatterRequest,
  FirmTimelineFilters,
  MatterFilters,
  MatterResponse,
  MatterSummary,
  MatterTimelineEvent,
  StaleMatter,
  StaleMatterFilters,
  UpdateMatterRequest,
} from "../types/matter.types";
import { getApiErrorMessage } from "../utils/matterHelpers";

export type { MatterResponse, MatterSummary };

// ============================================================
// Query keys
// ============================================================

export const matterKeys = {
  list: (filters: MatterFilters) => ["matters", filters] as const,
  detail: (matterNumber: string) => ["matter", matterNumber] as const,
  timeline: (matterNumber: string) => ["matterTimeline", matterNumber] as const,
  activityTimeline: (filters: FirmTimelineFilters) =>
    ["matterActivityTimeline", filters] as const,
  stale: (filters: StaleMatterFilters) => ["staleMatters", filters] as const,
};

// ============================================================
// Matters list / detail
// ============================================================

const getMatters = (filters: MatterFilters) => {
  return LawFirmCRMClient.get<ApiResponse<PaginatedResponse<MatterSummary>>>(
    api.MATTER_MANAGEMENT.GET_MATTERS,
    { params: filters }
  );
};

export const useGetMattersQuery = (filters: MatterFilters) => {
  return useQuery({
    queryKey: matterKeys.list(filters),
    queryFn: () => getMatters(filters),
    select: (response) => response?.data?.data,
  });
};

const getMatter = async (matterNumber: string) => {
  return LawFirmCRMClient.get<ApiResponse<MatterResponse>>(
    api.MATTER_MANAGEMENT.GET_BY_MATTER_NUMBER.replace(
      "{matterNumber}",
      matterNumber
    )
  );
};

export const useGetMatterQuery = (matterNumber: string) => {
  return useQuery({
    queryKey: matterKeys.detail(matterNumber),
    enabled: !!matterNumber,
    queryFn: () => getMatter(matterNumber),
    select: (response) => response?.data?.data,
  });
};

const createMatter = (data: CreateMatterRequest) => {
  return LawFirmCRMClient.post<ApiResponse<MatterResponse>>(
    api.MATTER_MANAGEMENT.POST,
    { data }
  );
};

export const useCreateMatterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMatter,
    onSuccess: (response) => {
      toastSuccess(
        `Matter ${response?.data?.data?.matterNumber} created successfully`
      );
      queryClient.invalidateQueries({ queryKey: ["matters"] });
    },
    onError: (error: ApiErrorResponse) => {
      toastFail(getApiErrorMessage(error, "Failed to create matter"));
    },
  });
};

const updateMatter = (matterNumber: string, data: UpdateMatterRequest) => {
  return LawFirmCRMClient.put<ApiResponse<MatterResponse>>(
    api.MATTER_MANAGEMENT.PUT.replace("{matterNumber}", matterNumber),
    { data }
  );
};

export const useUpdateMatterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      matterNumber,
      data,
    }: {
      matterNumber: string;
      data: UpdateMatterRequest;
    }) => updateMatter(matterNumber, data),
    onSuccess: (_, variables) => {
      toastSuccess(`Matter ${variables.matterNumber} updated successfully`);
      queryClient.invalidateQueries({
        queryKey: matterKeys.detail(variables.matterNumber),
      });
      queryClient.invalidateQueries({ queryKey: ["matters"] });
    },
    onError: (error: ApiErrorResponse) => {
      toastFail(getApiErrorMessage(error, "Failed to update matter"));
    },
  });
};

const deleteMatter = (matterNumber: string) => {
  return LawFirmCRMClient.delete<ApiResponse<void>>(
    api.MATTER_MANAGEMENT.DELETE.replace("{matterNumber}", matterNumber)
  );
};

export const useDeleteMatterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMatter,
    onSuccess: (_, matterNumber) => {
      toastSuccess(`Matter ${matterNumber} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ["matters"] });
    },
    onError: (error: ApiErrorResponse) => {
      toastFail(getApiErrorMessage(error, "Failed to delete matter"));
    },
  });
};

// ============================================================
// Timeline
// ============================================================

const getMatterTimeline = (matterNumber: string) => {
  return LawFirmCRMClient.get<ApiResponse<MatterTimelineEvent[]>>(
    api.MATTER_MANAGEMENT.GET_TIMELINE.replace("{matterNumber}", matterNumber)
  );
};

export const useGetMatterTimelineQuery = (matterNumber: string) => {
  return useQuery({
    queryKey: matterKeys.timeline(matterNumber),
    enabled: !!matterNumber,
    queryFn: () => getMatterTimeline(matterNumber),
    select: (response) => response?.data?.data ?? [],
  });
};

const getFirmTimeline = (filters: FirmTimelineFilters) => {
  return LawFirmCRMClient.get<
    ApiResponse<PaginatedResponse<MatterTimelineEvent>>
  >(api.MATTER_MANAGEMENT.GET_FIRM_TIMELINE, { params: filters });
};

export const useGetFirmTimelineQuery = (filters: FirmTimelineFilters) => {
  return useQuery({
    queryKey: matterKeys.activityTimeline(filters),
    queryFn: () => getFirmTimeline(filters),
    select: (response) => response?.data?.data,
  });
};

// ============================================================
// Stale matters
// ============================================================

const getStaleMatters = (filters: StaleMatterFilters) => {
  return LawFirmCRMClient.get<ApiResponse<PaginatedResponse<StaleMatter>>>(
    api.MATTER_MANAGEMENT.GET_STALE,
    { params: filters }
  );
};

export const useGetStaleMattersQuery = (filters: StaleMatterFilters) => {
  return useQuery({
    queryKey: matterKeys.stale(filters),
    queryFn: () => getStaleMatters(filters),
    select: (response) => response?.data?.data,
  });
};
