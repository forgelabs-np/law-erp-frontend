import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import {
  ActiveModule,
  Plan,
  PlanCreateRequest,
  PlanStatusRequest,
  PlanUpdateRequest,
} from "@/shared/types/plan";
import { ApiResponse } from "@/shared/types/response";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import {
  errorNotification,
  successNotification,
} from "@/shared/utils/notification";

// ─── Query keys ──────────────────────────────────────────────────────────────

export const PLAN_QUERY_KEYS = {
  /** Public catalogue (`GET /plans`) — active + public plans only. */
  PUBLIC: ["plans", "public"] as const,
  /** Every plan, including inactive and private (`GET /super-admin/plans`). */
  LIST: ["plans", "super-admin"] as const,
  DETAIL: (planId: string) => ["plans", "super-admin", planId] as const,
  /** Active module catalogue for the plan module picker. */
  ACTIVE_MODULES: ["modules", "active"] as const,
} as const;

/** Prefix invalidation for every plan-backed query (list, detail, public). */
const invalidatePlanQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  planId?: string
) => {
  queryClient.invalidateQueries({ queryKey: ["plans"] });
  if (planId) {
    queryClient.invalidateQueries({ queryKey: PLAN_QUERY_KEYS.DETAIL(planId) });
  }
};

// ─── Service functions ───────────────────────────────────────────────────────

const getPublicPlans = () => {
  return LawFirmCRMClient.get<ApiResponse<Plan[]>>(api.PLAN_MANAGEMENT.PUBLIC);
};

const getPlans = () => {
  return LawFirmCRMClient.get<ApiResponse<Plan[]>>(api.PLAN_MANAGEMENT.LIST);
};

const getPlanById = (planId: string) => {
  return LawFirmCRMClient.get<ApiResponse<Plan>>(
    api.PLAN_MANAGEMENT.GET_BY_ID.replace("{planId}", planId)
  );
};

const getActiveModules = () => {
  return LawFirmCRMClient.get<ApiResponse<ActiveModule[]>>(
    api.ACTIVE_MODULES
  );
};

const createPlan = (payload: PlanCreateRequest) => {
  return LawFirmCRMClient.post<ApiResponse<Plan>>(api.PLAN_MANAGEMENT.CREATE, {
    data: payload,
  });
};

const updatePlan = ({
  planId,
  payload,
}: {
  planId: string;
  payload: PlanUpdateRequest;
}) => {
  return LawFirmCRMClient.put<ApiResponse<Plan>>(
    api.PLAN_MANAGEMENT.UPDATE.replace("{planId}", planId),
    { data: payload }
  );
};

const changePlanStatus = ({
  planId,
  payload,
}: {
  planId: string;
  payload: PlanStatusRequest;
}) => {
  return LawFirmCRMClient.patch<ApiResponse<Plan>>(
    api.PLAN_MANAGEMENT.STATUS.replace("{planId}", planId),
    { data: payload }
  );
};

const deletePlan = (planId: string) => {
  return LawFirmCRMClient.delete<ApiResponse<string>>(
    api.PLAN_MANAGEMENT.DELETE.replace("{planId}", planId)
  );
};

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * Public pricing catalogue. No authentication is required, so this can run on
 * the public pricing page before a user logs in.
 */
export const usePublicPlansQuery = () => {
  return useQuery({
    queryKey: PLAN_QUERY_KEYS.PUBLIC,
    queryFn: async () => {
      const response = await getPublicPlans();
      return response.data?.data ?? [];
    },
    // Public, backend-filtered list: cache briefly so revisiting the page is
    // instant without hiding price changes for long.
    staleTime: 5 * 60 * 1000,
  });
};

export const usePlansQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: PLAN_QUERY_KEYS.LIST,
    queryFn: async () => {
      const response = await getPlans();
      return response.data?.data ?? [];
    },
    enabled: options?.enabled ?? true,
    staleTime: 30 * 1000,
  });
};

export const usePlanQuery = (planId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: PLAN_QUERY_KEYS.DETAIL(planId),
    queryFn: async () => {
      const response = await getPlanById(planId);
      return response.data?.data;
    },
    enabled: (options?.enabled ?? true) && !!planId,
  });
};

export const useActiveModulesQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: PLAN_QUERY_KEYS.ACTIVE_MODULES,
    queryFn: async () => {
      const response = await getActiveModules();
      return response.data?.data ?? [];
    },
    enabled: options?.enabled ?? true,
    staleTime: 10 * 60 * 1000,
  });
};

// ─── Mutations ───────────────────────────────────────────────────────────────

export const useCreatePlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPlan,
    onSuccess: (response) => {
      successNotification(
        response.data?.message || "Plan created successfully"
      );
      invalidatePlanQueries(queryClient);
    },
    onError: (error: unknown) => {
      errorNotification(getApiErrorMessage(error, "Failed to create plan"));
    },
  });
};

export const useUpdatePlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePlan,
    onSuccess: (response, variables) => {
      successNotification(
        response.data?.message || "Plan updated successfully"
      );
      invalidatePlanQueries(queryClient, variables.planId);
    },
    onError: (error: unknown) => {
      errorNotification(getApiErrorMessage(error, "Failed to update plan"));
    },
  });
};

export const useChangePlanStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changePlanStatus,
    onSuccess: (response, variables) => {
      successNotification(
        response.data?.message ||
          (variables.payload.isActive
            ? "Plan activated successfully"
            : "Plan deactivated successfully")
      );
      invalidatePlanQueries(queryClient, variables.planId);
    },
    onError: (error: unknown) => {
      errorNotification(
        getApiErrorMessage(error, "Failed to update plan status")
      );
    },
  });
};

export const useDeletePlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePlan,
    onSuccess: (response) => {
      successNotification(
        response.data?.message || "Plan deleted successfully"
      );
      invalidatePlanQueries(queryClient);
    },
    onError: (error: unknown) => {
      errorNotification(getApiErrorMessage(error, "Failed to delete plan"));
    },
  });
};
