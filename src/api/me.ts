import { useQuery } from "@tanstack/react-query";

import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiResponse } from "@/shared/types/response";

export interface UserModule {
  moduleCode: string;
  moduleName: string;
  icon: string;
  path: string;
  enabled: boolean;
  actions: string[];
  subModules?: UserModule[];
}

export interface CurrentUserResponse {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  roleId: string;
  firm: {
    id: string;
    name: string;
    code: string;
    trial: boolean;
    daysRemaining: number | null;
    trialExpiresAt: string | null;
    status: string;
  };
  permissions: string[];
  modules: UserModule[];
  [key: string]: unknown; // required to be assignable to User in auth.store.ts
}

const getCurrentUser = () => {
  return LawFirmCRMClient.get<ApiResponse<CurrentUserResponse>>("me");
};

export const useCurrentUserQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    select: (response) => response?.data?.data,
    enabled: options?.enabled ?? true,
  });
};

export { getCurrentUser };
