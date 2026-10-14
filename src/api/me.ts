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

export interface FirmInfo {
  id: string;
  name: string;
  code: string;
  trial: boolean;
  daysRemaining: number | null;
  trialExpiresAt: string | null;
  status: string;
  brandPrimaryHex?: string | null;
  brandSecondaryHex?: string | null;
  isPersonalColor?: boolean;
  logoUrl?: string | null;
  logoAllowed?: boolean;
  [key: string]: unknown;
}

export interface CurrentUserResponse {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  roleId: string;
  /** Display name of the product/firm (informational, not used for theming). */
  appName?: string | null;
  /**
   * Firm branding from `/me`. Hex colors (e.g. `#1A237E`); may be null when
   * the firm has no custom brand — the frontend then keeps the default
   * theme (see `createBrandSystem` in `@/shared/theme`).
   */
  brandColorPrimary?: string | null;
  brandColorSecondary?: string | null;
  brandPrimaryHex?: string | null;
  brandSecondaryHex?: string | null;
  isPersonalColor?: boolean;
  logoUrl?: string | null;
  logoAllowed?: boolean;
  firm: FirmInfo;
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
