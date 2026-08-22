import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiResponse } from "@/shared/types/response";
import { toastFail, toastSuccess } from "@/shared/toast";

import {
  CaseDashboardData,
  CaseDashboardResponse,
  CreateMatterAssignmentRequest,
  GlobalDashboardData,
  GlobalDashboardResponse,
  MatterAssignment,
} from "../types/dashboard.types";

// ============================================================
// Query keys
// ============================================================

export const dashboardKeys = {
  firm: ["firm-dashboard"] as const,
  global: ["global-dashboard"] as const,
  assignments: (matterNumber: string) => ["matter-assignments", matterNumber] as const,
};

// ============================================================
// Case Dashboard
// ============================================================

const getFirmDashboard = () => {
  return LawFirmCRMClient.get<ApiResponse<CaseDashboardData>>(
    api.DASHBOARD.FIRM_DASHBOARD
  );
};

export const useFirmDashboardQuery = () => {
  return useQuery({
    queryKey: dashboardKeys.firm,
    queryFn: getFirmDashboard,
    select: (response) => response?.data?.data,
  });
};

// ============================================================
// Global Dashboard
// ============================================================

const getGlobalDashboard = () => {
  return LawFirmCRMClient.get<ApiResponse<GlobalDashboardData>>(
    api.DASHBOARD.GLOBAL_DASHBOARD
  );
};

export const useGlobalDashboardQuery = () => {
  return useQuery({
    queryKey: dashboardKeys.global,
    queryFn: getGlobalDashboard,
    select: (response) => response?.data?.data,
  });
};

// ============================================================
// Matter Assignments
// ============================================================

const getMatterAssignments = (matterNumber: string) => {
  return LawFirmCRMClient.get<ApiResponse<MatterAssignment[]>>(
    api.MATTER_ASSIGNMENTS.GET.replace("{matterNumber}", matterNumber)
  );
};

export const useMatterAssignmentsQuery = (matterNumber: string) => {
  return useQuery({
    queryKey: dashboardKeys.assignments(matterNumber),
    enabled: !!matterNumber,
    queryFn: () => getMatterAssignments(matterNumber),
    select: (response) => response?.data?.data ?? [],
  });
};

const createMatterAssignment = (
  matterNumber: string,
  data: CreateMatterAssignmentRequest
) => {
  return LawFirmCRMClient.post<ApiResponse<MatterAssignment>>(
    api.MATTER_ASSIGNMENTS.POST.replace("{matterNumber}", matterNumber),
    data
  );
};

export const useCreateMatterAssignmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      matterNumber,
      data,
    }: {
      matterNumber: string;
      data: CreateMatterAssignmentRequest;
    }) => createMatterAssignment(matterNumber, data),
    onSuccess: (_, variables) => {
      toastSuccess("Team member assigned successfully");
      queryClient.invalidateQueries({
        queryKey: dashboardKeys.assignments(variables.matterNumber),
      });
    },
    onError: (error: any) => {
      toastFail(error?.response?.data?.message ?? "Failed to assign team member");
    },
  });
};

const removeMatterAssignment = (matterNumber: string, userId: string) => {
  return LawFirmCRMClient.delete<ApiResponse<void>>(
    api.MATTER_ASSIGNMENTS.DELETE.replace("{matterNumber}", matterNumber).replace(
      "{userId}",
      userId
    )
  );
};

export const useRemoveMatterAssignmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      matterNumber,
      userId,
    }: {
      matterNumber: string;
      userId: string;
    }) => removeMatterAssignment(matterNumber, userId),
    onSuccess: (_, variables) => {
      toastSuccess("Team member removed successfully");
      queryClient.invalidateQueries({
        queryKey: dashboardKeys.assignments(variables.matterNumber),
      });
    },
    onError: (error: any) => {
      toastFail(error?.response?.data?.message ?? "Failed to remove team member");
    },
  });
};
