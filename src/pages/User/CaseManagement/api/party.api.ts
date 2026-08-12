import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiErrorResponse, ApiResponse } from "@/shared/types/response";
import { toastFail, toastSuccess } from "@/shared/toast";

import {
  CaseParty,
  CreatePartyRequest,
  LinkPartyRequest,
  PartyMatchRequest,
  PartyMatchResult,
  UpdatePartyRequest,
} from "../types/case.types";

export type { CaseParty };

const addParty = (caseNumber: string, data: CreatePartyRequest) => {
  return LawFirmCRMClient.post<ApiResponse<CaseParty>>(
    api.CASE_MANAGEMENT.ADD_PARTY.replace("{caseNumber}", caseNumber),
    { data }
  );
};

export const useAddPartyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      caseNumber,
      data,
    }: {
      caseNumber: string;
      data: CreatePartyRequest;
    }) => addParty(caseNumber, data),
    onSuccess: (_, variables) => {
      toastSuccess("Party added successfully");
      queryClient.invalidateQueries({
        queryKey: ["case-parties", variables.caseNumber],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Failed to add party";
      toastFail(errorMessage);
    },
  });
};

const updateParty = (
  caseNumber: string,
  partyId: string,
  data: UpdatePartyRequest
) => {
  return LawFirmCRMClient.put<ApiResponse<CaseParty>>(
    api.CASE_MANAGEMENT.UPDATE_PARTY.replace(
      "{caseNumber}",
      caseNumber
    ).replace("{partyId}", partyId),
    { data }
  );
};

export const useUpdatePartyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      caseNumber,
      partyId,
      data,
    }: {
      caseNumber: string;
      partyId: string;
      data: UpdatePartyRequest;
    }) => updateParty(caseNumber, partyId, data),
    onSuccess: (_, variables) => {
      toastSuccess("Party updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["case-parties", variables.caseNumber],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Failed to update party";
      toastFail(errorMessage);
    },
  });
};

const deleteParty = (caseNumber: string, partyId: string) => {
  return LawFirmCRMClient.delete<ApiResponse<void>>(
    api.CASE_MANAGEMENT.DELETE_PARTY.replace(
      "{caseNumber}",
      caseNumber
    ).replace("{partyId}", partyId)
  );
};

export const useDeletePartyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      caseNumber,
      partyId,
    }: {
      caseNumber: string;
      partyId: string;
    }) => deleteParty(caseNumber, partyId),
    onSuccess: (_, variables) => {
      toastSuccess("Party removed successfully");
      queryClient.invalidateQueries({
        queryKey: ["case-parties", variables.caseNumber],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Failed to remove party";
      toastFail(errorMessage);
    },
  });
};

const linkParty = (
  caseNumber: string,
  partyId: string,
  data: LinkPartyRequest
) => {
  return LawFirmCRMClient.put<ApiResponse<CaseParty>>(
    api.CASE_MANAGEMENT.LINK_PARTY.replace("{caseNumber}", caseNumber).replace(
      "{partyId}",
      partyId
    ),
    { data }
  );
};

export const useLinkPartyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      caseNumber,
      partyId,
      data,
    }: {
      caseNumber: string;
      partyId: string;
      data: LinkPartyRequest;
    }) => linkParty(caseNumber, partyId, data),
    onSuccess: (_, variables) => {
      toastSuccess("Party linked to client successfully");
      queryClient.invalidateQueries({
        queryKey: ["case-parties", variables.caseNumber],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Failed to link party";
      toastFail(errorMessage);
    },
  });
};

const matchParty = (data: PartyMatchRequest) => {
  return LawFirmCRMClient.post<ApiResponse<PartyMatchResult[]>>(
    api.CASE_MANAGEMENT.MATCH_PARTY,
    { data }
  );
};

export const useMatchPartyMutation = () => {
  return useMutation({
    mutationFn: matchParty,
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Failed to match party";
      // Don't show toast for match failures - this is expected to fail silently
      console.error(errorMessage);
    },
  });
};
