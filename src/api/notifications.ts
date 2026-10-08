import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import {
  ApiErrorResponse,
  ApiResponse,
  PaginatedResponse,
} from "@/shared/types/response";
import {
  errorNotification,
  successNotification,
} from "@/shared/utils/notification";

// ─── TYPES ──────────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: string;
  category: "SYSTEM" | "ALERT" | "BROADCAST" | string;
  title: string;
  body: string;
  referenceType?: string | null;
  referenceId?: string | null;
  read: boolean;
  readAt?: string | null;
  createdAt: string;
}

export interface NotificationPage {
  content: Notification[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface UnreadCountResponse {
  count: number;
}

export interface NotificationPreference {
  type: string;
  emailEnabled: boolean;
  locked: boolean;
}

export interface BroadcastPayload {
  title: string;
  body: string;
  audience: string;
}

// ─── SERVICE FUNCTIONS ───────────────────────────────────────────────────────

const getNotifications = (params: {
  unreadOnly: boolean;
  page: number;
  size: number;
}) => {
  return LawFirmCRMClient.get<ApiResponse<PaginatedResponse<Notification>>>(
    api.NOTIFICATIONS.LIST,
    { params }
  );
};

const getUnreadNotificationCount = () => {
  return LawFirmCRMClient.get<ApiResponse<UnreadCountResponse>>(
    api.NOTIFICATIONS.UNREAD_COUNT
  );
};

const markNotificationAsRead = (notificationId: string) => {
  return LawFirmCRMClient.post<ApiResponse<unknown>>(
    api.NOTIFICATIONS.MARK_READ.replace("{notificationId}", notificationId)
  );
};

const markAllNotificationsAsRead = () => {
  return LawFirmCRMClient.post<ApiResponse<unknown>>(
    api.NOTIFICATIONS.READ_ALL
  );
};

const getNotificationPreferences = () => {
  return LawFirmCRMClient.get<ApiResponse<NotificationPreference[]>>(
    api.NOTIFICATIONS.PREFERENCES
  );
};

const updateNotificationPreference = (data: {
  type: string;
  emailEnabled: boolean;
}) => {
  return LawFirmCRMClient.put<ApiResponse<unknown>>(
    api.NOTIFICATIONS.PREFERENCES,
    { data }
  );
};

const sendBroadcast = (data: BroadcastPayload) => {
  return LawFirmCRMClient.post<ApiResponse<unknown>>(
    api.NOTIFICATIONS.BROADCAST,
    { data }
  );
};

// ─── QUERY KEYS ─────────────────────────────────────────────────────────────

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (params: { unreadOnly: boolean; page: number; size: number }) =>
    [...notificationKeys.lists(), params] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
  preferences: () => [...notificationKeys.all, "preferences"] as const,
};

// ─── HOOKS ──────────────────────────────────────────────────────────────────

export const useNotificationsQuery = (params: {
  unreadOnly: boolean;
  page: number;
  size: number;
}) => {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => getNotifications(params),
    select: (response) => response?.data?.data,
  });
};

export const useUnreadCountQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadNotificationCount,
    select: (response) => response?.data?.data?.count ?? 0,
    refetchInterval: options?.enabled !== false ? 60000 : false,
    refetchIntervalInBackground: false,
  });
};

export const useMarkNotificationAsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount(),
      });
    },
    onError: () => {
      errorNotification("Failed to mark notification as read");
    },
  });
};

export const useMarkAllNotificationsAsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount(),
      });
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: () => {
      errorNotification("Failed to mark all notifications as read");
    },
  });
};

export const useNotificationPreferencesQuery = () => {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: getNotificationPreferences,
    select: (response) => response?.data?.data,
  });
};

export const useUpdateNotificationPreferenceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNotificationPreference,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.preferences(),
      });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Failed to update preference";
      errorNotification(errorMessage);
    },
  });
};

export const useBroadcastMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendBroadcast,
    onSuccess: () => {
      successNotification("Announcement sent successfully");
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error: ApiErrorResponse) => {
      const errorMessage =
        error?.response?.data?.message ??
        error?.response?.data?.error?.errorMessage ??
        "Failed to send announcement";
      errorNotification(errorMessage);
    },
  });
};
