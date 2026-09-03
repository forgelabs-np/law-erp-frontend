// ─── Invoice Status ──────────────────────────────────────────────────────────
export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELED";

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  PAID: "Paid",
  OVERDUE: "Overdue",
  CANCELED: "Canceled",
};

export const INVOICE_STATUS_COLORS: Record<
  InvoiceStatus,
  { bg: string; color: string }
> = {
  DRAFT: { bg: "gray.100", color: "gray.600" },
  SENT: { bg: "blue.100", color: "blue.600" },
  PAID: { bg: "green.100", color: "green.600" },
  OVERDUE: { bg: "red.100", color: "red.600" },
  CANCELED: { bg: "orange.100", color: "orange.600" },
};

// ─── Invoice Item ────────────────────────────────────────────────────────────
export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount?: number;
  sortOrder?: number;
}

// ─── Invoice ─────────────────────────────────────────────────────────────────
export interface Invoice {
  id: string;
  firmId: string;
  firmName: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  paymentTerms: string;
  notes: string;
  createdBy: string;
  createdAt: string;
  items?: InvoiceItem[];
}

// ─── Request Types ───────────────────────────────────────────────────────────
export interface CreateInvoicePayload {
  firmId: string;
  issueDate: string;
  dueDate: string;
  taxRate: number;
  paymentTerms: string;
  notes: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface UpdateInvoicePayload {
  issueDate: string;
  dueDate: string;
  taxRate: number;
  paymentTerms: string;
  notes: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface UpdateInvoiceStatusPayload {
  status: InvoiceStatus;
}

// ─── Query Parameters ────────────────────────────────────────────────────────
export interface InvoiceListParams {
  search?: string;
  status?: InvoiceStatus;
  firmId?: string;
  page?: number;
  size?: number;
}

// ─── Computed Helpers ────────────────────────────────────────────────────────
export const computeSubtotal = (items: InvoiceItem[]): number => {
  return items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  );
};

export const computeTaxAmount = (subtotal: number, taxRate: number): number => {
  return subtotal * (taxRate / 100);
};

export const computeTotal = (
  subtotal: number,
  taxRate: number
): number => {
  return subtotal + computeTaxAmount(subtotal, taxRate);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NPR",
  }).format(amount);
};

export const canEditInvoice = (invoice: Invoice): boolean =>
  invoice.status === "DRAFT";

export const canDeleteInvoice = (invoice: Invoice): boolean =>
  invoice.status === "DRAFT";

export const canSendInvoice = (invoice: Invoice): boolean =>
  invoice.status === "DRAFT" || invoice.status === "SENT";
