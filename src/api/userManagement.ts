import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiErrorResponse, ApiResponse } from "@/shared/types/response";
import {
  errorNotification,
  successNotification,
} from "@/shared/utils/notification";

export interface UserResponseType {
  id: string;
  username: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roleId: string;
}

export interface UserProfileType extends UserResponseType {
  mobileNo: string;
  designation: string;
  departmentId: string;
  joiningDate: string;
}

const getUsers = () => {
  return LawFirmCRMClient.get<ApiResponse<UserResponseType[]>>(
    api.USER_MANAGEMENT.USERS.GET_USERS
  );
};

export const useGetUsersQuery = () => {
  return useQuery({
    queryKey: [api.USER_MANAGEMENT.USERS.GET_USERS],
    queryFn: getUsers,
    select: (response) => response?.data?.data,
  });
};

const searchUsers = (params: any) => {
  return LawFirmCRMClient.get<ApiResponse<UserResponseType[]>>(
    api.USER_MANAGEMENT.USERS.SEARCH,
    { params }
  );
};

export const useSearchUsersQuery = (params: any) => {
  return useQuery({
    queryKey: [api.USER_MANAGEMENT.USERS.SEARCH, params],
    queryFn: () => searchUsers(params),
    select: (response) => response?.data?.data,
  });
};

const getUserProfile = async (id: string) => {
  return LawFirmCRMClient.get<ApiResponse<UserProfileType>>(
    api.USER_MANAGEMENT.USERS.GET_PROFILE.replace("{userId}", id)
  );
};

export const useUserProfileQuery = (id: string) => {
  return useQuery({
    queryKey: [`user-profile-${id}`],
    enabled: !!id,
    queryFn: () => getUserProfile(id),
    select: (response) => response?.data?.data,
  });
};

const getUserPermissions = async (id: string) => {
  return LawFirmCRMClient.get<ApiResponse<any>>(
    api.USER_MANAGEMENT.USERS.GET_PERMISSIONS.replace("{userId}", id)
  );
};

export const useUserPermissionsQuery = (id: string) => {
  return useQuery({
    queryKey: [`user-permissions-${id}`],
    enabled: !!id,
    queryFn: () => getUserPermissions(id),
    select: (response) => response?.data?.data,
  });
};

const getUserActivity = async (id: string) => {
  return LawFirmCRMClient.get<ApiResponse<any>>(
    api.USER_MANAGEMENT.USERS.GET_ACTIVITY.replace("{userId}", id)
  );
};

export const useUserActivityQuery = (id: string) => {
  return useQuery({
    queryKey: [`user-activity-${id}`],
    enabled: !!id,
    queryFn: () => getUserActivity(id),
    select: (response) => response?.data?.data,
  });
};

const resetPassword = (id: string) => {
  return LawFirmCRMClient.post<ApiResponse<any>>(
    api.USER_MANAGEMENT.USERS.RESET_PASSWORD.replace("{userId}", id)
  );
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      successNotification(
        response?.data?.message || "Password reset successfully"
      );
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

const bulkRoleChange = (data: { userIds: string[]; roleId: string }) => {
  return LawFirmCRMClient.post<ApiResponse<any>>(
    api.USER_MANAGEMENT.USERS.BULK_ROLE_CHANGE,
    data
  );
};

export const useBulkRoleChangeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkRoleChange,
    onSuccess: (response) => {
      successNotification(
        response?.data?.message || "Roles updated successfully"
      );
      queryClient.invalidateQueries({
        queryKey: [api.USER_MANAGEMENT.USERS.GET_USERS],
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

const bulkDeactivate = (data: { userIds: string[] }) => {
  return LawFirmCRMClient.post<ApiResponse<any>>(
    api.USER_MANAGEMENT.USERS.BULK_DEACTIVATE,
    data
  );
};

export const useBulkDeactivateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeactivate,
    onSuccess: (response) => {
      successNotification(
        response?.data?.message || "Users deactivated successfully"
      );
      queryClient.invalidateQueries({
        queryKey: [api.USER_MANAGEMENT.USERS.GET_USERS],
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
