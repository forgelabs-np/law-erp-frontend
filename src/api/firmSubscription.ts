import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import {
  ConvertSubscriptionRequest,
  ExtendTrialRequest,
  StartTrialRequest,
  TrialSubscription,
} from "@/shared/types/plan";
import { ApiResponse } from "@/shared/types/response";
import {
  getApiErrorMessage,
  getApiErrorStatus,
} from "@/shared/utils/apiError";
import {
  errorNotification,
  successNotification,
} from "@/shared/utils/notification";

// ─── Query keys ──────────────────────────────────────────────────────────────

export const FIRM_TRIAL_QUERY_KEYS = {
  DETAIL: (firmId: string) => ["firm-trial", firmId] as const,
} as const;

// ─── Service functions ───────────────────────────────────────────────────────

const getFirmTrial = (firmId: string) => {
  return LawFirmCRMClient.get<ApiResponse<TrialSubscription>>(
    api.FIRM_SUBSCRIPTION.TRIAL.replace("{firmId}", firmId)
  );
};

const startTrial = ({
  firmId,
  payload,
}: {
  firmId: string;
  payload: StartTrialRequest;
}) => {
  return LawFirmCRMClient.post<ApiResponse<TrialSubscription>>(
    api.FIRM_SUBSCRIPTION.TRIAL.replace("{firmId}", firmId),
    { data: payload }
  );
};

const extendTrial = ({
  firmId,
  payload,
}: {
  firmId: string;
  payload: ExtendTrialRequest;
}) => {
  return LawFirmCRMClient.put<ApiResponse<null>>(
    api.FIRM_LIFECYCLE.EXTEND_TRIAL.replace("{firmId}", firmId),
    { data: payload }
  );
};

const convertSubscription = ({
  firmId,
  payload,
}: {
  firmId: string;
  payload: ConvertSubscriptionRequest;
}) => {
  return LawFirmCRMClient.post<ApiResponse<TrialSubscription>>(
    api.FIRM_SUBSCRIPTION.CONVERT.replace("{firmId}", firmId),
    { data: payload }
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * A firm that has never had a trial returns 404 with
 * "No trial or subscription for this firm". That is an expected state (the UI
 * shows the Start Trial form), not a page failure.
 */
export const isNoTrialError = (error: unknown): boolean => {
  if (getApiErrorStatus(error) !== 404) return false;
  const message = getApiErrorMessage(error, "").toLowerCase();
  if (!message) return true;
  if (message.includes("firm not found")) return false;
  return (
    message.includes("no trial") ||
    message.includes("no subscription") ||
    message.includes("trial or subscription")
  );
};

/** Invalidates the firm's subscription state and its firm record. */
const invalidateFirmSubscription = (
  queryClient: ReturnType<typeof useQueryClient>,
  firmId: string
) => {
  queryClient.invalidateQueries({
    queryKey: FIRM_TRIAL_QUERY_KEYS.DETAIL(firmId),
  });
  queryClient.invalidateQueries({ queryKey: [`firm-${firmId}`] });
  queryClient.invalidateQueries({
    queryKey: [api.FIRM_MANAGEMENT.GET_FIRMS],
  });
  // Trials and conversions change the firm's enabled modules and storage quota.
  queryClient.invalidateQueries({
    queryKey: [api.FIRM_MANAGEMENT.GET_FIRM_MODULES, firmId],
  });
};

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useFirmTrialQuery = (firmId: string) => {
  return useQuery({
    queryKey: FIRM_TRIAL_QUERY_KEYS.DETAIL(firmId),
    queryFn: async () => {
      const response = await getFirmTrial(firmId);
      return response.data?.data;
    },
    enabled: !!firmId,
    // A 404 is a legitimate state (no trial yet); retrying only delays the
    // Start Trial form.
    retry: false,
    staleTime: 0,
  });
};

// ─── Mutations ───────────────────────────────────────────────────────────────

export const useStartTrialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startTrial,
    onSuccess: (response, variables) => {
      successNotification(
        response.data?.message || "Trial started successfully"
      );
      invalidateFirmSubscription(queryClient, variables.firmId);
    },
    onError: (error: unknown) => {
      errorNotification(getApiErrorMessage(error, "Failed to start trial"));
    },
  });
};

export const useExtendFirmTrialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: extendTrial,
    onSuccess: (response, variables) => {
      successNotification(
        response.data?.message || "Trial extended successfully"
      );
      // The response data is null — the panel re-fetches the subscription for
      // the authoritative dates instead of calculating them locally.
      invalidateFirmSubscription(queryClient, variables.firmId);
    },
    onError: (error: unknown) => {
      errorNotification(getApiErrorMessage(error, "Failed to extend trial"));
    },
  });
};

export const useConvertSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: convertSubscription,
    onSuccess: (response, variables) => {
      successNotification(
        response.data?.message || "Subscription converted successfully"
      );
      invalidateFirmSubscription(queryClient, variables.firmId);
    },
    onError: (error: unknown) => {
      errorNotification(
        getApiErrorMessage(error, "Failed to convert subscription")
      );
    },
  });
};
