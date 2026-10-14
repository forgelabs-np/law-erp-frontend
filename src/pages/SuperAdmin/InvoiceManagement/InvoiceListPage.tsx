import {
  Button,
  HStack,
  IconButton,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Send,
  Download,
} from "lucide-react";

import {
  useInvoicesQuery,
  useDeleteInvoiceMutation,
  useSendInvoiceMutation,
  useDownloadInvoicePdfMutation,
} from "@/api/invoiceManagement";
import { Datatable } from "@/shared/components";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";
import { Pagination } from "@/shared/components/datatable/pagination/Pagination";
import {
  Invoice,
  InvoiceListParams,
  INVOICE_STATUS_LABELS,
  formatCurrency,
  canEditInvoice,
  canDeleteInvoice,
} from "@/shared/types/invoice";

import { InvoiceStatusBadge } from "./components/InvoiceStatusBadge";
import { InvoiceFilters } from "./components/InvoiceFilters";

const DEFAULT_PAGE_SIZE = 10;

const SEARCH_DEBOUNCE_MS = 300;

const defaultFilters: InvoiceListParams = {
  search: undefined,
  status: undefined,
  firmId: undefined,
  page: 0,
  size: DEFAULT_PAGE_SIZE,
};

const InvoiceListPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<InvoiceListParams>(defaultFilters);
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);

  // Debounced copy of the search box — the query below uses this, so typing
  // does not fire an invoices request per keystroke. Status/firm filters are
  // discrete choices and still apply immediately.
  const [appliedSearch, setAppliedSearch] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAppliedSearch(filters.search);
      // The page reset for a search lands HERE (with the settled search) so
      // typing alone never changes the query key. Same-value update = no-op.
      setFilters((prev) => (prev.page === 0 ? prev : { ...prev, page: 0 }));
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [filters.search]);

  // Raw `filters.search` is excluded so keystrokes never reach the query.
  const queryFilters = useMemo<InvoiceListParams>(
    () => ({ ...filters, search: appliedSearch }),
    [filters, appliedSearch]
  );

  const { data: invoiceData, isLoading } = useInvoicesQuery(queryFilters);
  const { mutate: deleteInvoice, isPending: isDeletePending } =
    useDeleteInvoiceMutation();
  const { mutate: sendInvoice, isPending: isSendPending } =
    useSendInvoiceMutation();
  const { mutate: downloadPdf, isPending: isPdfPending } =
    useDownloadInvoicePdfMutation();

  const invoices = invoiceData?.data?.content ?? [];
  const totalElements = invoiceData?.data?.totalElements ?? 0;
  const totalPages = invoiceData?.data?.totalPages ?? 0;
  const isFirstPage = invoiceData?.data?.first ?? true;
  const isLastPage = invoiceData?.data?.last ?? true;

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value || undefined,
      // The search box is debounced: its page reset lands together with the
      // settled search (see the effect above) instead of firing immediately.
      page: field === "search" ? prev.page : 0,
    }));
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    // Reset applies immediately — no need to wait out the debounce.
    setAppliedSearch(undefined);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page: page - 1 }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, size: pageSize, page: 0 }));
  };

  const columns: Array<ColumnDef<Invoice>> = useMemo(
    () => [
      {
        accessorKey: "invoiceNumber",
        header: "Invoice #",
        cell: ({ row }) => (
          <Text fontWeight="500" fontSize="sm">
            {row.original.invoiceNumber}
          </Text>
        ),
      },
      {
        accessorKey: "firmName",
        header: "Firm",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.600">
            {row.original.firmName}
          </Text>
        ),
      },
      {
        accessorKey: "issueDate",
        header: "Issue Date",
        cell: ({ row }) => (
          <Text fontSize="sm">
            {new Date(row.original.issueDate).toLocaleDateString()}
          </Text>
        ),
      },
      {
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ row }) => (
          <Text fontSize="sm">
            {new Date(row.original.dueDate).toLocaleDateString()}
          </Text>
        ),
      },
      {
        accessorKey: "total",
        header: "Amount",
        cell: ({ row }) => (
          <Text fontWeight="600" fontSize="sm">
            {formatCurrency(row.original.total)}
          </Text>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <InvoiceStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
          <Text fontSize="sm" color="gray.500">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </Text>
        ),
      },
      {
        accessorKey: "actions",
        header: "",
        cell: ({ row }) => {
          const invoice = row.original;
          const isDraft = canEditInvoice(invoice);

          return (
            <MenuRoot positioning={{ placement: "right" }}>
              <MenuTrigger asChild>
                <IconButton
                  aria-label="Actions"
                  variant="ghost"
                  size="sm"
                  borderRadius="lg"
                >
                  <MoreHorizontal size={16} />
                </IconButton>
              </MenuTrigger>
              <Portal>
                <MenuPositioner>
                  <MenuContent
                    minW="180px"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="gray.100"
                  >
                    <MenuItem
                      value="view"
                      onClick={() =>
                        navigate(`/super-admin/invoices/${invoice.id}`)
                      }
                    >
                      <Eye size={14} />
                      View Details
                    </MenuItem>
                    {isDraft && (
                      <MenuItem
                        value="edit"
                        onClick={() =>
                          navigate(`/super-admin/invoices/${invoice.id}/edit`)
                        }
                      >
                        <Pencil size={14} />
                        Edit Invoice
                      </MenuItem>
                    )}
                    {isDraft && (
                      <MenuItem
                        value="send"
                        onClick={() => sendInvoice(invoice.id)}
                        disabled={isSendPending}
                      >
                        <Send size={14} />
                        Send Invoice
                      </MenuItem>
                    )}
                    <MenuItem
                      value="download"
                      onClick={() => downloadPdf(invoice.id)}
                      disabled={isPdfPending}
                    >
                      <Download size={14} />
                      Download PDF
                    </MenuItem>
                    {isDraft && (
                      <MenuItem
                        value="delete"
                        color="red.600"
                        onClick={() => setDeleteTarget(invoice)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </MenuItem>
                    )}
                  </MenuContent>
                </MenuPositioner>
              </Portal>
            </MenuRoot>
          );
        },
      },
    ],
    [navigate, sendInvoice, downloadPdf, isSendPending, isPdfPending]
  );

  const hasFilters = !!(filters.search || filters.status || filters.firmId);

  return (
    <Stack gap={4} padding={2}>
      {/* Header */}
      <HStack justifyContent="space-between" alignItems="center">
        <Stack gap={1}>
          <Text textStyle="heading_4">Invoices</Text>
          <Text textStyle="paragraph_regular" color="gray.500">
            Manage and track invoices for your law firms
          </Text>
        </Stack>
        <Button
          variant="primary"
          onClick={() => navigate("/super-admin/invoices/create")}
        >
          <Plus size={16} color="white" /> Create Invoice
        </Button>
      </HStack>

      {/* Filters */}
      <InvoiceFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Table */}
      {isLoading ? (
        <Stack gap={4} p={8} alignItems="center" justifyContent="center">
          <Text color="gray.500">Loading invoices...</Text>
        </Stack>
      ) : invoices.length === 0 ? (
        <Stack
          gap={4}
          p={12}
          alignItems="center"
          justifyContent="center"
          bg="white"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
        >
          <Text color="gray.500" textStyle="paragraph_large">
            {hasFilters ? "No invoices match your filters" : "No invoices yet"}
          </Text>
          {hasFilters ? (
            <Button size="sm" variant="outline" onClick={handleReset}>
              Clear Filters
            </Button>
          ) : (
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate("/super-admin/invoices/create")}
            >
              <Plus size={14} color="white" /> Create Your First Invoice
            </Button>
          )}
        </Stack>
      ) : (
        <>
          <Datatable isLoading={false} columns={columns} data={invoices} />
          {totalPages > 1 && (
            <Stack align="center">
              <Text fontSize="sm" color="gray.500">
                Showing {filters.page! * (filters.size || 10) + 1}–
                {Math.min(
                  (filters.page! + 1) * (filters.size || 10),
                  totalElements
                )}{" "}
                of {totalElements} invoices
              </Text>
              <Pagination
                currentPage={(filters.page ?? 0) + 1}
                pageCount={totalPages}
                pageSize={filters.size || DEFAULT_PAGE_SIZE}
                onPaginationChange={handlePageChange}
                setPageSize={handlePageSizeChange}
                isFirstPage={isFirstPage}
                isLastPage={isLastPage}
              />
            </Stack>
          )}
        </>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.invoiceNumber}"?`}
        action="delete this invoice"
        handleSubmit={() => {
          if (deleteTarget) {
            deleteInvoice(deleteTarget.id, {
              onSuccess: () => setDeleteTarget(null),
            });
          }
        }}
        submitActionPending={isDeletePending}
      />
    </Stack>
  );
};

export default InvoiceListPage;
