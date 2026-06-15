import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ModuleMenuPayload } from "@/pages/SuperAdmin/MenuSetup/types";
import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiErrorResponse, ApiResponse } from "@/shared/types/response";
import {
  errorNotification,
  successNotification,
} from "@/shared/utils/notification";

export interface SubMenuResponse {
  id?: string;
  displayOrder: string;
  name: string;
  code: string;
  privilege: string[];
  active?: boolean;
}

export interface ModuleMenuResponse {
  id: string;
  moduleType: string;
  menuName: string;
  menuCode: string;
  displayOrder: string;
  privilege: string[];
  subMenus: SubMenuResponse[];
  isActive?: boolean;
}

const getModuleMenus = () => {
  return LawFirmCRMClient.get<ApiResponse<ModuleMenuResponse[]>>(
    api.USER_MANAGEMENT.MENU_MANAGEMENT.MODULE_MENUS
  );
};

export const useGetModuleMenusQuery = () => {
  return useQuery({
    queryKey: [api.USER_MANAGEMENT.MENU_MANAGEMENT.MODULE_MENUS],
    queryFn: getModuleMenus,
    select: (response) => response?.data,
  });
};

const addEditModuleMenu = async (payload: ModuleMenuPayload) => {
  const parentData = {
    data: {
      ...(payload.id ? { id: payload.id } : {}),
      name: payload.menuName,
      code: payload.menuCode,
      displayOrder: Number(payload.displayOrder) || 0,
      isActive: true,
    },
  };

  const response = await LawFirmCRMClient.post(
    api.USER_MANAGEMENT.MENU_MANAGEMENT.MODULE_MENUS,
    parentData
  );

  const parentId = payload.id || response.data?.data?.id || response.data?.data;

  if (payload.subMenus && payload.subMenus.length > 0 && parentId) {
    const subPromises = payload.subMenus.map((sub) => {
      const subData = {
        data: {
          ...(sub.id ? { id: sub.id } : {}),
          name: sub.menuName,
          code: sub.menuCode,
          displayOrder: Number(sub.displayOrder) || 0,
          parentId: parentId,
          isActive: true,
        },
      };
      return LawFirmCRMClient.post(
        api.USER_MANAGEMENT.MENU_MANAGEMENT.MODULE_MENUS,
        subData
      );
    });
    await Promise.all(subPromises);
  }

  return response;
};

export const useAddEditModuleMenuMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addEditModuleMenu,
    onSuccess: (response) => {
      successNotification(response?.data?.message || "Menu saved successfully");
      queryClient.invalidateQueries({
        queryKey: [api.USER_MANAGEMENT.MENU_MANAGEMENT.MODULE_MENUS],
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ?? "Something went wrong!";
      errorNotification(errorMessage);
    },
  });
};

const getModuleMenuById = async (id: string) => {
  return LawFirmCRMClient.get(
    api.USER_MANAGEMENT.MENU_MANAGEMENT.GET_BY_ID.replace("{moduleId}", id)
  );
};

export const useModuleMenuByIdQuery = (id: string) => {
  return useQuery({
    queryKey: [`module-menu-${id}`],
    enabled: !!id,
    queryFn: async () => {
      return getModuleMenuById(id);
    },
    select: (data) => data?.data?.data,
  });
};

const toggleModuleMenu = (id: string) => {
  const url = api.USER_MANAGEMENT.MENU_MANAGEMENT.TOGGLE.replace(
    "{moduleId}",
    id
  );
  return LawFirmCRMClient.patch(url);
};

export const useToggleModuleMenuMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleModuleMenu(id),
    onSuccess: (response, id) => {
      successNotification(response?.data?.message || "Status updated");
      queryClient.invalidateQueries({
        queryKey: [api.USER_MANAGEMENT.MENU_MANAGEMENT.MODULE_MENUS],
      });
      queryClient.invalidateQueries({ queryKey: [`module-menu-${id}`] });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ?? "Something went wrong!";
      errorNotification(errorMessage);
    },
  });
};
