import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiErrorResponse, ApiResponse } from "@/shared/types/response";
import { toastFail, toastSuccess } from "@/shared/toast";

import {
  MatterParty,
  PartyEntryRequest,
  PartyMatch,
  PartyMatchRequest,
} from "../types/matter.types";
import { getApiErrorMessage } from "../utils/matterHelpers";

export type { MatterParty };

// ============================================================
// Add party
// ============================================================

const addParty = (matterNumber: string, data: PartyEntryRequest) => {
  return LawFirmCRMClient.post<ApiResponse<MatterParty>>(
    api.MATTER_MANAGEMENT.ADD_PARTY.replace("{matterNumber}", matterNumber),
    { data }
  );
};

export const useAddMatterPartyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      matterNumber,
      data,
    }: {
      matterNumber: string;
      data: PartyEntryRequest;
    }) => addParty(matterNumber, data),
    onSuccess: (_, variables) => {
      toastSuccess("Party added successfully");
      queryClient.invalidateQueries({
        queryKey: ["matter", variables.matterNumber],
      });
      queryClient.invalidateQueries({ queryKey: ["matters"] });
      queryClient.invalidateQueries({ queryKey: ["matterTimeline"] });
    },
    onError: (error: ApiErrorResponse) => {
      toastFail(getApiErrorMessage(error, "Failed to add party"));
    },
  });
};

// ============================================================
// Party matching (debounced by the caller)
// ============================================================

const matchParty = (data: PartyMatchRequest) => {
  return LawFirmCRMClient.post<ApiResponse<PartyMatch[]>>(
    api.MATTER_MANAGEMENT.MATCH_PARTY,
    { data }
  );
};

export const useMatchMatterPartyMutation = () => {
  return useMutation({
    mutationFn: matchParty,
    onError: () => {
      // Matching is a progressive enhancement - fail silently so the user
      // can still create the party as a new record.
    },
  });
};
