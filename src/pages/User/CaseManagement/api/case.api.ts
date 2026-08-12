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
  Case,
  CaseFilters,
  CreateCaseRequest,
  UpdateCaseRequest,
  UpdateCaseStageRequest,
} from "../types/case.types";

export type { Case };

const getCases = (filters: CaseFilters) => {
  return LawFirmCRMClient.get<ApiResponse<PaginatedResponse<Case>>>(
    api.CASE_MANAGEMENT.GET_CASES,
    { params: filters }
  );
};

export const useGetCasesQuery = (filters: CaseFilters) => {
  return useQuery({
    queryKey: [api.CASE_MANAGEMENT.GET_CASES, filters],
    queryFn: () => getCases(filters),
    select: (response) => response?.data?.data,
  });
};

const getCaseByNumber = async (caseNumber: string) => {
  return LawFirmCRMClient.get<ApiResponse<Case>>(
    api.CASE_MANAGEMENT.GET_BY_CASE_NUMBER.replace("{caseNumber}", caseNumber)
  );
};

export const useGetCaseQuery = (caseNumber: string) => {
  return useQuery({
    queryKey: ["case", caseNumber],
    enabled: !!caseNumber,
    queryFn: () => getCaseByNumber(caseNumber),
    select: (response) => response?.data?.data,
  });
};

const createCase = (data: CreateCaseRequest) => {
  return LawFirmCRMClient.post<ApiResponse<Case>>(api.CASE_MANAGEMENT.POST, {
    data,
  });
};

export const useCreateCaseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCase,
    onSuccess: (response) => {
      toastSuccess(
        `Case ${response?.data?.data?.caseNumber} created successfully`
      );
      queryClient.invalidateQueries({
        queryKey: [api.CASE_MANAGEMENT.GET_CASES],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Failed to create case";
      toastFail(errorMessage);
    },
  });
};

const updateCase = (caseNumber: string, data: UpdateCaseRequest) => {
  return LawFirmCRMClient.put<ApiResponse<Case>>(
    api.CASE_MANAGEMENT.PUT.replace("{caseNumber}", caseNumber),
    { data }
  );
};

export const useUpdateCaseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      caseNumber,
      data,
    }: {
      caseNumber: string;
      data: UpdateCaseRequest;
    }) => updateCase(caseNumber, data),
    onSuccess: (response, variables) => {
      toastSuccess(`Case ${variables.caseNumber} updated successfully`);
      queryClient.invalidateQueries({
        queryKey: ["case", variables.caseNumber],
      });
      queryClient.invalidateQueries({
        queryKey: [api.CASE_MANAGEMENT.GET_CASES],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Failed to update case";
      toastFail(errorMessage);
    },
  });
};

const deleteCase = (caseNumber: string) => {
  return LawFirmCRMClient.delete<ApiResponse<void>>(
    api.CASE_MANAGEMENT.DELETE.replace("{caseNumber}", caseNumber)
  );
};

export const useDeleteCaseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCase,
    onSuccess: (_, caseNumber) => {
      toastSuccess(`Case ${caseNumber} deleted successfully`);
      queryClient.invalidateQueries({
        queryKey: [api.CASE_MANAGEMENT.GET_CASES],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Failed to delete case";
      toastFail(errorMessage);
    },
  });
};

const updateCaseStage = (caseNumber: string, data: UpdateCaseStageRequest) => {
  return LawFirmCRMClient.put<ApiResponse<Case>>(
    api.CASE_MANAGEMENT.UPDATE_STAGE.replace("{caseNumber}", caseNumber),
    { data }
  );
};

export const useUpdateCaseStageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      caseNumber,
      data,
    }: {
      caseNumber: string;
      data: UpdateCaseStageRequest;
    }) => updateCaseStage(caseNumber, data),
    onSuccess: (response, variables) => {
      toastSuccess(
        `Case stage updated to ${variables.data.stage} successfully`
      );
      queryClient.invalidateQueries({
        queryKey: ["case", variables.caseNumber],
      });
      queryClient.invalidateQueries({
        queryKey: [api.CASE_MANAGEMENT.GET_CASES],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Failed to update case stage";
      toastFail(errorMessage);
    },
  });
};
