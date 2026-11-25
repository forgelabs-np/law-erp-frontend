import { ApiErrorResponse } from "@/shared/types/response";

/**
 * Extracts the backend's human-readable error message.
 *
 * The API returns `{ success, message, responseCode }` for handled failures and
 * an older `{ error: { errorMessage } }` shape for a few legacy endpoints — both
 * are supported so meaningful backend messages are shown instead of generic
 * copy.
 */
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const apiError = error as ApiErrorResponse | undefined;
  return (
    apiError?.response?.data?.message ??
    apiError?.response?.data?.error?.errorMessage ??
    fallback
  );
};

/** HTTP status of a failed API call, or `undefined` when unavailable. */
export const getApiErrorStatus = (error: unknown): number | undefined => {
  const apiError = error as
    | { response?: { status?: number; data?: { responseCode?: number } } }
    | undefined;
  return apiError?.response?.status ?? apiError?.response?.data?.responseCode;
};
