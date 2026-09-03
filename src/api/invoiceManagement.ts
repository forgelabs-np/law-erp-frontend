import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  CreateInvoicePayload,
  Invoice,
  InvoiceListParams,
  UpdateInvoicePayload,
  UpdateInvoiceStatusPayload,
} from "@/shared/types/invoice";
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

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const INVOICE_QUERY_KEYS = {
  LIST: (params: InvoiceListParams) =>
    ["invoices", "list", params] as const,
  DETAIL: (id: string) => ["invoices", "detail", id] as const,
};

// ─── API Service Functions ───────────────────────────────────────────────────

const getInvoices = (params: InvoiceListParams) => {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.firmId) searchParams.set("firmId", params.firmId);
  searchParams.set("page", String(params.page ?? 0));
  searchParams.set("size", String(params.size ?? 10));
  const queryString = searchParams.toString();
  const url = `${api.INVOICE_MANAGEMENT.LIST}${queryString ? `?${queryString}` : ""}`;
  return LawFirmCRMClient.get<ApiResponse<PaginatedResponse<Invoice>>>(url);
};

const getInvoiceById = (id: string) => {
  const url = api.INVOICE_MANAGEMENT.GET_BY_ID.replace("{id}", id);
  return LawFirmCRMClient.get<ApiResponse<Invoice>>(url);
};

const createInvoice = (payload: CreateInvoicePayload) => {
  return LawFirmCRMClient.post<ApiResponse<Invoice>>(
    api.INVOICE_MANAGEMENT.CREATE,
    { data: payload }
  );
};

const updateInvoice = ({ id, payload }: { id: string; payload: UpdateInvoicePayload }) => {
  const url = api.INVOICE_MANAGEMENT.UPDATE.replace("{id}", id);
  return LawFirmCRMClient.put<ApiResponse<Invoice>>(url, { data: payload });
};

const deleteInvoice = (id: string) => {
  const url = api.INVOICE_MANAGEMENT.DELETE.replace("{id}", id);
  return LawFirmCRMClient.delete<ApiResponse<string>>(url);
};

const sendInvoice = (id: string) => {
  const url = api.INVOICE_MANAGEMENT.SEND.replace("{id}", id);
  return LawFirmCRMClient.post<ApiResponse<string>>(url);
};

const updateInvoiceStatus = ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateInvoiceStatusPayload;
}) => {
  const url = api.INVOICE_MANAGEMENT.UPDATE_STATUS.replace("{id}", id);
  return LawFirmCRMClient.patch<ApiResponse<Invoice>>(url, { data: payload });
};

const downloadInvoicePdf = (id: string) => {
  const url = api.INVOICE_MANAGEMENT.DOWNLOAD_PDF.replace("{id}", id);
  return LawFirmCRMClient.get(url, { responseType: "blob" });
};

// ─── React Query Hooks ───────────────────────────────────────────────────────

export const useInvoicesQuery = (params: InvoiceListParams) => {
  return useQuery({
    queryKey: INVOICE_QUERY_KEYS.LIST(params),
    queryFn: async () => {
      const res = await getInvoices(params);
      return res.data;
    },
  });
};

export const useInvoiceQuery = (id: string) => {
  return useQuery({
    queryKey: INVOICE_QUERY_KEYS.DETAIL(id),
    queryFn: async () => {
      const res = await getInvoiceById(id);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInvoice,
    onSuccess: (res) => {
      successNotification(res.data?.message || "Invoice created successfully");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (error: ApiErrorResponse) => {
      const msg =
        error?.response?.data?.message ?? "Failed to create invoice";
      errorNotification(msg);
    },
  });
};

export const useUpdateInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInvoice,
    onSuccess: (res, variables) => {
      successNotification(res.data?.message || "Invoice updated successfully");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({
        queryKey: INVOICE_QUERY_KEYS.DETAIL(variables.id),
      });
    },
    onError: (error: ApiErrorResponse) => {
      const msg =
        error?.response?.data?.message ?? "Failed to update invoice";
      errorNotification(msg);
    },
  });
};

export const useDeleteInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInvoice,
    onSuccess: (res) => {
      successNotification(res.data?.message || "Invoice deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (error: ApiErrorResponse) => {
      const msg =
        error?.response?.data?.message ?? "Failed to delete invoice";
      errorNotification(msg);
    },
  });
};

export const useSendInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendInvoice,
    onSuccess: (res, id) => {
      successNotification(res.data?.message || "Invoice sent successfully");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({
        queryKey: INVOICE_QUERY_KEYS.DETAIL(id),
      });
    },
    onError: (error: ApiErrorResponse) => {
      const msg =
        error?.response?.data?.message ?? "Failed to send invoice";
      errorNotification(msg);
    },
  });
};

export const useUpdateInvoiceStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInvoiceStatus,
    onSuccess: (res, variables) => {
      successNotification(
        res.data?.message || "Invoice status updated successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({
        queryKey: INVOICE_QUERY_KEYS.DETAIL(variables.id),
      });
    },
    onError: (error: ApiErrorResponse) => {
      const msg =
        error?.response?.data?.message ?? "Failed to update invoice status";
      errorNotification(msg);
    },
  });
};

export const useDownloadInvoicePdfMutation = () => {
  return useMutation({
    mutationFn: downloadInvoicePdf,
    onSuccess: (res, id) => {
      const blob = new Blob([res.data as any], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error: ApiErrorResponse) => {
      const msg =
        error?.response?.data?.message ?? "Failed to download invoice PDF";
      errorNotification(msg);
    },
  });
};
