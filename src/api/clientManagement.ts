import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiErrorResponse, ApiResponse, PaginatedResponse } from "@/shared/types/response";
import {
  errorNotification,
  successNotification,
} from "@/shared/utils/notification";

import { Client, ClientPayload } from "@/pages/User/ClientManagement/types";

export type { Client };

const getClients = () => {
  return LawFirmCRMClient.get<ApiResponse<PaginatedResponse<Client>>>(
    api.CLIENT_MANAGEMENT.GET_CLIENTS
  );
};

export const useGetClientsQuery = () => {
  return useQuery({
    queryKey: [api.CLIENT_MANAGEMENT.GET_CLIENTS],
    queryFn: getClients,
    select: (response) => response?.data?.data,
  });
};

const getClientById = async (id: string) => {
  return LawFirmCRMClient.get<ApiResponse<Client>>(
    api.CLIENT_MANAGEMENT.GET_BY_ID.replace("{clientId}", id)
  );
};

export const useClientByIdQuery = (id: string) => {
  return useQuery({
    queryKey: [`client-${id}`],
    enabled: !!id,
    queryFn: () => getClientById(id),
    select: (response) => response?.data?.data,
  });
};

const createClient = (data: ClientPayload) => {
  return LawFirmCRMClient.post<ApiResponse<any>>(api.CLIENT_MANAGEMENT.POST, {
    data,
  });
};

export const useCreateClientMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClient,
    onSuccess: (response) => {
      successNotification(
        response?.data?.message || "Client created successfully"
      );
      queryClient.invalidateQueries({
        queryKey: [api.CLIENT_MANAGEMENT.GET_CLIENTS],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Something went wrong!";
      errorNotification(errorMessage);
    },
  });
};

const togglePortalAccess = (id: string, enabled: boolean) => {
  return LawFirmCRMClient.patch<ApiResponse<any>>(
    api.CLIENT_MANAGEMENT.TOGGLE_PORTAL_ACCESS.replace("{clientId}", id),
    { data: enabled }
  );
};

export const useTogglePortalAccessMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      togglePortalAccess(id, enabled),
    onSuccess: (response) => {
      successNotification(
        response?.data?.message || "Portal access updated successfully"
      );
      queryClient.invalidateQueries({
        queryKey: [api.CLIENT_MANAGEMENT.GET_CLIENTS],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Something went wrong!";
      errorNotification(errorMessage);
    },
  });
};
